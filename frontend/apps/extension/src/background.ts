import { createClerkClient } from "@clerk/chrome-extension/background";
import { assertPermittedEvidence, captureSelectedDom, supportedOffer, type LegacyCapture } from "./capture";
import { runCollection } from "./collection-runner";
import { capturePublicHtml, MAX_HTML_BUNDLE_BYTES, type HtmlSource } from "./html-capture";
import { captureLinkedDom, factoryUrl, shopUrl, restoreCollectionJob, type CollectionJob, type FactorySelection, type ShopSelection, type SupplierBundle } from "./linked-capture";

const JOB_KEY = "collectionJob";
const ORIGINS = ["https://*.1688.com/*"];
let running = false;

async function authenticate(ownerId: string): Promise<string> {
  const clerk = await createClerkClient({ publishableKey: VCT_CLERK_PUBLISHABLE_KEY, syncHost: VCT_CLERK_SYNC_HOST });
  if (clerk.user?.id !== ownerId || !clerk.session) throw new Error("Account changed");
  const token = await clerk.session.getToken({ skipCache: true });
  if (!token) throw new Error("Sign in first");
  return token;
}

async function post(phase: "begin" | "finish", bundle: SupplierBundle, ownerId: string): Promise<void> {
  const body = JSON.stringify(bundle);
  if (new TextEncoder().encode(body).length > (bundle.html_sources?.length ? MAX_HTML_BUNDLE_BYTES : 32_768)) throw new Error("Collection too large");
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await authenticate(ownerId);
    try {
      const response = await fetch(`${VCT_WEB_ORIGIN}/api/v1/analyses/collection/${phase}`, {
        method: "POST", credentials: "omit", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body, signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        if (response.status >= 500 && attempt === 0) continue;
        if (response.status >= 500 && phase === "begin") {
          await chrome.storage.local.set({ lastCapture: { analysisId: bundle.job_id, ownerId, sourceUrl: bundle.product.source_url } });
          throw Object.assign(new Error("Reservation response lost"), { reservationUncertain: true });
        }
        throw new Error(`Collection request failed (${response.status})`);
      }
      return;
    } catch (error) {
      if (!(error instanceof Error) || !["TimeoutError", "TypeError"].includes(error.name)) throw error;
      if (attempt === 1) {
        if (phase === "begin") {
          // Preserve the same reservation ID if a committed begin response was lost.
          await chrome.storage.local.set({ lastCapture: { analysisId: bundle.job_id, ownerId, sourceUrl: bundle.product.source_url } });
          throw Object.assign(new Error("Reservation response lost"), { reservationUncertain: true });
        }
        throw error;
      }
    }
  }
  throw new Error("Collection request failed");
}

async function start(tabId: number, ownerId: string, sourceUrl: string, respond: (value: unknown) => void) {
  if (running) { respond({ error: "A collection is already running. Open the existing result." }); return; }
  running = true;
  let retryJob: CollectionJob | null = null;
  try {
    const stored = await chrome.storage.local.get(JOB_KEY);
    const previous = restoreCollectionJob(stored[JOB_KEY], ownerId);
    if (previous?.reservationUncertain && previous.sourceUrl === sourceUrl) retryJob = previous;
    if (previous && ["STARTING", "SHOP", "FACTORY"].includes(previous.stage) && Date.now() - previous.startedAt < 70_000) {
      respond({ error: "A collection is already running. Open the existing result." }); running = false; return;
    }
  } catch { running = false; respond({ error: "Could not restore collection state" }); return; }
  const ownedTabs = new Set<number>();
  let shopTabId: number | undefined;
  let factoryTabId: number | undefined;
  let responded = false;
  const job: CollectionJob = { id: retryJob?.id || crypto.randomUUID(), ownerId, sourceUrl, startedAt: Date.now(), stage: "STARTING" };
  async function inject<T>(id: number, mode: Parameters<typeof captureLinkedDom>[0], expectedProduct?: string): Promise<T | null> {
    const [result] = await chrome.scripting.executeScript({ target: { tabId: id }, func: captureLinkedDom, args: [mode, expectedProduct] });
    return result?.result as T | null;
  }
  async function waitSelection<T>(id: number, mode: "SHOP" | "FACTORY", expected: string, deadline: number): Promise<T | null> {
    const until = Math.min(deadline, Date.now() + 15_000);
    while (Date.now() < until) {
      const tab = await chrome.tabs.get(id);
      const identity = mode === "SHOP" ? shopUrl(tab.url || "") : factoryUrl(tab.url || "");
      if (tab.status === "complete" && identity !== expected) return null; // login/challenge/redirect; no bypass
      if (identity === expected) {
        try { const selection = await inject<T>(id, mode); if (selection) return selection; } catch { /* loading */ }
      }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    return null;
  }
  try {
    if (retryJob) {
      const token = await authenticate(ownerId);
      const existing = await fetch(`${VCT_WEB_ORIGIN}/api/v1/analyses/${retryJob.id}`, {
        credentials: "omit", headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000),
      });
      if (existing.ok) {
        await chrome.storage.local.set({ [JOB_KEY]: { ...job, stage: "ASSESSING" }, lastCapture: { analysisId: job.id, ownerId, sourceUrl } });
        respond({ id: job.id }); responded = true;
        return; // Existing reservation recovers its stored product after its deadline.
      }
      if (existing.status !== 404) throw new Error("Could not reconcile reservation");
    }
    await runCollection(job, {
      now: Date.now,
      html: async (page, source) => {
        const id = page === "PRODUCT" ? tabId : page === "SHOP" ? shopTabId : factoryTabId;
        if (!id) return null;
        const [result] = await chrome.scripting.executeScript({ target: { tabId: id }, func: capturePublicHtml, args: [page, source] });
        const captured = result?.result as HtmlSource | null;
        if (captured) {
          assertPermittedEvidence(captured);
          await authenticate(ownerId);
          try {
            await chrome.downloads.download({
              url: "data:text/html;charset=utf-8," + encodeURIComponent(captured.html),
              filename: `VCT Connect/${job.id}/${page.toLowerCase()}.html`,
              saveAs: false, conflictAction: "uniquify",
            });
          } catch { /* A disk download failure must not block HTML upload and assessment. */ }
        }
        return captured;
      },
      product: async () => {
        await authenticate(ownerId);
        const tab = await chrome.tabs.get(tabId);
        if (supportedOffer(tab.url || "")?.sourceUrl !== sourceUrl) throw new Error("Product changed");
        const [result] = await chrome.scripting.executeScript({ target: { tabId }, func: captureSelectedDom });
        const product = result?.result;
        if (!product || !("offer_id" in product)) throw new Error("Unsupported product");
        const shopLink = await inject<string>(tabId, "PRODUCT_LINK", sourceUrl);
        if (supportedOffer((await chrome.tabs.get(tabId)).url || "")?.sourceUrl !== sourceUrl) throw new Error("Product changed");
        return { product: product as LegacyCapture, ...(shopLink ? { shopLink } : {}) };
      },
      begin: bundle => post("begin", bundle, ownerId),
      finish: bundle => post("finish", bundle, ownerId),
      permitted: () => chrome.permissions.contains({ origins: ORIGINS }),
      save: value => chrome.storage.local.set({ [JOB_KEY]: value }),
      accepted: async value => {
        await chrome.storage.local.set({ lastCapture: { analysisId: value.id, ownerId, sourceUrl } });
        respond({ id: value.id }); responded = true;
        try { await chrome.tabs.create({ url: `${VCT_WEB_ORIGIN}/?analysis=${encodeURIComponent(value.id)}`, active: false }); } catch { /* collection still continues */ }
      },
      shop: async (url, deadline) => {
        const tab = await chrome.tabs.create({ url, active: false });
        if (!tab.id) return null;
        ownedTabs.add(tab.id); shopTabId = tab.id;
        return waitSelection<ShopSelection>(tab.id, "SHOP", url, deadline);
      },
      factory: async (shop, deadline) => {
        let profile = shop.factory_url ? factoryUrl(shop.factory_url) : null;
        let target: number | undefined;
        if (!profile && shopTabId) {
          // Follow the rendered navigation control; no page globals or private APIs.
          const newTabs = new Set<number>();
          const onCreated = (tab: chrome.tabs.Tab) => { if (tab.openerTabId === shopTabId && tab.id) newTabs.add(tab.id); };
          chrome.tabs.onCreated.addListener(onCreated);
          try {
            if (await inject<string>(shopTabId, "OPEN_FACTORY") !== "CLICKED") return null;
            const until = Math.min(deadline, Date.now() + 8000);
            while (Date.now() < until && !profile) {
              const candidates: number[] = [shopTabId!, ...newTabs];
              for (const id of candidates) {
                const tab: chrome.tabs.Tab = await chrome.tabs.get(id);
                const found = factoryUrl(tab.url || "");
                if (found) { profile = found; target = id; if (id !== shopTabId) ownedTabs.add(id); break; }
              }
              if (!profile) await new Promise(resolve => setTimeout(resolve, 250));
            }
          } finally {
            chrome.tabs.onCreated.removeListener(onCreated);
            for (const id of newTabs) ownedTabs.add(id);
          }
        }
        if (!profile) return null;
        shop.factory_url = profile;
        if (!target) {
          const tab = await chrome.tabs.create({ url: profile, active: false });
          target = tab.id; if (target) ownedTabs.add(target);
        }
        factoryTabId = target;
        return target ? waitSelection<FactorySelection>(target, "FACTORY", profile, deadline) : null;
      },
      cleanup: async () => { for (const id of ownedTabs) { try { await chrome.tabs.remove(id); } catch { /* user closed it */ } } },
    });
  } finally {
    running = false;
    if (!responded) respond({ error: "Could not start collection. Check sign-in and product evidence." });
  }
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || !sender.url?.endsWith("/popup.html") || message?.type !== "START_COLLECTION") return;
  if (!Number.isInteger(message.tabId) || typeof message.ownerId !== "string" ||
      !message.ownerId.startsWith("user_") || !/^https:\/\/detail\.1688\.com\/offer\/[0-9]{6,20}\.html$/.test(message.sourceUrl || "")) {
    respond({ error: "Invalid collection request" }); return;
  }
  void start(message.tabId, message.ownerId, message.sourceUrl, respond).catch(() => respond({ error: "Collection failed" }));
  return true;
});
