"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ContactSelect } from "@/components/site/contact-select";
import { OpenSpace } from "@/components/brand/open-space";
import { berlinToday, contactTopics, enquirySchema, formats, timeWindows, type ContactTopic, type Enquiry } from "@/lib/contact/schema";

type Opening = { topic?: ContactTopic; kind?: Enquiry["kind"] };
const ContactContext = createContext<((opening?: Opening, trigger?: HTMLElement) => void) | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [opening, setOpening] = useState<Opening | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  return <ContactContext.Provider value={(options = {}, trigger) => { returnFocus.current = trigger ?? null; setOpening(options); }}>
    {children}
    {opening && <ContactDialog opening={opening} onClose={() => {
      setOpening(null);
      const target = returnFocus.current?.isConnected ? returnFocus.current : document.querySelector<HTMLElement>(".menu-toggle");
      requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    }} />}
  </ContactContext.Provider>;
}

export function ContactButton({ children, className = "", topic, kind, onClick }: Opening & { children: ReactNode; className?: string; onClick?: () => void }) {
  const open = useContext(ContactContext);
  return <button type="button" className={className} onClick={event => { const trigger = event.currentTarget; onClick?.(); open?.({ topic, kind }, trigger); }}>{children}</button>;
}

type Draft = Omit<Enquiry, "requestId" | "privacyAcknowledged" | "website"> & { privacyAcknowledged: boolean };
type FieldName = keyof Draft;
const stepNames = ["Ihre Idee", "Kontakt", "Gespräch"];
const locations = [{ value: "bremen", label: "Bremen", detail: "In der Stadt zu Hause" }, { value: "umland", label: "Bremer Umland", detail: "Aus der Region verbunden" }, { value: "anderswo", label: "Ein anderer Ort", detail: "Eine Verbindung kennt keine Stadtgrenze" }] as const;
const meetingWindows = Object.entries(timeWindows).map(([value, label]) => ({ value: value as NonNullable<Enquiry["timeWindow"]>, label: label.split(" · ")[0], detail: label.split(" · ")[1] }));
const titles = ["Wie möchten Sie sich einbringen?", "Lernen wir uns kennen.", "Wie passt es Ihnen?"];

function ContactDialog({ opening, onClose }: { opening: Opening; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const requestId = useRef("");
  const controller = useRef<AbortController | null>(null);
  const id = useId();
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const [receipt, setReceipt] = useState("");
  const [draft, setDraft] = useState<Draft>({
    kind: opening.kind ?? "unternehmen", topics: opening.topic ? [opening.topic] : [],
    name: "", organisation: "", role: "", email: "", phone: "", location: "bremen",
    format: "video", timing: "flexibel", date: "", timeWindow: "vormittags", message: "", privacyAcknowledged: false,
  });

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (element && !element.open) element.showModal();
    heading.current?.focus({ preventScroll: true });
    return () => {
      controller.current?.abort();
      // Native close actions run before unmount. Leaving an already-open dialog
      // alone here also preserves it during React's development effect replay.
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function setField<K extends FieldName>(field: K, value: Draft[K]) {
    requestId.current = "";
    setDraft(previous => ({ ...previous, [field]: value }));
    setErrors(previous => { const next = { ...previous }; delete next[field]; return next; });
    setFailure("");
  }

  function moveTo(next: number) {
    setStep(next);
    setErrors({});
    setFailure("");
    dialog.current?.querySelector(".contact-scroll")?.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }

  function validateStep() {
    const next: Record<string, string> = {};
    if (step === 0 && !draft.topics.length) next.topics = "Wählen Sie mindestens ein Thema, über das wir sprechen können.";
    if (step === 1) {
      if (draft.name.trim().length < 2) next.name = "Wie dürfen wir Sie ansprechen?";
      if (!enquirySchema.shape.email.safeParse(draft.email.trim()).success) next.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
      if (draft.kind !== "privat" && draft.organisation.trim().length < 2) next.organisation = "Bitte nennen Sie Ihr Unternehmen oder Ihre Organisation.";
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) focusField(first);
    return !first;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) { if (validateStep()) moveTo(step + 1); return; }
    if (pending) return;
    requestId.current ||= window.crypto.randomUUID();
    const result = enquirySchema.safeParse({ ...draft, email: draft.email.trim(), requestId: requestId.current, website: "", date: draft.timing === "flexibel" ? "" : draft.date, timeWindow: draft.timing === "flexibel" ? undefined : draft.timeWindow, organisation: draft.kind === "privat" ? "" : draft.organisation, role: draft.kind === "privat" ? "" : draft.role });
    if (!result.success) {
      const fields: Record<string, string> = {};
      result.error.issues.forEach(issue => { fields[String(issue.path[0])] ??= issue.message; });
      setErrors(fields);
      focusField(Object.keys(fields)[0]);
      return;
    }
    setPending(true);
    setFailure("");
    controller.current = new AbortController();
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data), signal: controller.current.signal });
      const body = await response.json();
      if (!response.ok || !body.data?.reference) {
        setFailure(body.error?.message ?? "Die Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.");
        if (body.error?.fields) setErrors(body.error.fields);
        return;
      }
      setReceipt(body.data.reference);
      requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) setFailure("Die Verbindung wurde unterbrochen. Ihre Angaben bleiben erhalten. Bitte versuchen Sie es erneut.");
    } finally { setPending(false); }
  }

  function focusField(field: string) {
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>(`[data-field="${field}"] input, [data-field="${field}"] [role="combobox"], [data-field="${field}"] textarea`)?.focus());
  }

  function validateField(field: "name" | "organisation" | "role" | "email" | "phone") {
    const value = draft[field].trim();
    if (!value) return; // Explain empty required fields when the visitor continues.
    let error = "";
    if (field === "email" && !enquirySchema.shape.email.safeParse(value).success) error = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (field === "name" && value.length < 2) error = "Bitte geben Sie Ihren Namen an.";
    if (field === "organisation" && draft.kind !== "privat" && value.length < 2) error = "Bitte nennen Sie Ihr Unternehmen oder Ihre Organisation.";
    setErrors(previous => { const next = { ...previous }; if (error) next[field] = error; else delete next[field]; return next; });
  }

  function fieldError(field: FieldName) {
    return errors[field] ? <p className="field-error" id={`${id}-${field}-error`} role="alert">{errors[field]}</p> : null;
  }

  function input(field: "name" | "organisation" | "role" | "email" | "phone", label: string, options: { type?: string; optional?: boolean; autoComplete?: string; placeholder?: string; hint?: string } = {}) {
    return <div className="contact-field" data-field={field}>
      <label htmlFor={`${id}-${field}`}>{label}{options.optional && <span> optional</span>}</label>
      <input onBlur={() => validateField(field)} disabled={pending} id={`${id}-${field}`} name={field} type={options.type ?? "text"} value={draft[field]} onChange={event => setField(field, event.target.value)} autoComplete={options.autoComplete} placeholder={options.placeholder} maxLength={field === "email" ? 254 : field === "phone" ? 40 : field === "organisation" ? 160 : 100} aria-invalid={!!errors[field]} aria-describedby={[options.hint && `${id}-${field}-hint`, errors[field] && `${id}-${field}-error`].filter(Boolean).join(" ") || undefined} required={!options.optional} />
      {options.hint && <p className="field-hint" id={`${id}-${field}-hint`}>{options.hint}</p>}
      {fieldError(field)}
    </div>;
  }

  return <dialog ref={dialog} className="contact-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onClose={onClose} onKeyDown={event => {
    if (event.key !== "Tab" || event.ctrlKey || event.altKey || event.metaKey) return;
    const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []).filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onClick={event => {
    if (event.target === dialog.current) {
      const bounds = dialog.current.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close();
    }
  }}>
    <div className="contact-shell">
      <aside className="contact-aside">
        <p className="eyebrow">Ein Gespräch ist ein Anfang.</p>
        <h2>Aus einer Idee<br />wird<br />Miteinander.</h2>
        <OpenSpace className="contact-art" dark />
        <p>Bremen verbindet.<br />Gemeinsam öffnen wir Lernwege.</p>
        <span className="contact-preview-tag"><span className="square" />Lokale Vorschau</span>
      </aside>
      <div className="contact-main">
        <button type="button" className="contact-close" aria-label="Kontaktfenster schließen" onClick={() => dialog.current?.close()}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
        {receipt ? <div className="contact-success">
          <span className="success-symbol" aria-hidden="true">↗</span>
          <p className="eyebrow">Der erste Schritt ist gemacht.</p>
          <h2 ref={heading} tabIndex={-1} id={`${id}-title`}>Danke, {draft.name.trim().split(/\s+/)[0]}.</h2>
          <p id={`${id}-description`}>Ihre Anfrage wurde lokal gespeichert.</p>
          <div className="contact-receipt"><span>Ihre Referenz</span><strong>{receipt}</strong></div>
          <p className="contact-success-note">In dieser Vorschau wird keine E-Mail verschickt. Ein Termin ist noch nicht vereinbart.</p>
          <button className="primary-action" onClick={() => dialog.current?.close()}>Zurück zur Website <span aria-hidden="true">↗</span></button>
        </div> : <form noValidate onSubmit={submit} className="contact-form" aria-busy={pending}>
          <div className="contact-scroll">
            <nav aria-label="Schritte der Kontaktanfrage" className="contact-steps">
              {stepNames.map((name, index) => <button key={name} type="button" disabled={index >= step || pending} onClick={() => moveTo(index)} data-complete={index < step || undefined} aria-current={index === step ? "step" : undefined}><span>{index < step ? <><span aria-hidden="true">✓</span><span className="sr-only">Abgeschlossen, Schritt {index + 1}</span></> : `0${index + 1}`}</span>{name}</button>)}
            </nav>
            <h2 ref={heading} tabIndex={-1} id={`${id}-title`}>{titles[step]}</h2>
            <p id={`${id}-description`} className="contact-description">{step === 0 ? "Ob Unternehmen, Initiative oder Privatperson: Jede gute Verbindung beginnt mit Ihrer Idee." : step === 1 ? "Ein paar Angaben helfen uns, die passende Verbindung herzustellen." : "Wählen Sie, wie wir ins Gespräch kommen könnten. Wünsche sind noch keine Terminbuchung."}</p>

            <fieldset className="contact-current-step" aria-label={stepNames[step]} disabled={pending}>
            {step === 0 && <div className="contact-step-content">
              <fieldset className="contact-kind"><legend>Ich melde mich als</legend><div className="choice-group">
                {([['unternehmen', 'Unternehmen'], ['organisation', 'Organisation'], ['privat', 'Privatperson']] as const).map(([value, label]) => <label key={value} className={draft.kind === value ? "selected" : ""}><input type="radio" name="kind" value={value} checked={draft.kind === value} onChange={() => setField("kind", value)} />{label}</label>)}
              </div></fieldset>
              <fieldset className="contact-topics" data-field="topics"><legend>Darüber möchte ich sprechen <span>Mehrfachauswahl möglich</span></legend>
                {contactTopics.map(topic => <label key={topic.value} className={`topic-choice ${draft.topics.includes(topic.value) ? "selected" : ""}`}><input type="checkbox" name="topics" value={topic.value} aria-invalid={!!errors.topics} aria-describedby={errors.topics ? `${id}-topics-error` : undefined} checked={draft.topics.includes(topic.value)} onChange={() => setField("topics", draft.topics.includes(topic.value) ? draft.topics.filter(value => value !== topic.value) : [...draft.topics, topic.value])} /><span><strong>{topic.title}</strong><span>{topic.detail}</span></span></label>)}
                {fieldError("topics")}
              </fieldset>
            </div>}

            {step === 1 && <div className="contact-step-content contact-fields">
              <p className="contact-fields-note">Nur die als optional markierten Angaben können Sie freilassen.</p>
              {input("name", "Ihr Name", { autoComplete: "name", placeholder: "Vor- und Nachname" })}
              {draft.kind !== "privat" && <>{input("organisation", draft.kind === "unternehmen" ? "Unternehmen" : "Organisation", { autoComplete: "organization" })}{input("role", "Ihre Funktion", { autoComplete: "organization-title", optional: true, placeholder: "z. B. Geschäftsführung" })}</>}
              {input("email", draft.kind === "unternehmen" ? "Geschäftliche E-Mail" : "E-Mail", { type: "email", autoComplete: "email", placeholder: draft.kind === "unternehmen" ? "name@unternehmen.de" : "name@beispiel.de", hint: "Bitte eine Adresse angeben, unter der Sie erreichbar sind." })}
              <ContactSelect id={`${id}-location`} name="location" label="Wo sind Sie zu Hause?" value={draft.location} options={locations} onChange={value => setField("location", value)} disabled={pending} hint="Wir freuen uns über Verbindungen aus Bremen und darüber hinaus." />
            </div>}

            {step === 2 && <div className="contact-step-content">
              <fieldset><legend>Wie möchten Sie sprechen?</legend><div className="choice-group format-choices">{Object.entries(formats).map(([value, label]) => <label key={value} className={draft.format === value ? "selected" : ""}><input type="radio" name="format" value={value} checked={draft.format === value} onChange={() => setField("format", value as Draft["format"])} />{label}</label>)}</div></fieldset>
              {draft.format === "telefon" && input("phone", "Telefon für den Rückruf", { type: "tel", autoComplete: "tel", placeholder: "+49 …", hint: "Nur für den gewünschten Rückruf erforderlich." })}
              <fieldset className="timing-choices"><legend>Wann passt es Ihnen?</legend>{([['flexibel','Flexibel abstimmen'],['wunschtermin','Einen Termin vorschlagen']] as const).map(([value,label]) => <label key={value}><input type="radio" name="timing" value={value} checked={draft.timing === value} onChange={() => setField("timing", value)} />{label}</label>)}</fieldset>
              {draft.timing === "wunschtermin" && <div className="contact-date-grid">
                <div className="contact-field" data-field="date"><label htmlFor={`${id}-date`}>Ihr Wunschdatum</label><input type="date" id={`${id}-date`} min={berlinToday()} max={new Date(Date.parse(`${berlinToday()}T12:00:00Z`) + 90 * 86400000).toISOString().slice(0, 10)} required value={draft.date} onChange={event => setField("date",event.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? `${id}-date-error` : undefined} />{fieldError("date")}</div>
                <ContactSelect id={`${id}-window`} name="timeWindow" label="Zeitraum · Bremer Zeit" value={draft.timeWindow ?? "vormittags"} options={meetingWindows} onChange={value => setField("timeWindow", value)} error={errors.timeWindow} disabled={pending} />
              </div>}
              <div className="contact-field"><label htmlFor={`${id}-message`}>Was möchten Sie gemeinsam bewegen? <span>optional</span></label><textarea id={`${id}-message`} rows={3} maxLength={2000} value={draft.message} onChange={event => setField("message",event.target.value)} aria-describedby={`${id}-message-count`} placeholder="Ihre Idee, eine mögliche Kooperation oder eine Frage an uns …" /><span className="character-count" id={`${id}-message-count`}>{draft.message.length} / 2.000 Zeichen</span></div>
              <section className="contact-summary" aria-label="Ihre Anfrage im Überblick">
                <div className="contact-summary-heading"><h3>Ihre Verbindung zu CASA</h3><button type="button" disabled={pending} onClick={() => moveTo(1)}>Bearbeiten</button></div>
                <div className="contact-summary-person"><strong>{draft.name}{draft.kind !== "privat" && ` · ${draft.organisation}`}</strong><span>{draft.email}</span></div>
                <dl><div><dt>Ihr Beitrag</dt><dd>{contactTopics.filter(topic => draft.topics.includes(topic.value)).map(topic => topic.title).join(" · ")}</dd></div><div><dt>Gesprächswunsch</dt><dd>{formats[draft.format]}{draft.timing === "flexibel" ? " · flexibel abstimmen" : draft.date && !Number.isNaN(Date.parse(`${draft.date}T12:00:00Z`)) ? ` · ${new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone: "Europe/Berlin" }).format(new Date(`${draft.date}T12:00:00Z`))}, ${timeWindows[draft.timeWindow ?? "vormittags"]}` : " · Datum noch offen"}</dd></div></dl>
              </section>
              <div className="preview-disclosure"><span className="square" /><p><strong>Nur eine lokale Vorschau.</strong> Ihre Angaben werden auf dem Rechner dieser Vorschau gespeichert. Es wird keine E-Mail verschickt und kein Termin gebucht.</p></div>
              <div className="consent-field" data-field="privacyAcknowledged"><label><input type="checkbox" aria-invalid={!!errors.privacyAcknowledged} aria-describedby={errors.privacyAcknowledged ? `${id}-privacyAcknowledged-error` : undefined} checked={draft.privacyAcknowledged} onChange={event => setField("privacyAcknowledged",event.target.checked)} />Ich habe den Hinweis zur lokalen Vorschau gelesen.</label><a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzhinweise öffnen ↗</a>{fieldError("privacyAcknowledged")}</div>
            </div>}
            </fieldset>
            {failure && <div className="contact-failure" role="alert">{failure}</div>}
          </div>
          <div className="contact-actions"><span className="sr-only" role="status">{pending ? "Ihre Anfrage wird lokal gespeichert." : ""}</span><span className="contact-step-counter">Schritt {step + 1} von 3</span>{step > 0 && <button type="button" className="back-action" disabled={pending} onClick={() => moveTo(step - 1)}>Zurück</button>}<button type="submit" className="primary-action" disabled={pending}>{pending ? "Wird gespeichert …" : step === 2 ? "Anfrage lokal speichern" : "Weiter"}<span aria-hidden="true" className={pending ? "contact-spinner" : undefined}>{pending ? "" : "↗"}</span></button></div>
        </form>}
      </div>
    </div>
  </dialog>;
}
