import assert from "node:assert/strict";
import test from "node:test";

import { POST as createOrderPost } from "./create-order/route";
import { GET as orderStatusGet } from "./orders/[orderCode]/status/route";
import { POST as simulateSuccessPost } from "./simulate-success/route";
import { POST as webhookPost } from "./webhook/route";

test("payments create-order route proxies to backend", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  let sentMethod = "";
  let sentHeaders: Headers | undefined;
  globalThis.fetch = async (input, init) => {
    sentUrl = String(input);
    sentMethod = init?.method ?? "";
    sentHeaders = new Headers(init?.headers);
    return Response.json({ order_code: "VCT123456" }, { status: 201 });
  };
  try {
    const res = await createOrderPost(
      new Request("https://example.org/api/v1/payments/create-order", {
        method: "POST",
        headers: {
          Authorization: "Bearer token123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_code: "PRO_MONTHLY" }),
      }),
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/create-order");
    assert.equal(sentMethod, "POST");
    assert.equal(sentHeaders?.get("authorization"), "Bearer token123");
    assert.equal(res.status, 201);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("payments orders status route proxies to backend and sets private cache", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  globalThis.fetch = async (input) => {
    sentUrl = String(input);
    return Response.json({ order_code: "VCT999999", status: "PENDING" }, { status: 200 });
  };
  try {
    const res = await orderStatusGet(
      new Request("https://example.org/api/v1/payments/orders/VCT999999/status"),
      { params: Promise.resolve({ orderCode: "VCT999999" }) },
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/orders/VCT999999/status");
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), "private, no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("payments simulate-success route proxies to backend", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  globalThis.fetch = async (input) => {
    sentUrl = String(input);
    return Response.json({ success: true }, { status: 200 });
  };
  try {
    const res = await simulateSuccessPost(
      new Request("https://example.org/api/v1/payments/simulate-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_code: "VCT123456" }),
      }),
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/simulate-success");
    assert.equal(res.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("payments webhook route proxies to backend", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  let sentHeaders: Headers | undefined;
  globalThis.fetch = async (input, init) => {
    sentUrl = String(input);
    sentHeaders = new Headers(init?.headers);
    return Response.json({ success: true }, { status: 200 });
  };
  try {
    const res = await webhookPost(
      new Request("https://example.org/api/v1/payments/webhook", {
        method: "POST",
        headers: {
          Authorization: "Apikey my-sepay-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transferAmount: 49000, content: "VCT123456" }),
      }),
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/webhook");
    assert.equal(sentHeaders?.get("authorization"), "Apikey my-sepay-token");
    assert.equal(res.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
