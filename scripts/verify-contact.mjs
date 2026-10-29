import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";

export async function verifyContact({ base, cli, check, evidence }) {
  if (existsSync(".env.local")) process.loadEnvFile?.(".env.local");
  const directory = path.resolve(process.env.CONTACT_PREVIEW_DIR || ".local/enquiries");
  const fixtures = [];
  const pass = (label, condition) => {
    if (!condition) throw new Error(label);
    evidence.push({ check: label, passed: true });
    console.log(`PASS ${label}`);
  };
  // CLI calls block this process between network checks. Fresh connections avoid
  // reusing a fetch-pool socket whose idle-close event was queued during a call.
  const requestLocal = (endpoint, method = "GET", body, extra = {}) => new Promise((resolve, reject) => {
    const url = new URL(endpoint, base);
    const payload = body === undefined ? "" : JSON.stringify(body);
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(url, { method, agent: false, headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload), Origin: new URL(base).origin, ...extra } }, response => {
      const chunks = [];
      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, json: async () => JSON.parse(Buffer.concat(chunks).toString("utf8")) }));
      response.on("error", reject);
    });
    request.on("error", reject);
    request.end(payload);
  });
  const post = (body, extra = {}) => requestLocal("/api/contact", "POST", body, extra);
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const future = new Date(Date.parse(`${today}T12:00:00Z`) + 7 * 86400000).toISOString().slice(0,10);
  const id = randomUUID();
  const sample = { requestId: id, kind: "unternehmen", topics: ["sprachbildung"], name: "CASA QA", organisation: "CASA QA Testunternehmen", role: "Test", email: "casa-qa@example.invalid", phone: "", location: "bremen", format: "video", timing: "flexibel", date: "", message: "Automated local preview fixture.", privacyAcknowledged: true, website: "" };
  fixtures.push(path.join(directory, `${id}.json`));
  try {
    pass("Contact API rejects foreign origins", (await post(sample, { Origin: "https://example.invalid" })).status === 403);
    pass("Contact API validates company details", (await post({ ...sample, organisation: "" })).status === 400);
    pass("Contact API requires preview acknowledgement", (await post({ ...sample, privacyAcknowledged: false })).status === 400);
    pass("Contact API rejects invalid callback numbers", (await post({ ...sample, format: "telefon", phone: "------" })).status === 400);
    pass("Contact API rejects past meeting requests", (await post({ ...sample, timing: "wunschtermin", date: "2020-01-01", timeWindow: "vormittags" })).status === 400);
    pass("Contact API limits request size", (await post({ ...sample, message: "x".repeat(21000) })).status === 413);
    const saved = await post(sample);
    const first = await saved.json();
    pass("Valid local enquiry receives a receipt", saved.status === 201 && first.data.preview === true && !!first.data.reference);
    const repeated = await post(sample);
    const second = await repeated.json();
    pass("Retries return the same saved receipt", repeated.status === 201 && second.data.reference === first.data.reference);
    pass("Changed payload cannot overwrite an enquiry", (await post({ ...sample, message: "Changed details" })).status === 409);
    const record = JSON.parse(readFileSync(fixtures[0], "utf8"));
    pass("Local file is private and has no invented time preference", (statSync(fixtures[0]).mode & 0o777) === 0o600 && record.details.email === sample.email && !record.details.timeWindow && record.details.date === "");
    pass("Enquiries have no public read endpoint", (await requestLocal("/api/contact")).status === 405);

    cli("resize", "1440", "1000");
    cli("goto", base);
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("navigation",{name:"Hauptnavigation",exact:true}).getByRole("button",{name:"Gespräch anfragen"}).click(); await page.getByRole("dialog").waitFor({state:"visible"}); }');
    check("Dialog remains open, focus starts inside, background scroll locked", '!!document.querySelector("dialog[open]") && !!document.activeElement.closest("dialog") && document.body.style.overflow === "hidden"');
    cli("run-code", 'async (page) => { for(let i=0;i<18;i++){await page.keyboard.press("Tab"); if(!await page.evaluate(()=>!!document.activeElement.closest("dialog"))) throw new Error("Modal focus escaped");} }');
    evidence.push({ check: "Native modal traps keyboard focus", passed: true });
    cli("press", "Escape");
    check("Closing restores the opener and page scrolling", '!document.querySelector("dialog[open]") && document.activeElement.textContent.includes("Gespräch anfragen") && document.body.style.overflow !== "hidden"');
    for (const [width,height] of [[320,568],[390,844],[768,1024]]) {
      cli("resize",String(width),String(height));
      cli("snapshot");
      cli("run-code", 'async (page) => { await page.getByRole("button",{name:"Menü",exact:true}).click(); await page.getByRole("navigation",{name:"Mobile Hauptnavigation"}).getByRole("button",{name:"Gespräch anfragen"}).click(); await page.getByRole("dialog").waitFor({state:"visible"}); }');
      check(`Popup and actions fit ${width}px viewport`, '(() => {const d=document.querySelector("dialog").getBoundingClientRect();const a=document.querySelector(".contact-actions").getBoundingClientRect();return d.left>=0 && d.right<=innerWidth && d.top>=0 && d.bottom<=innerHeight && a.bottom<=innerHeight && document.querySelector(".contact-main").scrollWidth<=d.width;})()');
      cli("press","Escape");
      check(`Mobile popup returns focus to the menu at ${width}px`, 'document.activeElement === document.querySelector(".menu-toggle") && document.body.style.overflow !== "hidden"');
    }
    cli("resize","390","844");
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("button",{name:"Menü",exact:true}).click(); await page.getByRole("navigation",{name:"Mobile Hauptnavigation"}).getByRole("button",{name:"Gespräch anfragen"}).click(); await page.getByRole("dialog").waitFor({state:"visible"}); await page.getByRole("button",{name:"Weiter",exact:true}).click(); }');
    check("Empty topic selection is explained inline", 'document.querySelector("dialog").textContent.includes("Wählen Sie mindestens ein Thema")');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("checkbox",{name:/Sprachbildung ermöglichen/}).check(); await page.getByRole("button",{name:"Weiter",exact:true}).click(); await page.getByRole("button",{name:"Weiter",exact:true}).click(); }');
    check("Contact validation explains missing details", 'document.querySelector("dialog").textContent.includes("Wie dürfen wir Sie ansprechen?") && document.querySelector("dialog").textContent.includes("gültige E-Mail-Adresse")');
    check("Missing contact fields focus the first invalid control", 'document.activeElement.name === "name" && document.activeElement.getAttribute("aria-invalid") === "true" && !!document.getElementById(document.activeElement.getAttribute("aria-describedby"))');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByLabel("Geschäftliche E-Mail",{exact:true}).fill("not-an-email"); await page.getByLabel("Ihr Name",{exact:true}).click(); }');
    check("Email format feedback appears on leaving a nonempty field", 'document.querySelector("input[name=email]").getAttribute("aria-invalid") === "true" && !!document.querySelector("[data-field=email] .field-error")');
    cli("run-code", 'async (page) => { const select=page.getByRole("combobox",{name:"Wo sind Sie zu Hause?",exact:true}); await select.focus(); await page.keyboard.press("Space"); await page.getByRole("listbox").waitFor({state:"visible"}); }');
    check("Dropdown stays inside the native modal top layer", '!!document.querySelector("[role=listbox]")?.closest("dialog[open]") && document.querySelectorAll("[role=option]").length === 3');
    cli("press","Escape");
    check("Escape closes only the dropdown and restores its trigger", '!!document.querySelector("dialog[open]") && !document.querySelector("[role=listbox]") && document.activeElement.getAttribute("role") === "combobox"');
    cli("press","Space");
    cli("press","ArrowDown");
    cli("press","Enter");
    check("Dropdown supports keyboard selection", 'document.querySelector("[data-field=location] .contact-select-trigger").textContent === "Bremer Umland" && !document.querySelector("[role=listbox]")');
    cli("press","Space");
    cli("press","e");
    cli("press","Enter");
    check("Dropdown supports typeahead", 'document.querySelector("[data-field=location] .contact-select-trigger").textContent === "Ein anderer Ort"');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("combobox",{name:"Wo sind Sie zu Hause?",exact:true}).click(); }');
    for (const [width,height] of [[320,568],[390,844],[768,1024],[1440,1000]]) {
      cli("resize",String(width),String(height));
      cli("run-code", 'async (page) => { if(!await page.getByRole("listbox").isVisible()) await page.getByRole("combobox",{name:"Wo sind Sie zu Hause?",exact:true}).click(); await page.getByRole("listbox").waitFor({state:"visible"}); }');
      check(`Dropdown remains within the ${width}px viewport`, '(() => {const r=document.querySelector("[role=listbox]").getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;})()');
    }
    cli("resize","390","844");
    cli("run-code", 'async (page) => { if(!await page.getByRole("listbox").isVisible()) await page.getByRole("combobox",{name:"Wo sind Sie zu Hause?",exact:true}).click(); await page.getByRole("listbox").waitFor({state:"visible"}); }');
    cli("screenshot","--filename","output/playwright/contact-select-mobile.png");
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("option",{name:"Bremer Umland",exact:true}).click(); }');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByLabel("Ihr Name",{exact:true}).fill("  CASA QA  "); await page.getByLabel("Unternehmen",{exact:true}).fill("CASA QA Testunternehmen"); await page.getByLabel("Geschäftliche E-Mail",{exact:true}).fill("casa-qa@example.invalid"); await page.getByRole("button",{name:"Weiter",exact:true}).click(); await page.getByRole("radio",{name:"Telefonisch",exact:true}).check(); await page.getByRole("radio",{name:"Einen Termin vorschlagen",exact:true}).check(); await page.getByRole("button",{name:"Anfrage lokal speichern",exact:true}).click(); }');
    check("Callback, date and preview notice are validated", 'document.querySelector("dialog").textContent.includes("Telefonnummer") && !!document.querySelector("[data-field=date] .field-error") && !!document.querySelector("[data-field=privacyAcknowledged] .field-error")');
    cli("snapshot");
    cli("run-code", `async (page) => { await page.getByLabel("Telefon für den Rückruf",{exact:true}).fill("+49 0000000000"); await page.getByLabel("Ihr Wunschdatum",{exact:true}).fill(${JSON.stringify(future)}); await page.getByLabel(/Was möchten Sie gemeinsam bewegen/).fill("Automated local preview fixture."); await page.getByRole("checkbox",{name:"Ich habe den Hinweis zur lokalen Vorschau gelesen.",exact:true}).check(); await page.getByRole("button",{name:"Bearbeiten",exact:true}).click(); }`);
    check("Back navigation preserves the selected region", 'document.querySelector("[data-field=location] .contact-select-trigger").textContent === "Bremer Umland"');
    check("Back navigation preserves contact answers", 'document.querySelector("input[name=name]").value.trim()==="CASA QA" && document.querySelector("input[name=organisation]").value==="CASA QA Testunternehmen"');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("button",{name:"Weiter",exact:true}).click(); await page.getByRole("combobox",{name:"Zeitraum · Bremer Zeit",exact:true}).click(); }');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("option",{name:"Nachmittags",exact:true}).click(); }');
    check("Review reflects the selected topics and meeting preference", 'document.querySelector(".contact-summary").textContent.includes("Sprachbildung ermöglichen") && document.querySelector(".contact-summary").textContent.includes("Nachmittags · 15–18 Uhr") && !!document.querySelector("input[type=date]").max');
    cli("snapshot");
    cli("run-code", 'async (page) => { let release; const gate=new Promise(resolve=>{release=resolve;}); await page.route("**/api/contact",async route=>{await gate; await route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({data:null,error:{message:"Die Anfrage konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut."}})});}); await page.getByRole("button",{name:"Anfrage lokal speichern",exact:true}).click(); try { await page.waitForFunction(()=>document.querySelector(".contact-form").getAttribute("aria-busy")==="true"); const locked=await page.evaluate(()=>[...document.querySelectorAll(".contact-current-step input, .contact-current-step textarea, .contact-current-step button, .contact-actions button")].every(el=>el.matches(":disabled"))&&!document.querySelector(".contact-close").disabled); if(!locked)throw new Error("Saving must lock editable controls"); } finally {release();} await page.getByRole("alert").waitFor({state:"visible"}); }');
    evidence.push({ check: "Saving prevents edits and duplicate submissions", passed: true });
    check("Failed submission preserves answers for retry", '!!document.querySelector(".contact-failure") && document.querySelector("input[name=phone]").value==="+49 0000000000" && document.querySelector("textarea").value.includes("preview fixture")');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.unroute("**/api/contact"); const responsePromise=page.waitForResponse(r=>r.url().endsWith("/api/contact")&&r.request().method()==="POST"); await page.getByRole("button",{name:"Anfrage lokal speichern",exact:true}).click(); const response=await responsePromise; const body=await response.json(); const request=response.request().postDataJSON(); await page.evaluate(info=>{document.documentElement.dataset.qaSaved=JSON.stringify(info);},{id:request.requestId,reference:body.data?.reference}); await page.getByRole("heading",{name:"Danke, CASA.",exact:true}).waitFor({state:"visible"}); }');
    const browserResult = JSON.parse(cli("eval",'JSON.parse(document.documentElement.dataset.qaSaved)').result);
    fixtures.push(path.join(directory,`${browserResult.id}.json`));
    const browserRecord=JSON.parse(readFileSync(fixtures.at(-1),"utf8"));
    pass("Popup writes a real local company/meeting enquiry", browserRecord.reference===browserResult.reference && browserRecord.details.organisation===sample.organisation && browserRecord.details.format==="telefon" && browserRecord.details.date===future && browserRecord.details.timeWindow==="nachmittags" && browserRecord.details.location==="umland");
    check("Success states local capture and no confirmed appointment", 'document.querySelector("dialog").textContent.includes("lokal gespeichert") && document.querySelector("dialog").textContent.includes("Ein Termin ist noch nicht vereinbart")');
    cli("screenshot","--filename","output/playwright/contact-success-mobile.png");
    cli("press","Escape");
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("button",{name:/03 Material und Technik weitergeben/}).click(); await page.getByRole("radio",{name:"Privatperson",exact:true}).check(); }');
    check("Partnership path prefills its topic", 'document.querySelector(\'input[name=topics][value=ausstattung]\').checked');
    cli("snapshot");
    cli("run-code", 'async (page) => { await page.getByRole("button",{name:"Weiter",exact:true}).click(); }');
    check("Private people are not asked for company details", '!document.querySelector("input[name=organisation]") && !document.querySelector("input[name=role]")');
    cli("screenshot","--filename","output/playwright/contact-person-mobile.png");
    cli("press","Escape");
    pass("Local privacy information is available", (await requestLocal("/datenschutz")).status===200);
  } finally {
    // Delete only this suite's explicitly identified synthetic enquiry fixtures.
    for(const file of fixtures) if(existsSync(file)) {
      const record=JSON.parse(readFileSync(file,"utf8"));
      if(record.details.email==="casa-qa@example.invalid" && record.details.name==="CASA QA") unlinkSync(file);
    }
  }
}
