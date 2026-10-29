import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:3016";
const session = `casa-fv-check-${process.pid}`;
const cliPath = path.resolve("node_modules/.bin/playwright-cli");
const evidence = [];
let ownedServer;

function cli(...args) {
  const result = spawnSync(cliPath, ["--session", session, "--json", ...args], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  const out = result.stdout.trim();
  const data = out ? JSON.parse(out) : {};
  if (data.isError) throw new Error(data.error);
  return data;
}

function check(label, expression) {
  const data = cli("eval", `async () => { const ok = await (${expression}); if (!ok) throw new Error(${JSON.stringify(label)}); return true; }`);
  if (data.result !== "true") throw new Error(`No passing result for ${label}`);
  evidence.push({ check: label, passed: true });
  console.log(`PASS ${label}`);
}

try {
  try { await fetch(base); } catch {
    ownedServer = spawn("npm", ["run", "start"], { stdio: "ignore" });
    let ready = false;
    for (let i = 0; i < 40; i++) {
      await new Promise(resolve => setTimeout(resolve, 250));
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* wait for local server */ }
    }
    if (!ready) throw new Error("Run npm run build before the browser checks.");
  }
  const response = await fetch(base);
  if (!response.ok) throw new Error(`Homepage returned ${response.status}`);
  for (const file of ["CASA-Foerderverein-Infokarte.pdf", "CASA-Foerderverein-Brand-Guide.pdf"]) {
    const response = await fetch(`${base}/downloads/${file}`);
    const data = new Uint8Array(await response.arrayBuffer());
    if (!response.ok || new TextDecoder().decode(data.slice(0, 5)) !== "%PDF-") throw new Error(`Invalid PDF: ${file}`);
    evidence.push({ check: `PDF download: ${file}`, passed: true });
  }
  mkdirSync("output/playwright", { recursive: true });
  cli("open", base);
  cli("snapshot");
  check("German page and one main heading", 'document.documentElement.lang === "de" && document.querySelectorAll("h1").length === 1');
  check("Preview indexing disabled", 'document.querySelector(\'meta[name="robots"]\')?.content.includes("noindex")');
  check("Approved logo loads", 'document.querySelector(\'img[alt="CASA Förderverein e.V."]\')?.naturalWidth > 0');
  for (const [width, height] of [[320,568],[390,844],[768,1024],[1024,768],[1440,1000],[1920,1080]]) {
    cli("resize", String(width), String(height));
    check(`No horizontal overflow at ${width}px`, 'document.documentElement.scrollWidth <= innerWidth');
    if (width >= 768) check(`Hero action stays clear of artwork at ${width}px`, '(() => { const a=document.querySelector(".hero-bottom .text-link").getBoundingClientRect(); const b=document.querySelector(".hero-art").getBoundingClientRect(); return a.right <= b.left || a.bottom <= b.top || a.top >= b.bottom; })()');
  }
  cli("resize", "390", "844");
  cli("snapshot");
  cli("run-code", 'async (page) => { await page.getByRole("button", { name: "Menü", exact: true }).click(); }');
  check("Mobile menu opens", 'document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") === "true"');
  cli("snapshot");
  cli("press", "Escape");
  check("Escape closes menu and returns focus", 'document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") === "false" && document.activeElement === document.querySelector(".menu-toggle")');
  cli("snapshot");
  cli("run-code", 'async (page) => { await page.getByRole("button", { name: "Menü", exact: true }).click(); }');
  cli("snapshot");
  cli("run-code", 'async (page) => { await page.getByRole("navigation", { name: "Mobile Hauptnavigation" }).getByRole("link", { name: "Unsere Vorhaben" }).click(); }');
  check("Navigation closes menu and reaches planned programmes", 'location.hash === "#vorhaben" && document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") === "false"');
  check("Plans are clearly labelled and do not accept applications", 'document.querySelector("#vorhaben").textContent.includes("In Planung") && document.querySelector("#vorhaben").textContent.includes("In Erarbeitung") && document.querySelector("#vorhaben").textContent.includes("Ein Anmeldestart steht noch nicht fest") && !document.querySelector("form")');
  cli("snapshot");
  cli("run-code", 'async (page) => { const download=page.waitForEvent("download"); await page.locator(\'a[download]\').click(); const file=await download; if(!file.suggestedFilename().endsWith(".pdf")) throw new Error("Expected PDF download"); }');
  evidence.push({ check: "Browser information-card download", passed: true });
  cli("set-reduced-motion", "reduce");
  check("Reduced motion disables decorative animation", 'getComputedStyle(document.querySelector(".hero-space .space-arc")).animationName === "none" && getComputedStyle(document.documentElement).scrollBehavior === "auto"');
  cli("goto", base);
  cli("screenshot", "--filename", "output/playwright/mobile-390.png");
  cli("resize", "1440", "1000");
  cli("screenshot", "--filename", "output/playwright/desktop-1440.png");
  cli("snapshot");
  cli("run-code", `async (page) => { const context=await page.context().browser().newContext({ javaScriptEnabled:false }); const noJs=await context.newPage(); await noJs.goto(${JSON.stringify(base)}); if(!await noJs.locator("#verein h2").isVisible() || !await noJs.locator("#vorhaben article").first().isVisible()) throw new Error("Content must remain visible without JavaScript"); await context.close(); }`);
  evidence.push({ check: "Core content without JavaScript", passed: true });
  writeFileSync("output/playwright/verification.json", JSON.stringify({ base, evidence }, null, 2));
  console.log(`${evidence.length} checks passed.`);
} finally {
  cli("close");
  if (ownedServer) ownedServer.kill("SIGTERM");
}
