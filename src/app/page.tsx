import { Header } from "@/components/site/header";
import { Motion } from "@/components/site/motion";
import { OpenSpace } from "@/components/brand/open-space";

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true" className="arrow">{down ? "↓" : "↗"}</span>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>
    <Header />
    <main id="inhalt">
      <section className="hero" id="start" aria-labelledby="hero-title">
        <div className="hero-inner container">
          <p className="eyebrow hero-enter">Sprache. Teilhabe. Begegnung.</p>
          <h1 id="hero-title" className="hero-enter hero-enter-two">Raum für<br />Miteinander<span className="yellow-stop">.</span></h1>
          <div className="hero-art" aria-hidden="true"><OpenSpace className="hero-space" /></div>
          <div className="hero-bottom hero-enter hero-enter-three">
            <p>Wir unterstützen Menschen auf ihrem Lernweg.<br className="desktop-break" /> Für eine Sprache, die Türen öffnet.</p>
            <a className="text-link" href="#verein">Den Verein kennenlernen <Arrow down /></a>
          </div>
          <div className="hero-caption"><span>CASA Förderverein e.V.</span><span>Offen für ein gemeinsames Morgen.</span></div>
        </div>
      </section>

      <section id="verein" className="section container" aria-labelledby="verein-title">
        <div className="section-index" data-reveal><span className="square" />01 / Der Verein</div>
        <div className="intro-grid" data-reveal>
          <h2 id="verein-title">Sprache ist<br />ein Anfang.<br /><span className="muted-heading">Teilhabe das Ziel.</span></h2>
          <div className="intro-copy">
            <p className="lead">Einander verstehen verändert, was möglich ist.</p>
            <p>Der CASA-Förderverein e.V. unterstützt die Sprachschule CASA gGmbH bei Projekten, die Menschen auf ihrem Lernweg begleiten und gesellschaftliche Teilhabe ermöglichen.</p>
            <p>Unser Anliegen: Chancen auf Sprachbildung eröffnen – besonders dort, wo Unterstützung gebraucht wird.</p>
          </div>
        </div>
        <div className="purpose-line" data-reveal><span>Was uns verbindet</span><p>Respekt. Toleranz. Wertschätzung.</p></div>
      </section>

      <section className="support-section" aria-labelledby="unterstuetzung-title">
        <div className="section container support-grid">
          <div data-reveal><p className="section-index">02 / Unterstützung</p><h2 id="unterstuetzung-title">Ein Lernweg<br />sollte nicht<br />am Geld enden.</h2><p className="support-note">Bildung kann Wege in die Gesellschaft und ins Berufsleben eröffnen.</p></div>
          <ol className="support-list">
            <li data-reveal><span className="list-number">01</span><div><h3>Sprache lernen.</h3><p>Die CASA-Sprachschule hat in den vergangenen Jahren Menschen in besonders schwierigen Lebenslagen die kostenlose Teilnahme an Sprachkursen ermöglicht.</p></div></li>
            <li data-reveal><span className="list-number">02</span><div><h3>Teilhabe ermöglichen.</h3><p>Sprachbildung schafft eine Grundlage, um im Alltag anzukommen, neue Perspektiven zu entwickeln und berufliche Wege zu gehen.</p></div></li>
            <li data-reveal><span className="list-number">03</span><div><h3>Menschen verbinden.</h3><p>Begegnungen über kulturelle, religiöse und soziale Grenzen hinweg machen gegenseitiges Verständnis lebendig.</p></div></li>
          </ol>
        </div>
      </section>

      <section id="vorhaben" className="section container" aria-labelledby="vorhaben-title">
        <div className="section-index" data-reveal><span className="square" />03 / Unsere Vorhaben</div>
        <div className="section-heading" data-reveal><h2 id="vorhaben-title">Mehr Wege öffnen.</h2><p>Neue Unterstützung braucht gute Vorbereitung.<br />An diesen Ideen wird gearbeitet.</p></div>
        <div className="programme-list">
          <article data-reveal><div className="programme-label"><span className="square" />In Planung</div><div><h3>Gut vorbereitet<br />zur B1-Prüfung.</h3><p>Ein Vorbereitungskurs auf die telc B1-Prüfung soll Menschen fast kostenfrei offenstehen, die keine weitere Förderung mehr in Anspruch nehmen können.</p></div><span className="programme-number" aria-hidden="true">01</span></article>
          <article data-reveal><div className="programme-label"><span className="square" />In Erarbeitung</div><div><h3>Lernen mit<br />Rückenwind.</h3><p>Ein Stipendienprogramm wird erarbeitet, um weitere Zugänge zum Sprachenlernen zu ermöglichen.</p></div><span className="programme-number" aria-hidden="true">02</span></article>
        </div>
        <p className="planning-note">Beide Vorhaben befinden sich in der Entwicklung. Ein Anmeldestart steht noch nicht fest.</p>
      </section>

      <section id="begegnung" className="meeting-section" aria-labelledby="begegnung-title">
        <div className="section container">
          <p className="section-index" data-reveal>04 / Begegnung</p>
          <div className="meeting-heading" data-reveal><h2 id="begegnung-title">Miteinander reden.<br /><span>Aufeinander zugehen.</span></h2><OpenSpace className="meeting-space" dark /></div>
          <div className="meeting-body" data-reveal><p className="lead">Ein Ort, an dem aus Unbekannten<br className="desktop-break" /> ein Miteinander wird.</p><div><p>Die CASA-Cafeteria ist ein Ort der Begegnung für die Teilnehmenden der Sprachschule: für gemeinsame Hausaufgaben, die Prüfungsvorbereitung oder einfach zum Kennenlernen.</p><p>Menschen aus bis zu 80 Nationen begegnen sich bei CASA. Seit über 40 Jahren verbindet die Sprachschule Menschen unterschiedlicher Herkunft und fördert den interkulturellen Austausch.</p></div></div>
          <div className="meeting-moments" data-reveal><span>Sprachcafé</span><span>CASA-Stammtisch</span><span>Kulturelle Begegnungen</span></div>
        </div>
      </section>

      <section className="section container learning-section" aria-labelledby="lernen-title">
        <div className="section-index" data-reveal><span className="square" />05 / Auf dem Lernweg</div>
        <div className="intro-grid" data-reveal><h2 id="lernen-title">Selbstständig lernen.<br /><span className="muted-heading">Gemeinsam wachsen.</span></h2><div className="intro-copy"><p className="lead">Begleitung, die über den Unterricht hinausgeht.</p><p>Die CASA-Sprachschule ist Mitglied von Tandem International. Die Tandemmethode stärkt das selbstständige Lernen und den Austausch zwischen Menschen.</p><p>In individuellen Gesprächen reflektieren Teilnehmende ihren Lernfortschritt und entwickeln passende Lernstrategien. Beratung, Ermutigung und Unterstützung begleiten sie auch über die Kurszeit hinaus.</p></div></div>
        <div className="values" data-reveal><p>Offen.<br />Ehrlich.<br />Respektvoll.</p><div><span className="eyebrow">So wird Miteinander gelebt.</span><p>Ob es um Lernfragen, die Wohnungssuche, die Berufs- oder Studienplanung geht: Der Schulalltag bei CASA ist von zugewandter Kommunikation und persönlicher Unterstützung geprägt.</p></div></div>
      </section>

      <section id="mehr-erfahren" className="closing" aria-labelledby="mehr-title">
        <div className="section container closing-inner"><div data-reveal><p className="section-index">Gemeinsam weiterdenken</p><h2 id="mehr-title">Geben wir<br />Miteinander Raum.</h2><p>Entdecken Sie, wofür der CASA-Förderverein steht.</p><a href="/downloads/CASA-Foerderverein-Infokarte.pdf" className="download-link" download>Den Verein im Überblick <span>PDF herunterladen <Arrow /></span></a></div><OpenSpace className="closing-space" /></div>
      </section>
    </main>
    <footer className="site-footer container"><p>CASA Förderverein e.V.</p><a href="https://www.casa-bremen.de" target="_blank" rel="noopener noreferrer">Zur CASA-Sprachschule <Arrow /></a><a href="#start">Zurück nach oben ↑</a></footer>
    <Motion />
  </>;
}
