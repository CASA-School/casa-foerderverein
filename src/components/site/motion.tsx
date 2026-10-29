"use client";

import { useEffect } from "react";

export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousBehavior = "";
    let active = false;
    function stop() {
      if (!active) return;
      window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
      active = false;
    }
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      stop();
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const start = window.scrollY;
      const end = Math.max(0, target.getBoundingClientRect().top + start - header - 24);
      const distance = end - start;
      previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      active = true;
      if (window.location.hash !== href) window.history.pushState(null, "", href);
      const finish = () => {
        window.scrollTo(0, end);
        stop();
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
        target.focus({ preventScroll: true });
      };
      if (reduced.matches || Math.abs(distance) < 80) { finish(); return; }
      const began = performance.now();
      const duration = Math.min(1050, Math.max(500, 430 + Math.abs(distance) / 9));
      const animate = (time: number) => {
        if (document.querySelector("dialog[open]")) { stop(); return; }
        const progress = Math.min(1, (time - began) / duration);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) frame = window.requestAnimationFrame(animate);
        else finish();
      };
      frame = window.requestAnimationFrame(animate);
    }
    function key(event: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stop();
    }
    document.addEventListener("click", navigate);
    document.addEventListener("keydown", key);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("resize", stop);
    reduced.addEventListener("change", stop);
    return () => {
      stop();
      document.removeEventListener("click", navigate);
      document.removeEventListener("keydown", key);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("resize", stop);
      reduced.removeEventListener("change", stop);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add("will-reveal");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
