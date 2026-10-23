import assert from "node:assert/strict";
import test from "node:test";

import { GET, POST } from "./route";

test("payment proxy forwards GET order status to backend", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  globalThis.fetch = async (input) => {
    sentUrl = String(input);
    return Response.json({ order_code: "VCT123456", status: "PENDING" }, { status: 200 });
  };
  try {
    const response = await GET(
      new Request("https://example.org/api/v1/payments/orders/VCT123456/status"),
      { params: Promise.resolve({ slug: ["orders", "VCT123456", "status"] }) },
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/orders/VCT123456/status");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("payment proxy forwards POST create-order with body and authorization", async () => {
  const originalFetch = globalThis.fetch;
  let sentUrl = "";
  let sentMethod = "";
  let sentHeaders: Headers | undefined;
  let sentBody = "";
  globalThis.fetch = async (input, init) => {
    sentUrl = String(input);
    sentMethod = init?.method ?? "";
    sentHeaders = new Headers(init?.headers);
    sentBody = String(init?.body);
    return Response.json({ order_code: "VCT999999", status: "PENDING" }, { status: 201 });
  };
  try {
    const response = await POST(
      new Request("https://example.org/api/v1/payments/create-order", {
        method: "POST",
        headers: {
          Authorization: "Bearer user-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_code: "PRO_MONTHLY" }),
      }),
      { params: Promise.resolve({ slug: ["create-order"] }) },
    );
    assert.equal(sentUrl, "http://127.0.0.1:8000/api/v1/payments/create-order");
    assert.equal(sentMethod, "POST");
    assert.equal(sentHeaders?.get("authorization"), "Bearer user-token");
    assert.equal(sentHeaders?.get("content-type"), "application/json");
    assert.equal(JSON.parse(sentBody).plan_code, "PRO_MONTHLY");
    assert.equal(response.status, 201);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
