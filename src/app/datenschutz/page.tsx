import Link from "next/link";
import { localContactPreviewEnabled } from "@/lib/contact/preview";
import { Logo } from "@/components/brand/logo";

export default function Privacy() {
  if (!localContactPreviewEnabled()) return <main className="privacy-page container">
    <Link href="/" aria-label="Zur Startseite"><Logo /></Link>
    <p className="section-index">Hinweise zur Projektvorschau</p>
    <h1>Transparent.<br />Von Anfang an.</h1>
    <p className="lead">Diese Website zeigt den aktuellen Entwurf für den CASA-Förderverein. Die Online-Kontaktanfrage ist noch nicht freigeschaltet.</p>
    <section><h2>Kontaktanfragen</h2><p>In dieser veröffentlichten Vorschau werden keine Kontaktformulareingaben entgegengenommen. Es werden keine E-Mails versandt, Termine gebucht oder Zahlungen abgewickelt.</p></section>
    <section><h2>Bereitstellung der Vorschau</h2><p>Die veröffentlichte Vorschau wird über Vercel bereitgestellt. Beim Aufruf werden technische Verbindungsdaten für die Auslieferung der Website verarbeitet. Schriftdateien werden von dieser Website geladen. Analyse- und Werbedienste, externe Buchungsdienste und Zahlungsdienste sind nicht eingebunden.</p></section>
    <section><h2>Vor dem vollständigen Start</h2><p>Die Angaben zur verantwortlichen Stelle, das Impressum und die vollständigen Datenschutzhinweise werden noch vorbereitet. Suchmaschinen sind angewiesen, die Projektvorschau nicht zu indexieren.</p></section>
    <Link className="text-link" href="/">Zurück zur Website <span aria-hidden="true">↗</span></Link>
  </main>;
  return <main className="privacy-page container">
    <Link href="/" aria-label="Zur Startseite"><Logo /></Link>
    <p className="section-index">Hinweise zur lokalen Vorschau</p>
    <h1>Ihre Angaben.<br />Transparent behandelt.</h1>
    <p className="lead">Diese Website ist eine lokale, nicht öffentliche Vorschau des CASA-Fördervereins.</p>
    <section><h2>Was im Kontaktfenster erfasst wird</h2><p>Wenn Sie eine Anfrage speichern, werden die von Ihnen angegebenen Kontakt- und Organisationsdaten, Ihre ausgewählten Themen, Gesprächs- und Terminwünsche sowie Ihre freiwillige Nachricht gespeichert. Hinzu kommen Zeitpunkt und Referenz der Anfrage.</p></section>
    <section><h2>Wo die Angaben bleiben</h2><p>Die Angaben werden ausschließlich auf dem Rechner gespeichert, auf dem diese Vorschau läuft. Sie werden nicht öffentlich angezeigt und nicht per E-Mail oder an einen Kalenderdienst übermittelt. Das Speichern einer Anfrage vereinbart keinen Termin.</p></section>
    <section><h2>Was freiwillig ist</h2><p>Funktion und Nachricht sind freiwillig. Eine Telefonnummer wird nur für einen gewünschten Rückruf benötigt. Ein konkretes Wunschdatum ist optional; Sie können einen Termin auch flexibel abstimmen lassen.</p></section>
    <section><h2>Technik dieser Vorschau</h2><p>Die Schriftdateien werden lokal geladen. Es werden keine Analyse- oder Werbedienste, externen Buchungsdienste oder Zahlungsdienste eingesetzt. Nicht abgesendete Formulareingaben bleiben nur während des geöffneten Kontaktfensters im Browser erhalten.</p></section>
    <section><h2>Vor dem öffentlichen Start</h2><p>Vor einer Veröffentlichung werden die verantwortliche Stelle, Kontaktmöglichkeiten, der tatsächliche Versand- und Speicherbetrieb sowie die dazugehörigen vollständigen Datenschutzhinweise ergänzt. Dieses Dokument beschreibt den jetzigen lokalen Vorschauzustand.</p></section>
    <Link className="text-link" href="/">Zurück zur Website <span aria-hidden="true">↗</span></Link>
  </main>;
}
