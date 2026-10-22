import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { proxyBackend } from "../../_backend";

const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
async function readDefaultArchive(): Promise<Uint8Array> {
  const candidates = [
    resolve(process.cwd(), "private/vct-connect-extension.zip"),
    resolve(process.cwd(), "apps/web/private/vct-connect-extension.zip"),
  ];
  for (const candidate of candidates) {
    try {
      return await readFile(candidate);
    } catch {
      // try next candidate
    }
  }
  throw new Error("Extension archive not found");
}

export function extensionDownload(readArchive: () => Promise<Uint8Array> = readDefaultArchive) {
  return async (request: Request): Promise<Response> => {
    if (!/^Bearer\s+\S+$/i.test(request.headers.get("authorization") ?? "")) {
      return Response.json({ detail: "Sign in to download the extension." }, { status: 401, headers });
    }
    const verification = await proxyBackend(request, "/api/v1/me", undefined, 15_000);
    if (!verification.ok) {
      const status = [401, 403].includes(verification.status) ? verification.status : 503;
      return Response.json({ detail: status === 503 ? "Download temporarily unavailable." : "Sign in to download the extension." }, { status, headers });
    }
    try {
      const archive = await readArchive();
      return new Response(new Uint8Array(archive), { headers: {
        ...headers, "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="vct-connect-extension.zip"',
        "Content-Length": String(archive.byteLength),
      } });
    } catch {
      return Response.json({ detail: "Download temporarily unavailable." }, { status: 503, headers });
    }
  };
}
