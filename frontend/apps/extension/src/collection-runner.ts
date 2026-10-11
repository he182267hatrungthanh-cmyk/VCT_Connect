import { assertPermittedEvidence, type LegacyCapture } from "./capture";
import { factoryUrl, shopUrl, type CollectionJob, type FactorySelection, type ShopSelection, type SupplierBundle } from "./linked-capture";

export type RunnerDependencies = {
  now(): number;
  product(): Promise<{ product: LegacyCapture; shopLink?: string }>;
  begin(bundle: SupplierBundle): Promise<void>;
  finish(bundle: SupplierBundle): Promise<void>;
  permitted(): Promise<boolean>;
  shop(url: string, deadline: number): Promise<ShopSelection | null>;
  factory(shop: ShopSelection, deadline: number): Promise<FactorySelection | null>;
  save(job: CollectionJob): Promise<void>;
  accepted(job: CollectionJob): Promise<void>;
  cleanup(): Promise<void>;
};

export async function runCollection(job: CollectionJob, deps: RunnerDependencies): Promise<void> {
  let accepted = false;
  try {
    await deps.save(job);
    const initial = await deps.product();
    if (initial.product.source_url !== job.sourceUrl) throw new Error("The product changed before capture");
    const shopLink = initial.shopLink ? shopUrl(initial.shopLink) : null;
    const bundle: SupplierBundle = { job_id: job.id, product: initial.product,
      ...(shopLink ? { shop_url: shopLink } : {}), outcomes: [] };
    assertPermittedEvidence(bundle);
    await deps.begin(bundle);
    accepted = true;
    await deps.accepted(job);
    // Leave ten seconds for final authenticated submission before backend fallback.
    const deadline = deps.now() + 50_000;
    const permission = await deps.permitted();
    if (permission && shopLink) {
      job = { ...job, stage: "SHOP" }; await deps.save(job);
      try { bundle.shop = await deps.shop(shopLink, deadline) || undefined; } catch { /* partial evidence */ }
      bundle.outcomes.push({ page: "SHOP", status: bundle.shop ? "OK" : deps.now() >= deadline ? "TIMEOUT" : "UNAVAILABLE" });
      if (bundle.shop && deps.now() < deadline) {
        job = { ...job, stage: "FACTORY" }; await deps.save(job);
        try { bundle.factory = await deps.factory(bundle.shop, deadline) || undefined; } catch { /* partial evidence */ }
      }
      if (bundle.factory && (!bundle.shop?.factory_url ||
          factoryUrl(bundle.shop.factory_url) !== factoryUrl(bundle.factory.source_url) ||
          bundle.factory.shop_url !== shopLink)) bundle.factory = undefined;
      bundle.outcomes.push({ page: "FACTORY", status: bundle.factory ? "OK" : deps.now() >= deadline ? "TIMEOUT" :
        bundle.shop?.factory_url ? "UNAVAILABLE" : "LINK_UNAVAILABLE" });
    } else {
      const status = permission ? "LINK_UNAVAILABLE" : "NO_PERMISSION";
      bundle.outcomes = [{ page: "SHOP", status }, { page: "FACTORY", status }];
    }
    assertPermittedEvidence(bundle);
    await deps.finish(bundle);
    await deps.save({ ...job, stage: "ASSESSING" });
  } catch (error) {
    const uncertain = !accepted && Boolean(error && typeof error === "object" && "reservationUncertain" in error);
    await deps.save({ ...job, stage: "ERROR", reservationUncertain: uncertain, error: accepted
      ? "Collection was interrupted. The stored product will continue after the deadline; open the web result."
      : uncertain ? "The reservation response was lost. Reopen the result or retry this same collection; do not create another request."
      : "Could not start collection. Check sign-in and the product page, then try again." });
  } finally { await deps.cleanup(); }
}
