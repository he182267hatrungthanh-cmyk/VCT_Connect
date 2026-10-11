import assert from 'node:assert/strict';
import test from 'node:test';
import { transformSync } from 'esbuild';
import { readFileSync } from 'node:fs';
import Module from 'node:module';
import { resolve } from 'node:path';

const source = 'https://detail.1688.com/offer/1027322610455.html';
const shop = 'https://shopabcdef123.1688.com/';
const factory = 'https://www.1688.com/factory/b2b-abcdef123.html';

function setup({ permission = true, navigation = false } = {}) {
  const stored = {}, tabs = new Map([[1, { id: 1, url: source, status: 'complete' }]]);
  const created = [], removed = [], requests = [], downloads = [], listeners = new Set();
  let message, nextId = 10;
  globalThis.chrome = {
    runtime: { id: 'test-extension', onMessage: { addListener: fn => { message = fn; } } },
    storage: { local: { get: async () => stored, set: async values => Object.assign(stored, values) } },
    permissions: { contains: async () => permission },
    downloads: { download: async options => { downloads.push(options); return downloads.length; } },
    tabs: {
      get: async id => tabs.get(id),
      create: async options => { const tab = { id: nextId++, ...options, status: 'complete' }; tabs.set(tab.id, tab); created.push(tab); return tab; },
      remove: async id => { removed.push(id); tabs.delete(id); },
      onCreated: { addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn) },
    },
    scripting: { executeScript: async ({ target, func, args }) => {
      assert.ok(tabs.has(target.tabId));
      const mode = args?.[0];
      if (func.name === 'capturePublicHtml') return [{ result: { page: args[0], source_url: args[1], html: '<div>public fixture</div>' } }];
      if (func.name === 'captureSelectedDom') return [{ result: { source_url: source, offer_id: '1027322610455', fields: { product_title: 'Shirt' } } }];
      if (mode === 'PRODUCT_LINK') { assert.equal(args[1], source); return [{ result: shop }]; }
      if (mode === 'SHOP') return [{ result: { source_url: shop, credit_url: shop + 'page/creditdetail.html', ...(!navigation ? { factory_url: factory } : {}) } }];
      if (mode === 'OPEN_FACTORY') {
        const tab = { id: nextId++, openerTabId: target.tabId, url: factory, status: 'complete' };
        tabs.set(tab.id, tab); created.push(tab); for (const fn of listeners) fn(tab);
        return [{ result: 'CLICKED' }];
      }
      if (mode === 'FACTORY') return [{ result: { source_url: factory, canonical_url: factory, shop_url: shop, claims: [{ name: '成立时间', value: '2025.07.14' }] } }];
      throw new Error('Unexpected injection');
    } },
  };
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer short-lived-test-token');
    requests.push({ url, bundle: JSON.parse(options.body) }); return Response.json({});
  };
  const file = resolve('apps/extension/src/background.ts');
  const loaded = new Module(file); loaded.filename = file; loaded.paths = Module._nodeModulePaths(resolve('.'));
  const original = loaded.require.bind(loaded);
  loaded.require = name => name === '@clerk/chrome-extension/background' ? {
    createClerkClient: async () => ({ user: { id: 'user_one' }, session: { getToken: async () => 'short-lived-test-token' } }),
  } : original(name);
  loaded._compile(transformSync(readFileSync(file, 'utf8'), { loader: 'ts', format: 'cjs', define: {
    VCT_WEB_ORIGIN: JSON.stringify('https://vct.example'), VCT_CLERK_PUBLISHABLE_KEY: JSON.stringify('test'), VCT_CLERK_SYNC_HOST: JSON.stringify('vct.example'),
  } }).code, file);
  return { stored, requests, created, removed, downloads, listeners, tabs,
    send: (sender = { id: 'test-extension', url: 'chrome-extension://test-extension/popup.html' }) => new Promise(resolve => {
      const pending = message({ type: 'START_COLLECTION', tabId: 1, ownerId: 'user_one', sourceUrl: source }, sender, resolve);
      if (!pending) resolve(null);
    }) };
}

for (const navigation of [false, true]) {
  test(`background collects linked pages with ${navigation ? 'rendered navigation' : 'direct link'}, independently of popup`, async () => {
    const original = globalThis.fetch;
    try {
      const h = setup({ navigation });
      const response = await h.send(); assert.ok(response.id);
      for (let i = 0; i < 100 && h.stored.collectionJob?.stage !== 'ASSESSING'; i++) await new Promise(resolve => setTimeout(resolve, 5));
      assert.equal(h.stored.collectionJob.stage, 'ASSESSING');
      assert.equal(h.requests.length, 2); assert.ok(h.requests[0].url.endsWith('/begin')); assert.ok(h.requests[1].url.endsWith('/finish'));
      assert.equal(h.requests[0].bundle.job_id, h.requests[1].bundle.job_id);
      assert.equal(h.requests[1].bundle.factory.shop_url, shop);
      assert.deepEqual(h.requests[1].bundle.html_sources.map(x => x.page), ['PRODUCT', 'SHOP', 'FACTORY']);
      assert.equal(h.downloads.length, 3);
      assert.ok(h.downloads.every(x => x.filename.startsWith(`VCT Connect/${response.id}/`) && x.url.startsWith('data:text/html;')));
      assert.equal(h.removed.length, 2); assert.ok(h.tabs.has(1));
      assert.equal(h.listeners.size, 0);
      assert.ok(!JSON.stringify(h.stored).includes('short-lived-test-token'));
    } finally { globalThis.fetch = original; }
  });
}

test('background honors denied linked permission and rejects foreign message senders', async () => {
  const original = globalThis.fetch;
  try {
    const h = setup({ permission: false });
    assert.equal(await h.send({ id: 'foreign', url: 'https://evil.example/popup.html' }), null);
    assert.equal(h.requests.length, 0);
    await h.send();
    for (let i = 0; i < 100 && h.stored.collectionJob?.stage !== 'ASSESSING'; i++) await new Promise(resolve => setTimeout(resolve, 5));
    assert.equal(h.stored.collectionJob.stage, 'ASSESSING');
    assert.equal(h.created.length, 1); // Only the result tab.
    assert.equal(h.downloads.length, 1); // The accessible product HTML still downloads.
    assert.equal(h.requests[1].bundle.outcomes[0].status, 'NO_PERMISSION');
  } finally { globalThis.fetch = original; }
});

test('lost committed begin responses retain the same reservation and reconcile without another begin', async () => {
  const original = globalThis.fetch;
  try {
    const h = setup();
    const ids = [];
    globalThis.fetch = async (url, options) => {
      if (String(url).endsWith('/begin')) { ids.push(JSON.parse(options.body).job_id); throw new TypeError('response lost'); }
      return Response.json({ id: ids[0], status: 'PROCESSING' });
    };
    const failed = await h.send(); assert.ok(failed.error);
    assert.equal(ids.length, 2); assert.equal(ids[0], ids[1]);
    assert.equal(h.stored.collectionJob.reservationUncertain, true);
    const recovered = await h.send(); assert.equal(recovered.id, ids[0]);
    assert.equal(ids.length, 2);
    assert.equal(h.stored.collectionJob.stage, 'ASSESSING');
  } finally { globalThis.fetch = original; }
});

test('navigation between product and supplier-link capture cannot reserve mismatched evidence', async () => {
  const original = globalThis.fetch;
  try {
    const h = setup();
    const execute = globalThis.chrome.scripting.executeScript;
    globalThis.chrome.scripting.executeScript = async options => {
      if (options.args?.[0] === 'PRODUCT_LINK') h.tabs.get(1).url = 'https://detail.1688.com/offer/999999999.html';
      return execute(options);
    };
    assert.ok((await h.send()).error);
    assert.equal(h.requests.length, 0);
  } finally { globalThis.fetch = original; }
});
