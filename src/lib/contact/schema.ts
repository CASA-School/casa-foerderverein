import { z } from "zod";

export const contactTopics = [
  { value: "sprachbildung", title: "Sprachbildung ermöglichen", detail: "Lernwege und künftige Stipendien unterstützen." },
  { value: "zeit", title: "Zeit & Wissen einbringen", detail: "Mit Erfahrung, Austausch oder einer gemeinsamen Idee." },
  { value: "ausstattung", title: "Material & Technik weitergeben", detail: "Über Lernmaterialien und digitale Ausstattung sprechen." },
  { value: "idee", title: "Gemeinsam etwas entwickeln", detail: "Eine Kooperation oder eigene Idee kennenlernen." },
] as const;

export type ContactTopic = typeof contactTopics[number]["value"];

export const formats = { telefon: "Telefonisch", video: "Per Video", vorOrt: "Persönlich in Bremen" } as const;
export const timeWindows = { vormittags: "Vormittags · 9–12 Uhr", mittags: "Mittags · 12–15 Uhr", nachmittags: "Nachmittags · 15–18 Uhr" } as const;

export function berlinToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export const enquirySchema = z.object({
  requestId: z.uuid(),
  kind: z.enum(["unternehmen", "organisation", "privat"]),
  topics: z.array(z.enum(["sprachbildung", "zeit", "ausstattung", "idee"])).min(1, "Bitte wählen Sie mindestens ein Thema.").max(4),
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(100),
  organisation: z.string().trim().max(160).default(""),
  role: z.string().trim().max(100).default(""),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(254),
  phone: z.string().trim().max(40).default(""),
  location: z.enum(["bremen", "umland", "anderswo"]),
  format: z.enum(["telefon", "video", "vorOrt"]),
  timing: z.enum(["flexibel", "wunschtermin"]),
  date: z.string().max(10).default(""),
  timeWindow: z.enum(["vormittags", "mittags", "nachmittags"]).optional(),
  message: z.string().trim().max(2000, "Bitte beschränken Sie Ihre Nachricht auf 2.000 Zeichen.").default(""),
  privacyAcknowledged: z.boolean(),
  website: z.string().max(0),
}).superRefine((data, context) => {
  if (data.kind !== "privat" && data.organisation.length < 2) context.addIssue({ code: "custom", path: ["organisation"], message: "Bitte nennen Sie Ihr Unternehmen oder Ihre Organisation." });
  if (data.format === "telefon" && (!/^[+\d() /.-]{6,40}$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 6)) context.addIssue({ code: "custom", path: ["phone"], message: "Für einen Rückruf benötigen wir eine Telefonnummer." });
  if (data.timing === "wunschtermin") {
    if (!data.timeWindow) context.addIssue({ code: "custom", path: ["timeWindow"], message: "Bitte wählen Sie einen Zeitraum." });
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(data.date) && !Number.isNaN(Date.parse(`${data.date}T12:00:00Z`)) && new Date(`${data.date}T12:00:00Z`).toISOString().slice(0, 10) === data.date;
    if (!valid || data.date < berlinToday()) context.addIssue({ code: "custom", path: ["date"], message: "Bitte wählen Sie ein Datum ab heute." });
    else if (Date.parse(`${data.date}T12:00:00Z`) - Date.parse(`${berlinToday()}T12:00:00Z`) > 90 * 86400000) context.addIssue({ code: "custom", path: ["date"], message: "Bitte wählen Sie einen Termin innerhalb der nächsten 90 Tage." });
  }
  if (!data.privacyAcknowledged) context.addIssue({ code: "custom", path: ["privacyAcknowledged"], message: "Bitte bestätigen Sie den Hinweis zur lokalen Vorschau." });
});

export type Enquiry = z.infer<typeof enquirySchema>;
