import { proxyBackend } from "../../../_backend";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug?: string[] }> },
): Promise<Response> {
  const { slug = [] } = await context.params;
  const path = `/api/v1/payments/${slug.map(encodeURIComponent).join("/")}`;
  const url = new URL(request.url);
  const upstream = await proxyBackend(request, `${path}${url.search}`);
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(upstream.body, { status: upstream.status, headers });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug?: string[] }> },
): Promise<Response> {
  const { slug = [] } = await context.params;
  const path = `/api/v1/payments/${slug.map(encodeURIComponent).join("/")}`;
  const url = new URL(request.url);
  return proxyBackend(request, `${path}${url.search}`);
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, content-type",
    },
  });
}
