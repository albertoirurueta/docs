// Collects every external URL cited by the ABAP and ERP/SAP pages (with its link text and citing pages) and,
// with --check, verifies each one without signing in. Usage:
//   node scripts/sap-docs/collect-sources.mjs <abap|erp> <out.json> [--check]
// help.sap.com topics are checked against the portal's metadata service (a missing topic answers with a
// redirect to a landing page); other hosts are requested over HTTP. localhost and example hosts are skipped.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../../modules/ROOT/pages/', import.meta.url).pathname;
const dirs = { abap: 'programming-languages/abap', erp: 'erp' };
const [area, out, flag] = process.argv.slice(2);
if (!dirs[area] || !out) { console.error('usage: collect-sources.mjs <abap|erp> <out.json> [--check]'); process.exit(2); }

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.adoc') ? [join(d, e.name)] : []);
const skipHost = /^(localhost|127\.|host$|.*\.example\.com$|.*\.corp$|.*\.virtual$|.*mydomain\.com$|xyz\.|.*\.hana\.ondemand\.com$)/i;
const found = new Map();
for (const f of walk(join(root, dirs[area]))) {
  const text = readFileSync(f, 'utf8');
  const rel = relative(root, f);
  for (const m of text.matchAll(/(https?:\/\/[^\]\s\[<>"`|']+)(?:\[([^\]]*)\])?/g)) {
    let url = m[1].replace(/[.,;:)]+$/, '');
    let host;
    try { host = new URL(url).hostname; } catch { continue; }
    if (skipHost.test(host) && !/(^|\.)(tools|fioriappslibrary)\.hana\.ondemand\.com$/.test(host)) continue;
    if (/[*{}~]/.test(url)) continue;
    if (/xmlns(:\w+)?=["']$/.test(text.slice(Math.max(0, m.index - 12), m.index))) continue; // XML namespace, not a link
    const e = found.get(url) ?? { url, labels: new Set(), pages: new Set() };
    if (m[2]) e.labels.add(m[2].replace(/^\*+|\*+$/g, '').replace(/\s+/g, ' ').trim());
    e.pages.add(rel);
    found.set(url, e);
  }
}
const entries = [...found.values()].map((e) => ({ url: e.url, labels: [...e.labels], pages: [...e.pages].sort() }))
  .sort((a, b) => a.url.localeCompare(b.url));

async function checkHelp(u) {
  const m = u.pathname.match(/^\/docs\/([^/]+)\/([^/]+)\/(.+)$/);
  if (!m) {
    const r = await fetch(u, { redirect: 'follow' });
    return r.status < 400 ? 'ok' : `HTTP ${r.status}`;
  }
  const q = new URLSearchParams({ product_url: m[1], topic_url: m[3], version: 'LATEST', loadlandingpageontopicnotfound: 'true', deliverable_url: m[2] });
  const v = u.searchParams.get('version'); if (v) q.set('version', v);
  const r = await fetch(`https://help.sap.com/http.svc/deliverableMetadata?${q}`);
  if (!r.ok) return `metadata HTTP ${r.status}`;
  const j = await r.json();
  if (j.data?.redirect) return `missing (portal redirects to ${j.data.redirect.slice(0, 60)})`;
  return j.status === 'OK' ? 'ok' : `metadata ${j.status}`;
}
async function checkHttp(u) {
  const opt = { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (link check)' }, signal: AbortSignal.timeout(25000) };
  let r = await fetch(u, { ...opt, method: 'HEAD' }).catch(() => null);
  if (!r || r.status >= 400) r = await fetch(u, { ...opt, method: 'GET' });
  return r.status < 400 ? 'ok' : `HTTP ${r.status}`;
}
if (flag === '--check' || flag === '--recheck') {
  // --recheck re-requests only the entries that failed in the previous run (kept in out.json), one at a time
  let list = entries;
  if (flag === '--recheck') {
    const prev = new Map(JSON.parse(readFileSync(out, 'utf8')).map((e) => [e.url, e]));
    for (const e of entries) e.status = prev.get(e.url)?.status ?? 'unchecked';
    list = entries.filter((e) => e.status !== 'ok');
  }
  let i = 0;
  const run = async () => {
    for (;;) {
      const e = list[i++]; if (!e) return;
      const u = new URL(e.url);
      for (let t = 0; t < 4; t++) {
        try { e.status = u.hostname === 'help.sap.com' ? await checkHelp(u) : await checkHttp(e.url); }
        catch (err) { e.status = `error ${err.cause?.code ?? err.message}`; }
        if (e.status === 'ok' || !/403|429|error/.test(e.status)) break;
        await new Promise((r) => setTimeout(r, 2000 * (t + 1)));
      }
    }
  };
  await Promise.all(Array.from({ length: flag === '--recheck' ? 1 : 3 }, run));
}
writeFileSync(out, JSON.stringify(entries, null, 1));
const bad = entries.filter((e) => e.status && e.status !== 'ok');
console.log(`${entries.length} URLs${flag ? `, ${bad.length} not ok` : ''}`);
for (const e of bad) console.log(e.status, e.url, e.pages[0]);
