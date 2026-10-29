import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile?.(".env.local");
const directory = path.resolve(process.env.CONTACT_PREVIEW_DIR || ".local/enquiries");
let files;
try { files = (await readdir(directory)).filter(file => /^[a-f\d-]{36}\.json$/i.test(file)); }
catch (cause) { if (cause.code !== "ENOENT") throw cause; files = []; }
const enquiries = await Promise.all(files.map(async file => {
  const record = JSON.parse(await readFile(path.join(directory,file), "utf8"));
  return { reference: record.reference, receivedAt: record.receivedAt, ...record.details };
}));
enquiries.sort((a,b) => b.receivedAt.localeCompare(a.receivedAt));
console.log(JSON.stringify(enquiries, null, 2));
