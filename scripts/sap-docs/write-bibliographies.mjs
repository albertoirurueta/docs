// Writes the two bibliography pages from the URL lists that collect-sources.mjs --check produced.
//   node scripts/sap-docs/write-bibliographies.mjs <abap-src.json> <erp-src.json> <checked-date>
// The pages are generated, so a change of a source is made on the citing page, then this script is re-run.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [abapJson, erpJson, date] = process.argv.slice(2);
const root = new URL('../../modules/ROOT/pages/', import.meta.url).pathname;
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));

const titles = new Map();
const titleOf = (p) => {
  if (!titles.has(p)) titles.set(p, (readFileSync(join(root, p), 'utf8').match(/^= (.+)$/m) ?? [, p])[1].trim());
  return titles.get(p);
};
const bookRe = /sap-press\.com|informit\.com|doi\.org\/10\.1007/;
const generic = /^(source|here|link|docs?|documentation|more|read more)$/i;

function slugLabel(url) {
  const u = new URL(url);
  const last = decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() ?? u.hostname).replace(/\.(html?|md)$/i, '');
  return last.replace(/[-_]+/g, ' ').trim() || u.hostname;
}
function clean(label) {
  return label.replace(/[`+]/g, '').replace(/[{}*#~^<>|\\]/g, '').replace(/__+/g, '_').replace(/\]/g, '\\]').replace(/\s+/g, ' ').trim();
}
// merge fragments, pick one label per page URL
function merge(entries) {
  const m = new Map();
  for (const e of entries) {
    const key = e.url.replace(/#.*$/, '');
    const x = m.get(key) ?? { url: key, labels: [], pages: new Set(), status: 'ok' };
    e.labels.forEach((l) => x.labels.push(l));
    e.pages.forEach((p) => x.pages.add(p));
    if (e.status !== 'ok') x.status = e.status;
    m.set(key, x);
  }
  return [...m.values()].map((x) => {
    const cands = x.labels.map(clean).filter((l) => l.length >= 4 && !generic.test(l)).sort((a, b) => a.length - b.length);
    return { url: x.url, label: cands[0] ?? clean(slugLabel(x.url)), pages: [...x.pages].sort(), status: x.status };
  }).sort((a, b) => a.url.localeCompare(b.url));
}
const cite = (pages) => {
  const first = `xref:${pages[0]}[${titleOf(pages[0]).replace(/\]/g, '\\]')}]`;
  return pages.length === 1 ? `cited in ${first}` : `cited in ${first} and ${pages.length - 1} more page${pages.length === 2 ? '' : 's'}`;
};
const line = (e) => `* ${e.url}[${e.label}] -- ${cite(e.pages)}`;
const block = (title, list, level = '====') => (list.length ? `${level} ${title}\n\n${list.map(line).join('\n')}\n\n` : '');

function helpDeliverable(url) {
  const m = new URL(url).pathname.match(/^\/docs\/([^/]+)\/([^/]+)/);
  if (!m) return 'Other SAP Help Portal pages';
  const [, prod, del] = m;
  const known = { abap_cloud: 'ABAP Cloud', abap_platform_new: 'ABAP Platform', 'sap_s4hana_on-premise': 'SAP S/4HANA (on premise)', sap_s4hana_cloud: 'SAP S/4HANA Cloud Public Edition', btp: 'SAP Business Technology Platform', sapui5: 'SAPUI5', sap_fiori: 'SAP Fiori', sap_hana_platform: 'SAP HANA Platform', hr_renewal: 'HCM (HR Renewal)', successfactors: 'SAP SuccessFactors' };
  return known[prod.toLowerCase()] ?? prod.replace(/[_-]+/g, ' ');
}

// ---------- ABAP ----------
function abapPage() {
  const all = merge(read(abapJson));
  const books = [], kd = [], guides = [], tools = [], samples = [], learning = [], other = [], nonOfficial = [];
  for (const e of all) {
    const u = new URL(e.url);
    if (bookRe.test(e.url)) continue;
    if (u.hostname === 'help.sap.com') (/\/abap-keywords|abapdocu/.test(u.pathname) ? kd : guides).push(e);
    else if (u.hostname === 'github.com' || u.hostname === 'sap.github.io' && /styleguides|abap-atc/.test(u.pathname)) samples.push(e);
    else if (/learning\.sap\.com|developers\.sap\.com/.test(u.hostname)) learning.push(e);
    else if (/abaplint|abapgit|tools\.hana|npmjs|nodejs|visualstudio/.test(u.hostname)) tools.push(e);
    else if (u.hostname === 'community.sap.com') nonOfficial.push(e);
    else other.push(e);
  }
  const byDel = new Map();
  for (const e of guides) { const k = helpDeliverable(e.url); (byDel.get(k) ?? byDel.set(k, []).get(k)).push(e); }
  const guideText = [...byDel.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => block(k, v)).join('');
  const failed = all.filter((e) => e.status !== 'ok');
  return `= ABAP Bibliography
:description: Every source cited in the ABAP section, grouped as Keyword Documentation, guides, tools, samples and style guides, learning, books and standards, with the date the links were checked.
:keywords: ABAP bibliography, ABAP Keyword Documentation, SAP Help Portal, abaplint, abapGit, clean ABAP, SAP-samples, SAP Learning, SAP PRESS, ABAP books

include::partial$ai-disclaimer.adoc[]

This page lists the sources that the pages of the xref:programming-languages/abap/index.adoc[ABAP section] cite, so that you can find the original text behind a statement. Each entry names the source and one page that cites it. Official SAP documentation comes first in every group; the few sources that are not official are in their own list at the end.

Checked on ${date}: ${all.length} addresses were requested without signing in. SAP Help Portal topics were checked against the portal's own topic service, because the portal pages load their text with JavaScript, and the other sites were requested over HTTP. ${failed.length === 0 ? 'Every address answered.' : `${failed.length} did not answer as a page and are listed under the failed links below.`} A site that blocks scripted requests can answer with an error while the page opens in a browser; the npm package page of the abaplint transpiler is one of them, and its package was confirmed in the npm registry instead.

== Books

Books are cited only through their publisher pages. The edition named in each entry is the one consulted; a publisher page sometimes shows a newer edition.

* https://www.sap-press.com/complete-abap_5567/[Complete ABAP (SAP PRESS)] -- the first edition (2016, ISBN 978-1-4932-1272-9) was consulted; the publisher page shows the current edition (ISBN 978-1-4932-2305-3, updated for ABAP 2021). Where the first edition is out of date, the page that cites it says so.
* https://www.informit.com/store/sap.kellerabap-objectsc-9780201750805[ABAP Objects, Horst Keller and Joachim Krüger (Addison-Wesley Professional)] -- the first edition (2002, ISBN 978-0-201-75080-5).
* https://www.sap-press.com/abap-development-for-sap-hana_3973/[ABAP Development for SAP HANA (SAP PRESS)] -- listed as further reading, first edition (2014, ISBN 978-1-59229-859-4); the publisher page shows a successor edition (ISBN 978-1-4932-1304-7).
* https://www.sap-press.com/abap-restful-programming-model_4988/[ABAP RESTful Programming Model (SAP PRESS)] -- first edition (2019, ISBN 978-1-4932-1903-2).

== Sources by group

=== Keyword Documentation

The ABAP Keyword Documentation on the SAP Help Portal is the reference for statements, built-in functions and language rules.

${block('Keyword Documentation topics', kd, '====')}=== Guides

SAP Help Portal guides and product documentation, grouped by product.

${guideText}=== Tools

${block('Tools and their documentation', tools)}=== Samples and style guides

${block('GitHub repositories, samples and style guides', samples)}=== Learning

${block('SAP Learning and SAP Developers', learning)}=== Standards and other official pages

${block('Other pages', other)}== Non-official sources

These pages are discussions or third-party text. They are cited only as a pointer to what practitioners report, never as the authority for a rule.

${nonOfficial.map(line).join('\n')}

${failed.length ? `== Links that did not answer\n\n${failed.map((e) => `* ${e.url}[${e.label}] -- ${e.status}; ${cite(e.pages)}`).join('\n')}\n` : ''}`;
}

// ---------- ERP ----------
const areaOf = (pages) => {
  const a = new Set(pages.map((p) => (p.startsWith('erp/sap/finance/') ? 'fin' : p.startsWith('erp/sap/human-resources/') ? 'hr' : 'gen')));
  return a.size === 1 ? [...a][0] : 'gen';
};
function erpKind(e) {
  const u = new URL(e.url);
  const h = u.hostname;
  if (h === 'help.sap.com') return helpDeliverable(e.url).startsWith('SAP S/4HANA') || /^(ABAP|SAP SuccessFactors|HCM)/.test(helpDeliverable(e.url)) || true ? 'SAP Help Portal: ' + helpDeliverable(e.url) : '';
  if (h === 'cap.cloud.sap') return 'CAP documentation';
  if (/learning\.sap\.com|developers\.sap\.com/.test(h)) return 'SAP Learning and SAP Developers';
  if (/ui5|fioriappslibrary|fal\.cloud/.test(h) || (h === 'www.sap.com' && /design-system/.test(u.pathname))) return 'SAPUI5 and SAP Fiori';
  if (/github|sap\.github\.io/.test(h)) return 'GitHub repositories and samples';
  if (/sap\.com$/.test(h)) return 'Other SAP pages';
  return 'Standards and open-source project documentation';
}
function erpPage() {
  const all = merge(read(erpJson));
  const nonOfficial = [], loginOnly = [];
  const groups = { gen: [], fin: [], hr: [] };
  for (const e of all) {
    if (bookRe.test(e.url)) continue;
    const h = new URL(e.url).hostname;
    if (/preeta\.dev|adesso|oracle\.com|odoo\.com|frappe\.io|microsoft\.com/.test(h)) { nonOfficial.push(e); continue; }
    if (/^(api|support)\.sap\.com$|fal\.cloud\.sap|fioriappslibrary/.test(h)) loginOnly.push(e);
    groups[areaOf(e.pages)].push(e);
  }
  const render = (list) => {
    const by = new Map();
    for (const e of list) { const k = erpKind(e); (by.get(k) ?? by.set(k, []).get(k)).push(e); }
    const order = (k) => (k.startsWith('SAP Help Portal') ? 0 : k === 'CAP documentation' ? 1 : k === 'SAP Learning and SAP Developers' ? 2 : 3);
    return [...by.entries()].sort(([a], [b]) => order(a) - order(b) || a.localeCompare(b)).map(([k, v]) => block(k, v)).join('');
  };
  const failed = all.filter((e) => e.status !== 'ok');
  const books = {
    gen: `==== Books

* https://www.sap-press.com/abap-restful-programming-model_4988/[ABAP RESTful Programming Model (SAP PRESS)] -- first edition (2019, ISBN 978-1-4932-1903-2).
* https://www.sap-press.com/sap-api-management_4928/[SAP API Management (SAP PRESS)] -- first edition (2019, ISBN 978-1-4932-1860-8); listed as further reading.
* https://www.sap-press.com/complete-abap_5567/[Complete ABAP (SAP PRESS)] -- the first edition (2016, ISBN 978-1-4932-1272-9) was consulted; the publisher page shows the current edition (ISBN 978-1-4932-2305-3).

`,
    fin: `==== Books

* https://www.sap-press.com/configuring-sap-s4hana-finance_5920/[Configuring SAP S/4HANA Finance (SAP PRESS)] -- third edition (2025, ISBN 978-1-4932-2620-7).
* https://doi.org/10.1007/978-1-4842-8957-0[SAP S/4HANA Financial Accounting Configuration (Apress)] -- second edition (2023, print ISBN 978-1-4842-8956-3); the address opens the publisher's page on Springer Nature Link.

`,
    hr: `==== Books

* https://www.sap-press.com/sap-erp-hcm-technical-principles-and-programming_3698/[SAP ERP HCM Technical Principles and Programming (SAP PRESS)] -- the first edition (2013, ISBN 978-1-59229-431-2) was consulted; the publisher page shows the second edition (ISBN 978-1-4932-1170-8).

`,
  };
  const section = (title, key, intro) => `=== ${title}\n\n${intro}\n\n${render(groups[key])}${books[key] ?? ''}`;
  return `= SAP Bibliography
:description: Every source cited in the SAP section, grouped as General, Finance and Human Resources, with the books, a list of non-official and sign-in sources, and the date the links were checked.
:keywords: SAP bibliography, SAP Help Portal, SAP S/4HANA, SAP BTP, CAP, SAPUI5, SAP Learning, SAP PRESS, SAP Finance sources, SAP HR sources

include::partial$ai-disclaimer.adoc[]

This page lists the sources that the pages of the xref:erp/sap/index.adoc[SAP section] cite, so that you can find the original text behind a statement. A source that only Finance pages cite is in the Finance group, one that only Human Resources pages cite is in the Human Resources group, and everything else is in the General group. Each entry names the source and one page that cites it.

Checked on ${date}: ${all.length} addresses were requested without signing in. SAP Help Portal topics were checked against the portal's own topic service, because the portal pages load their text with JavaScript, and the other sites were requested over HTTP. ${failed.length === 0 ? 'Every address answered.' : `${failed.length} did not answer as a page and are listed under the failed links below.`} A site that blocks scripted requests can answer with an error while the page opens in a browser. One topic that exists only in release 2608.00 of the SAP S/4HANA Cloud Public Edition What's New text was confirmed with that release number.

== Sources by group

${section('General', 'gen', 'Sources for the general SAP pages: landscape, architecture, integration, SAP BTP, CAP, SAPUI5 and SAP Fiori, extensibility and operations. It also holds every source that pages of more than one area cite.')}${section('Finance', 'fin', 'Sources that only the Finance pages cite.')}${section('Human Resources', 'hr', 'Sources that only the Human Resources pages cite.')}== Non-official and sign-in sources

=== Non-official sources

Third-party pages. A blog or a competitor's product page is cited only to show how others describe something, never as the authority for a rule.

${nonOfficial.map(line).join('\n')}

=== Sources whose content needs a sign-in

These addresses are public start pages, but part of what they lead to, such as downloads, API definitions or support content, needs an SAP sign-in. No account was used for this site, so those parts were not read.

${loginOnly.map(line).join('\n')}

${failed.length ? `== Links that did not answer\n\n${failed.map((e) => `* ${e.url}[${e.label}] -- ${e.status}; ${cite(e.pages)}`).join('\n')}\n` : ''}`;
}

writeFileSync(join(root, 'programming-languages/abap/bibliography.adoc'), abapPage());
writeFileSync(join(root, 'erp/sap/bibliography.adoc'), erpPage());
console.log('written');
