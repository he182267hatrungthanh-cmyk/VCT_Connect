import { proxyBackend } from "../../../../../_backend";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderCode: string }> },
): Promise<Response> {
  const { orderCode } = await context.params;
  const upstream = await proxyBackend(request, `/api/v1/payments/orders/${encodeURIComponent(orderCode)}/status`);
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(upstream.body, { status: upstream.status, headers });
}
