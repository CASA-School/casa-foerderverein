// A public Vercel deployment must never write enquiries to preview filesystem storage.
export function localContactPreviewEnabled() {
  return process.env.VERCEL !== "1" && process.env.CONTACT_PREVIEW_ENABLED === "true";
}
