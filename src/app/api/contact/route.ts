import { enquirySchema } from "@/lib/contact/schema";
import { DuplicateEnquiryError, savePreviewEnquiry } from "@/lib/contact/store";

export const runtime = "nodejs";
const limit = 20_000;
const headers = { "Cache-Control": "no-store" };

function error(message: string, status: number, fields?: Record<string, string>) {
  return Response.json({ data: null, error: { message, fields } }, { status, headers });
}

export async function POST(request: Request) {
  // Explicit opt-in only. A public deployment must not silently use preview storage.
  if (process.env.CONTACT_PREVIEW_ENABLED !== "true") return error("Die Kontaktfunktion ist noch nicht freigeschaltet.", 503);
  // Next can normalize loopback request.url to localhost. Compare against the
  // browser-facing Host (or an explicitly configured public URL), not that alias.
  const host = request.headers.get("host");
  if (!host) return error("Diese Anfrage konnte nicht zugeordnet werden.", 403);
  const expectedOrigin = new URL(process.env.SITE_URL || `${new URL(request.url).protocol}//${host}`).origin;
  if (request.headers.get("origin") !== expectedOrigin) return error("Diese Anfrage konnte nicht zugeordnet werden.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return error("Bitte senden Sie die Anfrage über das Kontaktformular.", 415);
  const reader = request.body?.getReader();
  if (!reader) return error("Die Anfrage ist leer.", 400);
  let content = "";
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > limit) { await reader.cancel(); return error("Die Anfrage ist zu groß.", 413); }
      content += decoder.decode(chunk.value, { stream: true });
    }
    content += decoder.decode();
  } catch { return error("Die Anfrage konnte nicht gelesen werden.", 400); }
  let body: unknown;
  try { body = JSON.parse(content); } catch { return error("Die Anfrage konnte nicht gelesen werden.", 400); }
  const result = enquirySchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) fields[String(issue.path[0])] ??= issue.message;
    return error("Bitte überprüfen Sie Ihre Angaben.", 400, fields);
  }
  try {
    const receipt = await savePreviewEnquiry({
      ...result.data,
      organisation: result.data.kind === "privat" ? "" : result.data.organisation,
      role: result.data.kind === "privat" ? "" : result.data.role,
      date: result.data.timing === "flexibel" ? "" : result.data.date,
      timeWindow: result.data.timing === "flexibel" ? undefined : result.data.timeWindow,
    });
    return Response.json({ data: receipt, error: null }, { status: 201, headers });
  } catch (cause) {
    if (cause instanceof DuplicateEnquiryError) return error("Diese Anfrage wurde bereits mit anderen Angaben gespeichert. Bitte öffnen Sie das Formular neu.", 409);
    return error("Die Anfrage konnte gerade nicht gespeichert werden. Ihre Angaben bleiben im Formular erhalten. Bitte versuchen Sie es erneut.", 503);
  }
}
