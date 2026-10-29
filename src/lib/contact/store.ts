import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile, link, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { Enquiry } from "./schema";

export class DuplicateEnquiryError extends Error {}

export async function savePreviewEnquiry(enquiry: Enquiry) {
  // These are private runtime records, never application assets to trace/bundle.
  const directory = path.resolve(/* turbopackIgnore: true */ process.env.CONTACT_PREVIEW_DIR || path.join(process.cwd(), ".local/enquiries"));
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const { website: _honeypot, ...details } = enquiry;
  void _honeypot;
  const fingerprint = createHash("sha256").update(JSON.stringify(details)).digest("hex");
  const record = {
    reference: `CFV-${enquiry.requestId.slice(0, 8).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
    preview: true,
    fingerprint,
    details,
  };
  const target = path.join(directory, `${enquiry.requestId}.json`);
  const temporary = path.join(directory, `${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(record, null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" });
  try {
    // Linking a complete file is atomic and cannot overwrite a concurrent request.
    await link(temporary, target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    const existing = JSON.parse(await readFile(target, "utf8")) as typeof record;
    if (existing.fingerprint !== fingerprint) throw new DuplicateEnquiryError();
    return { reference: existing.reference, receivedAt: existing.receivedAt, preview: true };
  } finally {
    await unlink(temporary);
  }
  return { reference: record.reference, receivedAt: record.receivedAt, preview: true };
}
