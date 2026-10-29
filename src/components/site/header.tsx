"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";

const links = [
  ["#verein", "Der Verein"],
  ["#vorhaben", "Unsere Vorhaben"],
  ["#begegnung", "Begegnung"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="home-link" href="#start" aria-label="CASA Förderverein – Startseite" onClick={() => setOpen(false)}>
          <Logo />
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {links.map(([href, title]) => <a key={href} href={href}>{title}</a>)}
          <a className="nav-action" href="#mehr-erfahren">Mehr erfahren <span aria-hidden="true">↗</span></a>
        </nav>
        <button ref={trigger} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          {open ? "Schließen" : "Menü"}<span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </div>
      {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile Hauptnavigation">
        {[...links, ["#mehr-erfahren", "Mehr erfahren"]].map(([href, title]) => <a key={href} href={href} onClick={() => setOpen(false)}>{title}<span aria-hidden="true">↗</span></a>)}
      </nav>}
    </header>
  );
}
