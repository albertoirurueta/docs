#!/usr/bin/env node
// Generates the content diagrams of the ERP and SAP general pages (`erp/overview.adoc`, `erp/sap/what-is-sap.adoc`,
// `erp/sap/architecture-and-virtual-data-model.adoc`, `erp/sap/organizational-structures.adoc`) into
// modules/ROOT/images/. Colours come from scripts/cards/palette.mjs only; text is `currentColor` so it follows the
// theme. No SAP logo is drawn. Usage: node scripts/sap-docs/generate-diagrams.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brand } from '../cards/palette.mjs';
import { textWidth } from '../figure-lib/text.mjs';

const imagesDir = join(dirname(fileURLToPath(import.meta.url)), '../../modules/ROOT/images');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

class Fig {
  constructor(file, w, h, title, desc) {
    Object.assign(this, { file, w, h, title, desc, body: [] });
  }
  fitCheck(str, size, weight, maxW) {
    const tw = textWidth(str, size, { weight });
    if (tw > maxW) throw new Error(`${this.file}: "${str}" is ${Math.round(tw)}px wide, box allows ${maxW}`);
  }
  box(x, y, w, h, colour, lines, { size = 13, bold = false, sub, opacity = 0.3 } = {}) {
    this.body.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${colour}" fill-opacity="${opacity}" stroke="currentColor" stroke-width="1.5"/>`);
    const arr = Array.isArray(lines) ? lines : [lines];
    const all = sub ? [...arr, ...(Array.isArray(sub) ? sub : [sub])] : arr;
    const lh = size + 5;
    const total = all.length * lh;
    let ty = y + (h - total) / 2 + size;
    all.forEach((l, i) => {
      const main = i < arr.length;
      const sz = main ? size : size - 2;
      const wt = main && bold ? 'bold' : 'normal';
      this.fitCheck(l, sz, wt === 'bold' ? 700 : 400, w - 16);
      this.body.push(`  <text x="${x + w / 2}" y="${ty}" text-anchor="middle" font-size="${sz}"${wt === 'bold' ? ' font-weight="bold"' : ''}>${esc(l)}</text>`);
      ty += lh;
    });
  }
  label(x, y, str, { anchor = 'start', size = 12, bold = false } = {}) {
    this.body.push(`  <text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}"${bold ? ' font-weight="bold"' : ''}>${esc(str)}</text>`);
  }
  line(x1, y1, x2, y2, { arrow = false, dash = false } = {}) {
    this.body.push(`  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1.5"${dash ? ' stroke-dasharray="5 4"' : ''}${arrow ? ' marker-end="url(#a)"' : ''}/>`);
  }
  svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}" role="img" aria-labelledby="t d" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="currentColor">
  <title id="t">${esc(this.title)}</title>
  <desc id="d">${esc(this.desc)}</desc>
  <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
${this.body.join('\n')}
</svg>
`;
  }
  write() {
    if (process.env.ONLY && !this.file.includes(process.env.ONLY)) return;
    writeFileSync(join(imagesDir, this.file), this.svg());
    console.log('wrote', this.file);
  }
}

// 1. ERP: integrated modules over one database.
{
  const f = new Fig('erp-integrated-modules.svg', 1040, 520,
    'An ERP system: integrated modules over one shared database',
    'Seven modules (finance, controlling, procurement, sales, manufacturing, logistics and human resources) sit on top of one shared database. The database holds master data, which changes rarely and is shared by every module, and transactional data, which every business event adds. Arrows show that a posting in one module, such as a goods receipt in procurement, updates the data that finance reads.');
  const mods = [
    ['Finance', brand.indigo], ['Controlling', brand.violet], ['Procurement', brand.greenDeep], ['Sales', brand.pink],
    ['Manufacturing', brand.teal], ['Logistics', brand.azure], ['Human resources', brand.green],
  ];
  const bw = 136, gap = 10, x0 = 14;
  mods.forEach(([n, c], i) => {
    const x = x0 + i * (bw + gap);
    f.box(x, 20, bw, 56, c, n, { size: 13, bold: true });
    f.line(x + bw / 2, 76, x + bw / 2, 150, { arrow: true });
    f.line(x + bw / 2, 150, x + bw / 2, 76, { arrow: true });
  });
  f.box(20, 150, 500, 150, brand.pink, 'Master data', { size: 15, bold: true, sub: ['Customers, suppliers, products, employees, accounts.', 'Created once, changed rarely, shared by every module.'] });
  f.box(540, 150, 480, 150, brand.green, 'Transactional data', { size: 15, bold: true, sub: ['Orders, goods receipts, invoices, postings, payroll runs.', 'Every business event adds a record that refers to master data.'] });
  f.line(520, 300, 520, 340, { arrow: true });
  f.box(20, 340, 1000, 70, brand.indigo, 'One shared database', { size: 16, bold: true, sub: 'A single version of the truth: no copies to reconcile between departments.' });
  f.box(20, 430, 1000, 70, brand.violet, 'Example: a goods receipt in procurement', { size: 14, bold: true, sub: 'It raises the stock quantity (logistics) and books the value (finance) in one step, with no re-typing.', opacity: 0.2 });
  f.write();
}

// 2. SAP landscape: S/4HANA core, lines of business and satellites.
{
  const f = new Fig('sap-landscape.svg', 1040, 520,
    'The SAP landscape: the S/4HANA core, its lines of business and the cloud products around it',
    'SAP S/4HANA is the core ERP system in the centre. Its lines of business are finance, sourcing and procurement, sales, manufacturing, supply chain and asset management. Around it sit separate cloud products: SAP SuccessFactors for human resources, SAP Ariba for procurement networks, SAP Concur for travel and expense, and SAP Business Technology Platform for integration and extensions.');
  f.box(260, 60, 520, 330, brand.indigo, 'SAP S/4HANA (digital core)', { size: 16, bold: true, opacity: 0.18 });
  // Move title to top of core: redraw as label.
  f.body.pop();
  f.body.pop();
  f.body.push(`  <rect x="260" y="60" width="520" height="330" rx="14" fill="${brand.indigo}" fill-opacity="0.18" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(520, 92, 'SAP S/4HANA, the core ERP system', { anchor: 'middle', size: 16, bold: true });
  f.label(520, 112, 'lines of business that share one data model', { anchor: 'middle', size: 12 });
  const lob = [
    ['Finance', brand.indigo], ['Sourcing and', brand.greenDeep, 'procurement'], ['Sales', brand.pink],
    ['Manufacturing', brand.teal], ['Supply chain', brand.azure], ['Asset management', brand.violet],
  ];
  lob.forEach(([n, c, n2], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    f.box(280 + col * 164, 134 + row * 120, 152, 96, c, n2 ? [n, n2] : n, { size: 14, bold: true });
  });
  const sat = [
    [20, 60, 'SAP SuccessFactors', 'human resources', brand.green],
    [20, 200, 'SAP Ariba', 'procurement networks', brand.greenDeep],
    [20, 330, 'SAP Concur', 'travel and expense', brand.teal],
  ];
  sat.forEach(([x, y, n, s, c]) => {
    f.box(x, y, 210, 70, c, n, { size: 14, bold: true, sub: s });
    f.line(x + 210, y + 35, 260, y + 35 > 390 ? 385 : y + 35, { dash: true, arrow: true });
  });
  f.box(810, 60, 210, 330, brand.violet, ['SAP Business', 'Technology Platform'], { size: 15, bold: true, sub: ['integration, extensions,', 'data and analytics', 'services'] });
  f.line(780, 225, 810, 225, { arrow: true });
  f.box(260, 420, 760, 70, brand.pink, 'Users reach all of it through SAP Fiori launchpad and SAP GUI', { size: 14, bold: true, sub: 'Browser and desktop front ends in front of the core and the cloud products.', opacity: 0.2 });
  f.write();
}

// 3. S/4HANA three tiers.
{
  const f = new Fig('sap-s4hana-three-tier.svg', 1040, 560,
    'Three tiers of SAP S/4HANA: presentation, ABAP application server and SAP HANA database',
    'Presentation tier: a browser with SAP Fiori launchpad and the desktop program SAP GUI. Application tier: the ABAP application server, which runs ABAP programs, exposes OData services through SAP Gateway and contains the virtual data model, a layer of CDS views whose names start with I_ for interface views and C_ for consumption views. Database tier: SAP HANA, which stores the tables and runs the CDS views. Requests go down, results come back up.');
  f.box(20, 20, 1000, 120, brand.pink, 'Presentation tier', { size: 16, bold: true, opacity: 0.22 });
  f.body.pop(); f.body.pop();
  f.body.push(`  <rect x="20" y="20" width="1000" height="130" rx="14" fill="${brand.pink}" fill-opacity="0.18" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(40, 46, 'Presentation tier: what the user sees', { size: 15, bold: true });
  f.box(60, 62, 420, 72, brand.pink, 'SAP Fiori launchpad', { size: 14, bold: true, sub: 'web browser, apps as tiles' });
  f.box(560, 62, 420, 72, brand.violet, 'SAP GUI', { size: 14, bold: true, sub: 'desktop program, transactions' });
  f.line(270, 150, 270, 190, { arrow: true });
  f.line(770, 150, 770, 190, { arrow: true });
  f.label(290, 176, 'HTTPS, OData', { size: 12 });
  f.label(790, 176, 'SAP GUI protocol (DIAG)', { size: 12 });
  f.body.push(`  <rect x="20" y="190" width="1000" height="190" rx="14" fill="${brand.indigo}" fill-opacity="0.18" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(40, 216, 'Application tier: the ABAP application server', { size: 15, bold: true });
  f.box(60, 232, 280, 130, brand.indigo, 'ABAP programs', { size: 14, bold: true, sub: ['business logic, transactions,', 'classes, RAP business objects'] });
  f.box(380, 232, 280, 130, brand.azure, 'SAP Gateway (OData)', { size: 14, bold: true, sub: ['services that Fiori apps', 'and other clients call'] });
  f.box(700, 232, 280, 130, brand.greenDeep, 'Virtual data model', { size: 14, bold: true, sub: ['CDS views: I_ interface views,', 'C_ consumption views'] });
  f.line(520, 380, 520, 420, { arrow: true });
  f.body.push(`  <rect x="20" y="420" width="1000" height="120" rx="14" fill="${brand.green}" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(40, 446, 'Database tier', { size: 15, bold: true });
  f.box(60, 458, 920, 66, brand.green, 'SAP HANA', { size: 14, bold: true, sub: 'in-memory column store: tables of the data model, CDS views run here' });
  f.write();
}

// 4. Enterprise structure.
{
  const f = new Fig('sap-enterprise-structure.svg', 1040, 540,
    'The SAP enterprise structure: client, company code, plant, storage location, controlling area, sales area and purchasing organization',
    'A client contains one or more company codes. A company code contains one or more plants, and a plant contains one or more storage locations. A controlling area groups company codes for management accounting. A sales organization, together with a distribution channel and a division, forms a sales area. A purchasing organization buys for one or more plants.');
  f.body.push(`  <rect x="20" y="20" width="1000" height="500" rx="14" fill="${brand.ink}" fill-opacity="0.08" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4"/>`);
  f.label(40, 46, 'Client: the top level, one business entity with its own data', { size: 15, bold: true });
  // Financial and logistics chain.
  f.label(60, 84, 'Accounting and logistics', { size: 13, bold: true });
  f.box(60, 98, 220, 70, brand.indigo, 'Company code', { size: 14, bold: true, sub: 'legal entity, own books' });
  f.line(280, 133, 340, 133, { arrow: true });
  f.label(310, 124, '1 : n', { anchor: 'middle' });
  f.box(340, 98, 220, 70, brand.greenDeep, 'Plant', { size: 14, bold: true, sub: 'production or storage site' });
  f.line(560, 133, 620, 133, { arrow: true });
  f.label(590, 124, '1 : n', { anchor: 'middle' });
  f.box(620, 98, 220, 70, brand.teal, 'Storage location', { size: 14, bold: true, sub: 'where stock is kept' });
  f.box(60, 210, 220, 70, brand.violet, 'Controlling area', { size: 14, bold: true, sub: 'management accounting' });
  f.line(170, 210, 170, 168, { arrow: true });
  f.label(180, 194, 'groups company codes', { size: 12 });
  // Sales and purchasing.
  f.label(60, 320, 'Sales and purchasing', { size: 13, bold: true });
  f.box(60, 342, 220, 70, brand.pink, 'Sales organization', { size: 14, bold: true, sub: 'sells and invoices' });
  f.box(340, 342, 220, 70, brand.pink, 'Distribution channel', { size: 14, bold: true, sub: 'how goods reach customers' });
  f.box(620, 342, 220, 70, brand.pink, 'Division', { size: 14, bold: true, sub: 'product line' });
  f.body.push(`  <rect x="46" y="330" width="808" height="94" rx="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>`);
  f.label(870, 372, 'together', { size: 12 });
  f.label(870, 390, 'a sales area', { size: 13, bold: true });
  f.box(60, 440, 220, 66, brand.azure, 'Purchasing organization', { size: 14, bold: true, sub: 'negotiates and buys' });
  f.label(300, 478, 'buys for one or more plants', { size: 12 });
  f.write();
}

// 5. SAP BTP account model.
{
  const f = new Fig('sap-btp-account-model.svg', 1040, 560,
    'The SAP BTP account model: global account, directories, subaccounts, and the Cloud Foundry and Kyma environments inside a subaccount',
    'A global account is the contract with SAP. It can contain directories, which only group subaccounts, and it holds entitlements and quotas that are assigned to subaccounts. A subaccount lives in one region. Inside a subaccount, the Cloud Foundry environment provides an organization with spaces, and the Kyma environment provides a Kubernetes cluster. Applications and service instances live in spaces or in the cluster.');
  f.body.push(`  <rect x="20" y="20" width="1000" height="520" rx="14" fill="${brand.ink}" fill-opacity="0.08" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4"/>`);
  f.label(40, 46, 'Global account: the contract with SAP, billing and the pool of entitlements', { size: 15, bold: true });
  f.box(40, 62, 300, 50, brand.azure, 'Entitlements and quotas', { size: 14, bold: true, sub: 'what you may use, and how much' });
  f.box(380, 62, 300, 50, brand.pink, 'Directory (optional)', { size: 14, bold: true, sub: 'only groups subaccounts' });
  f.line(190, 112, 190, 160, { arrow: true });
  f.label(200, 142, 'assigned to subaccounts', { size: 12 });
  f.line(530, 112, 530, 160, { arrow: true });
  f.label(540, 142, 'contains', { size: 12 });
  f.body.push(`  <rect x="40" y="160" width="940" height="360" rx="12" fill="${brand.indigo}" fill-opacity="0.14" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(60, 186, 'Subaccount: one region, one set of users, roles and trust settings', { size: 15, bold: true });
  f.body.push(`  <rect x="60" y="204" width="440" height="296" rx="10" fill="${brand.green}" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(76, 228, 'Cloud Foundry environment', { size: 14, bold: true });
  f.box(80, 242, 400, 56, brand.greenDeep, 'Organization', { size: 14, bold: true, sub: 'one per subaccount' });
  f.box(80, 318, 190, 70, brand.teal, 'Space dev', { size: 14, bold: true, sub: ['apps and service', 'instances'] });
  f.box(290, 318, 190, 70, brand.teal, 'Space prod', { size: 14, bold: true, sub: ['apps and service', 'instances'] });
  f.line(175, 298, 175, 318, { arrow: true });
  f.line(385, 298, 385, 318, { arrow: true });
  f.label(80, 420, 'Buildpacks run the apps; cf push deploys them.', { size: 12 });
  f.body.push(`  <rect x="540" y="204" width="420" height="296" rx="10" fill="${brand.violet}" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/>`);
  f.label(556, 228, 'Kyma environment', { size: 14, bold: true });
  f.box(560, 242, 380, 56, brand.violet, 'Kubernetes cluster', { size: 14, bold: true, sub: 'managed on Gardener' });
  f.box(560, 318, 180, 70, brand.indigo, 'Namespace', { size: 14, bold: true, sub: ['workloads and', 'APIRules'] });
  f.box(760, 318, 180, 70, brand.indigo, 'Namespace', { size: 14, bold: true, sub: ['workloads and', 'APIRules'] });
  f.line(650, 298, 650, 318, { arrow: true });
  f.line(850, 298, 850, 318, { arrow: true });
  f.label(560, 420, 'Containers run the apps; kubectl applies them.', { size: 12 });
  f.write();
}

// 6. CAP layers.
{
  const f = new Fig('sap-cap-layers.svg', 1040, 560,
    'The layers of the SAP Cloud Application Programming Model: models, services, generic providers, protocol adapters and databases',
    'Models written in CDS describe the domain and the services. Services expose entities and run generic providers and handlers; custom handlers add business logic. Protocol adapters publish services: the Node.js runtime provides OData V4 and REST, GraphQL needs a plugin, and the Java runtime documents OData V4 and V2. Queries written in CQL are turned into CQN and run against SQLite in development, SAP HANA in production or PostgreSQL. The Node.js and the Java runtime implement the same layers side by side.');
  f.box(20, 20, 1000, 70, brand.pink, 'Models: CDS files (db/ and srv/)', { size: 15, bold: true, sub: 'entities, services, annotations; compiled to CSN, a JSON form the runtimes read' });
  f.line(520, 90, 520, 120, { arrow: true });
  f.box(20, 120, 1000, 100, brand.indigo, 'Services: stateless facades, every request is an event', { size: 15, bold: true, sub: ['Generic providers handle reads, writes, drafts and validation without code.', 'Custom handlers (before, on, after) add your business logic.'] });
  f.line(520, 220, 520, 250, { arrow: true });
  f.box(20, 250, 1000, 70, brand.violet, 'Protocol adapters: OData V4 and REST, GraphQL with a plugin', { size: 15, bold: true, sub: 'Node.js: the same service in several protocols. Java: OData V4 and V2.' });
  f.line(520, 320, 520, 350, { arrow: true });
  f.box(20, 350, 1000, 70, brand.azure, 'Queries: CQL in your code becomes CQN, pushed down to the database', { size: 15, bold: true, sub: 'no hand-written SQL for ordinary reads and writes' });
  f.line(520, 420, 520, 450, { arrow: true });
  f.box(20, 450, 320, 80, brand.green, 'SQLite', { size: 14, bold: true, sub: 'development and tests' });
  f.box(360, 450, 320, 80, brand.green, 'SAP HANA Cloud', { size: 14, bold: true, sub: 'production' });
  f.box(700, 450, 320, 80, brand.green, 'PostgreSQL', { size: 14, bold: true, sub: 'a supported alternative' });
  f.write();
}

// 30. SAP Fiori elements: from annotated service to generated pages.
{
  const f = new Fig('sap-fiori-elements-annotation-flow.svg', 1040, 470,
    'SAP Fiori elements: annotations in a CAP or RAP service become the pages of an app',
    'A CAP model with UI annotations or an ABAP RAP service with metadata extensions is served as OData V4. The service metadata document carries the annotations. SAP Fiori elements reads that document in the browser and generates the pages: the list report with a filter bar and a table, the object page with header and sections, and further floorplans such as the worklist, the analytical list page and the overview page. The app itself holds only a manifest file that names the floorplans.');
  f.box(20, 20, 300, 96, brand.pink, 'CAP service', { size: 15, bold: true, sub: ['annotate ... with @(UI: {...})', 'in app/*.cds'] });
  f.box(20, 140, 300, 96, brand.violet, 'RAP service', { size: 15, bold: true, sub: ['@UI annotations in a', 'metadata extension (DDLX)'] });
  f.line(320, 68, 380, 130, { arrow: true });
  f.line(320, 188, 380, 160, { arrow: true });
  f.box(380, 100, 280, 76, brand.indigo, 'OData V4 service', { size: 15, bold: true, sub: '$metadata carries the annotations' });
  f.line(660, 138, 720, 138, { arrow: true });
  f.box(720, 90, 300, 96, brand.azure, 'SAP Fiori elements', { size: 15, bold: true, sub: ['reads $metadata in the browser', 'and builds the pages'] });
  f.line(870, 186, 870, 248);
  f.line(135, 248, 895, 248);
  [135, 385, 635, 895].forEach((x) => f.line(x, 248, x, 260, { arrow: true }));
  f.box(20, 260, 230, 90, brand.green, 'List report', { size: 14, bold: true, sub: ['filter bar and table', '@UI.LineItem'] });
  f.box(270, 260, 230, 90, brand.greenDeep, 'Object page', { size: 14, bold: true, sub: ['header and sections', '@UI.Facets'] });
  f.box(520, 260, 230, 90, brand.teal, 'Worklist', { size: 14, bold: true, sub: ['list report without', 'a filter bar'] });
  f.box(770, 260, 250, 90, brand.pink, 'Analytical list page', { size: 14, bold: true, sub: ['charts and table', 'with KPIs'] });
  f.box(20, 370, 480, 80, brand.violet, 'Overview page', { size: 14, bold: true, sub: ['role-based cards; documented in the', 'OData V2 part of the SAPUI5 docs'] });
  f.box(520, 370, 500, 80, brand.indigo, 'manifest.json', { size: 14, bold: true, sub: ['names the floorplans, the service and the', 'few settings the annotations cannot hold'] });
  f.write();
}

// 32. Fiori launchpad: how an intent reaches an app.
{
  const f = new Fig('sap-launchpad-intent-resolution.svg', 1040, 440,
    'How the SAP Fiori launchpad turns a tile click into a running app: tile, intent, target mapping, deployed app, with the role, space and manifest inbound that support each step',
    'A tile carries a semantic object and an action, for example ExpenseClaim and display. Together they form the intent ExpenseClaim-display. The launchpad resolves the intent through a target mapping, which sits in a catalog assigned to the role of the user, to the URL of the deployed app. A space and a page place the tile for the user. The inbound in the manifest.json of the app declares which intent the app can serve.');
  const xs = [20, 286, 552, 818], w = 202, y = 40, h = 100;
  f.box(xs[0], y, w, h, brand.pink, 'Tile', { size: 15, bold: true, sub: ['semantic object', 'and action'] });
  f.box(xs[1], y, w, h, brand.indigo, 'Intent', { size: 15, bold: true, sub: ['#ExpenseClaim-display', 'plus parameters'] });
  f.box(xs[2], y, w, h, brand.violet, 'Target mapping', { size: 15, bold: true, sub: ['intent to app', 'kept in a catalog'] });
  f.box(xs[3], y, w, h, brand.green, 'Deployed app', { size: 15, bold: true, sub: ['ABAP repository or', 'HTML5 repository'] });
  [0, 1, 2].forEach((i) => f.line(xs[i] + w, y + h / 2, xs[i + 1], y + h / 2, { arrow: true }));
  f.label(520, 28, 'At run time: the launchpad resolves the intent', { anchor: 'middle', size: 13, bold: true });
  const y2 = 250;
  f.box(xs[0], y2, w, h, brand.azure, 'Space and page', { size: 15, bold: true, sub: ['place the tile', 'for the user'] });
  f.box(xs[2], y2, w, h, brand.teal, 'Business role', { size: 15, bold: true, sub: ['receives the catalog', 'that holds the mapping'] });
  f.box(xs[3], y2, w, h, brand.greenDeep, 'Inbound in manifest.json', { size: 14, bold: true, sub: ['the intent the app', 'declares it can serve'] });
  f.line(xs[0] + w / 2, y2, xs[0] + w / 2, y + h, { arrow: true });
  f.line(xs[2] + w / 2, y2, xs[2] + w / 2, y + h, { arrow: true });
  f.line(xs[3] + w / 2, y2, xs[3] + w / 2, y + h, { arrow: true });
  f.label(150, 200, 'Set up by the administrator and the developer', { size: 13, bold: true });
  f.label(520, 400, 'The same intent can resolve to a different app for a different role, because the mapping travels in a catalog.', { anchor: 'middle', size: 13 });
  f.write();
}

// 38. Extensibility models: key user, developer and side-by-side, with the clean core they all stay outside of.
{
  const f = new Fig('sap-extensibility-models.svg', 1040, 420,
    'The three extensibility options of SAP S/4HANA Cloud Public Edition: key user and developer extensibility run in the S/4HANA stack, side-by-side extensibility runs on SAP BTP, and all of them reach the standard through released objects',
    'Two columns sit inside the SAP S/4HANA Cloud stack, key user extensibility for key users with released BAdIs and CDS views, and developer extensibility for ABAP developers with released BAdIs, classes, interfaces, CDS views and behavior definitions. A third column on SAP BTP holds side-by-side extensibility for developers, which uses released BAPIs, IDocs, OData APIs, SOAP APIs and events. All three reach the SAP standard only through released objects, shown as a bar at the bottom.');
  f.label(20, 28, 'Inside the SAP S/4HANA stack', { size: 13, bold: true });
  f.label(700, 28, 'On SAP BTP, next to the stack', { size: 13, bold: true });
  f.box(20, 44, 320, 220, brand.pink, 'Key user extensibility', { size: 15, bold: true, sub: ['Persona: key users', 'Low-code and no-code tools', 'Custom fields, forms, analytics', 'Released: BAdIs, CDS views'] });
  f.box(360, 44, 320, 220, brand.violet, 'Developer extensibility', { size: 15, bold: true, sub: ['Persona: ABAP developers', 'ABAP for Cloud Development', 'Custom apps and extensions', 'Released: BAdIs, classes, CDS views'] });
  f.box(700, 44, 320, 220, brand.green, 'Side-by-side extensibility', { size: 15, bold: true, sub: ['Persona: developers', 'ABAP, Java or Node.js', 'Loosely coupled apps', 'Released: OData APIs, events, BAPIs'] });
  f.line(180, 330, 180, 264, { arrow: true });
  f.line(520, 330, 520, 264, { arrow: true });
  f.line(860, 330, 860, 264, { arrow: true });
  f.box(20, 330, 1000, 70, brand.indigo, 'Released objects, extension points and APIs of the SAP standard', { size: 15, bold: true, sub: 'The core itself stays unmodified, so upgrades do not touch the extensions' });
  f.write();
}

// SAP HANA basics: what the HDI deployment does with design-time files.
{
  const f = new Fig('sap-hana-hdi-container.svg', 1040, 410,
    'How SAP HANA Deployment Infrastructure turns design-time files in a project into run-time objects inside an HDI container',
    'Design-time files such as a table, a view, a procedure and a calculation view sit in the db folder of the project. The deployer hands each file to the build plug-in for its file type. The plug-ins create the matching objects in the run-time container, which is one database schema named C, next to two helper schemas named C#DI and C#OO.');
  f.label(20, 28, 'Design time: files in the project', { size: 13, bold: true });
  f.label(560, 28, 'Run time: one HDI container in the database', { size: 13, bold: true });
  const files = [['.hdbtable', 'column table'], ['.hdbview', 'SQL view'], ['.hdbprocedure', 'SQLScript procedure'], ['.hdbcalculationview', 'graphical view']];
  files.forEach(([n, d], i) => f.box(20, 44 + i * 82, 230, 66, brand.violet, n, { size: 14, bold: true, sub: d }));
  f.box(300, 120, 190, 150, brand.indigo, 'Deployer', { size: 15, bold: true, sub: ['reads the files and', 'calls one build plug-in', 'per file type'] });
  files.forEach((_, i) => f.line(250, 77 + i * 82, 300, 195, { arrow: true }));
  f.box(560, 44, 460, 150, brand.green, 'Schema C', { size: 15, bold: true, sub: ['the deployed tables, views, procedures', 'and calculation views, owned by C#OO'] });
  f.box(560, 214, 220, 90, brand.azure, 'Schema C#DI', { size: 14, bold: true, sub: ['container management', 'API and internal data'] });
  f.box(800, 214, 220, 90, brand.teal, 'Schema C#OO', { size: 14, bold: true, sub: ['the object owner;', 'its own schema stays empty'] });
  f.line(490, 195, 560, 120, { arrow: true });
  f.label(520, 392, 'C stands for the container name. The files stay in the project; the container holds the deployed objects.', { anchor: 'middle', size: 13 });
  f.write();
}

// Finance: organizational units of accounting and their assignments.
{
  const f = new Fig('sap-finance-org-units.svg', 1040, 560,
    'The organizational units of Finance: company code, controlling area, profit center, cost center, segment and the legacy business area',
    'Inside a client, several company codes are assigned to one controlling area, each company code to exactly one. A controlling area holds many profit centers and many cost centers, and every one of them belongs to one controlling area. A profit center can carry a segment, and many profit centers can share one segment. A business area is optional and legacy; it can be derived from the cost center. Example Trading Co. has company code EX01 in controlling area EX00.');
  f.body.push(`  <rect x="20" y="20" width="1000" height="520" rx="14" fill="${brand.ink}" fill-opacity="0.08" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4"/>`);
  f.label(40, 46, 'Client: the units below are defined inside one client', { size: 15, bold: true });
  f.box(60, 80, 240, 76, brand.indigo, 'Company code', { size: 14, bold: true, sub: ['external accounting, own books', 'example: EX01'] });
  f.box(400, 80, 260, 76, brand.violet, 'Controlling area', { size: 14, bold: true, sub: ['management accounting', 'example: EX00'] });
  f.line(300, 118, 400, 118, { arrow: true });
  f.label(350, 108, 'n : 1', { anchor: 'middle' });
  f.box(760, 80, 240, 76, brand.ink, 'Business area', { size: 14, bold: true, sub: ['optional, legacy', 'external segment view'], opacity: 0.15 });
  f.box(240, 250, 260, 76, brand.green, 'Profit center', { size: 14, bold: true, sub: ['area of responsibility for results', 'belongs to one controlling area'] });
  f.box(640, 250, 260, 76, brand.teal, 'Cost center', { size: 14, bold: true, sub: ['place where costs occur', 'belongs to one controlling area'] });
  f.line(480, 156, 400, 250, { arrow: true });
  f.label(420, 196, '1 : n', { anchor: 'end' });
  f.line(580, 156, 700, 250, { arrow: true });
  f.label(660, 196, '1 : n');
  f.line(860, 250, 860, 156, { dash: true });
  f.label(872, 210, 'can be derived from', { size: 12 });
  f.label(872, 226, 'the cost center', { size: 12 });
  f.box(240, 410, 260, 76, brand.pink, 'Segment', { size: 14, bold: true, sub: ['division for external reporting', 'set in the profit center'] });
  f.line(370, 326, 370, 410, { arrow: true });
  f.label(382, 372, 'n : 1, optional', { size: 12 });
  f.box(640, 410, 360, 76, brand.azure, 'Example Trading Co.', { size: 14, bold: true, sub: ['EX01 (EUR, group currency GBP) in EX00', 'EX00 holds the profit and cost centers'], opacity: 0.2 });
  f.write();
}

// Finance: the three kinds of chart of accounts and how their accounts map to each other.
{
  const f = new Fig('sap-finance-chart-of-accounts-mapping.svg', 1080, 590,
    'The three charts of accounts of Example Trading Co. and how their accounts map to each other',
    'Company code EX01 is assigned to one operating chart of accounts, YCOA, which is required, and optionally to one country chart of accounts, YLOC. The operating chart can optionally name a group chart of accounts, YGRP. Each operating account can carry an alternative account number from the country chart and a group account number from the group chart. In the example the two sales revenue accounts of the operating chart share one group account, Revenue. Controlling area EX00 uses the operating chart of its company codes. All account numbers are illustrative.');
  const colX = [10, 390, 770];
  colX.forEach((x) => f.body.push(`  <rect x="${x}" y="100" width="300" height="300" rx="12" fill="${brand.ink}" fill-opacity="0.06" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4"/>`));
  f.box(10, 20, 300, 66, brand.pink, 'Country chart: YLOC', { size: 14, bold: true, sub: ['optional, one per company code', 'local legal reporting'] });
  f.box(390, 20, 300, 66, brand.indigo, 'Operating chart: YCOA', { size: 14, bold: true, sub: ['required, daily postings', 'used by Finance and Controlling'] });
  f.box(770, 20, 300, 66, brand.green, 'Group chart: YGRP', { size: 14, bold: true, sub: ['optional, named on the operating chart', 'group reporting and consolidation'] });
  f.line(690, 53, 770, 53, { arrow: true });
  f.label(730, 44, 'optional', { anchor: 'middle', size: 11 });
  const rows = [
    ['113100', 'Bank account', 'L-510', 'Bank', 'G-1100', 'Cash and bank'],
    ['400000', 'Sales revenue, domestic', 'L-701', 'Sales, home market', null, null],
    ['400100', 'Sales revenue, export', 'L-702', 'Sales, abroad', null, null],
    ['600000', 'Cost of goods sold', 'L-601', 'Cost of sales', 'G-6000', 'Cost of sales'],
  ];
  rows.forEach(([oa, on, la, ln, ga, gn], i) => {
    const y = 116 + i * 70;
    f.box(400, y, 280, 52, brand.indigo, `${oa} ${on}`, { size: 13, opacity: 0.2 });
    f.box(20, y, 280, 52, brand.pink, `${la} ${ln}`, { size: 13, opacity: 0.2 });
    f.line(400, y + 26, 300, y + 26, { arrow: true });
    if (ga) {
      f.box(780, y, 280, 52, brand.green, `${ga} ${gn}`, { size: 13, opacity: 0.2 });
      f.line(680, y + 26, 780, y + 26, { arrow: true });
    }
  });
  f.box(780, 221, 280, 52, brand.green, 'G-4000 Revenue', { size: 13, opacity: 0.2 });
  f.line(680, 212, 780, 240, { arrow: true });
  f.line(680, 282, 780, 254, { arrow: true });
  f.label(350, 112, 'alternative', { anchor: 'middle', size: 11 });
  f.label(350, 124, 'account no.', { anchor: 'middle', size: 11 });
  f.label(730, 112, 'group', { anchor: 'middle', size: 11 });
  f.label(730, 124, 'account no.', { anchor: 'middle', size: 11 });
  f.box(290, 450, 500, 74, brand.azure, 'Company code EX01', { size: 14, bold: true, sub: ['EUR, group currency GBP, ledgers 0L and 2L', 'assigned to YCOA (required) and YLOC (optional)'], opacity: 0.25 });
  f.line(540, 450, 540, 400, { arrow: true });
  f.line(330, 450, 170, 400, { arrow: true, dash: true });
  f.label(220, 436, 'optional', { anchor: 'middle', size: 11 });
  f.box(820, 450, 250, 74, brand.violet, 'Controlling area EX00', { size: 14, bold: true, sub: ['uses the operating chart', 'of its company codes'], opacity: 0.25 });
  f.line(900, 450, 640, 400, { arrow: true });
  f.label(540, 560, 'Chart keys and account numbers are illustrative values for this site, not SAP content.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: the Universal Journal table ACDOCA, its neighbours and the tables it absorbed (greyed out).
{
  const f = new Fig('sap-finance-universal-journal.svg', 1080, 600,
    'The Universal Journal table ACDOCA, the tables it kept beside it and the tables it absorbed',
    'The journal entry header table BKPF and the table BSEG stay in SAP S/4HANA: BKPF holds one header per journal entry and BSEG holds the source documents and the open item entries. The line item table ACDOCA holds the lines of every journal entry for all ledgers, with the G/L account, the Controlling account assignments and up to ten currency fields in one row. Greyed out on the right are the tables whose entries are now completely contained in ACDOCA: FAGLFLEXA and FAGLFLEXT of new General Ledger Accounting, the actual data of the Controlling tables COEP, COSS and COSP, the Material Ledger table MLIT and the Asset Accounting table ANEP. The released CDS view I_JournalEntryItem reads ACDOCA, and the coding block structure CI_COBL extends it with custom fields.');
  const grey = (x, y, w, h, l1, l2) => {
    f.body.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${brand.ink}" fill-opacity="0.08" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="6 4"/>`);
    f.fitCheck(l1, 13, 700, w - 16);
    f.fitCheck(l2, 11, 400, w - 16);
    f.body.push(`  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" font-size="13" font-weight="bold" fill-opacity="0.65">${esc(l1)}</text>`);
    f.body.push(`  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" font-size="11" fill-opacity="0.65">${esc(l2)}</text>`);
  };
  // Left: tables that stay.
  f.box(20, 50, 270, 100, brand.pink, 'BKPF', { size: 15, bold: true, sub: ['journal entry header', 'one per journal entry'] });
  f.box(20, 210, 270, 110, brand.pink, 'BSEG', { size: 15, bold: true, sub: ['source documents and', 'open item entries'] });
  f.line(155, 210, 155, 150, { arrow: true });
  f.label(167, 186, '1 : n', { size: 12 });
  f.label(20, 340, 'Both tables stay in SAP S/4HANA.', { size: 12 });
  // Centre: ACDOCA.
  f.box(370, 50, 340, 270, brand.indigo, 'ACDOCA', { size: 18, bold: true, opacity: 0.4, sub: ['Universal Journal: one row per', 'journal entry line, all ledgers', '', 'key fields run from RCLNT to DOCLN', 'ledger, company code, G/L account,', 'cost center, profit center, segment', 'in one row, with no FI and CO split', 'up to 10 currency fields: EUR, GBP, ...'] });
  f.line(290, 100, 370, 130, { arrow: true });
  f.label(300, 94, 'header of', { size: 11 });
  f.line(290, 265, 370, 255, { dash: true, arrow: true });
  f.label(298, 296, 'basis for', { size: 11 });
  // Right: absorbed tables, greyed out.
  f.label(790, 40, 'Absorbed: now completely in ACDOCA', { size: 13, bold: true });
  grey(790, 52, 270, 62, 'FAGLFLEXA, FAGLFLEXT', 'new General Ledger Accounting');
  grey(790, 130, 270, 62, 'COEP, COSS, COSP', 'Controlling actual data');
  grey(790, 208, 270, 62, 'MLIT', 'Material Ledger');
  grey(790, 286, 270, 62, 'ANEP', 'Asset Accounting line items');
  [83, 161, 239, 317].forEach((y) => f.line(790, y, 710, 185, { dash: true, arrow: true }));
  f.label(790, 374, 'Statistical postings and target data stay in', { size: 11 });
  f.label(790, 388, 'COEP, COSS and COSP. The list is not exhaustive.', { size: 11 });
  // Bottom: CDS view and extensibility.
  f.line(450, 320, 450, 420, { arrow: true });
  f.label(462, 376, 'is read by', { size: 11 });
  f.box(300, 420, 300, 80, brand.azure, 'I_JournalEntryItem', { size: 14, bold: true, sub: ['released CDS view (cube)', 'on ACDOCA, for apps and reports'] });
  f.line(640, 420, 640, 320, { arrow: true });
  f.label(652, 376, 'extends', { size: 11 });
  f.box(640, 420, 420, 80, brand.violet, 'CI_COBL coding block, OXK3', { size: 14, bold: true, sub: ['custom fields in journal entries;', 'also the Custom Fields app for key users'] });
  f.label(540, 560, 'The currencies EUR and GBP and the ledgers of company code EX01 are the running example of this site.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: accounts payable, procure-to-pay T-accounts (goods receipt, supplier invoice, payment, bank statement).
{
  const f = new Fig('sap-finance-procure-to-pay-t-accounts.svg', 1080, 420,
    'Procure-to-pay in T-accounts: goods receipt, supplier invoice, payment and bank statement for company code EX01',
    'Seven T-accounts show four postings in euro. Step 1, the goods receipt of 100 pieces at 12.00, debits Stock and credits GR/IR clearing with 1,200.00. Step 2, the supplier invoice, debits GR/IR clearing with 1,200.00 and Input tax with 228.00 and credits the supplier account with 1,428.00. Step 3, payment within the discount period, debits the supplier account with 1,428.00 and credits Bank clearing with 1,399.44 and Cash discount gain with 28.56. Step 4, the bank statement, debits Bank clearing and credits Bank with 1,399.44. At the end GR/IR clearing, the supplier account and Bank clearing are zero.');
  const tAcc = (x, y, w, h, colour, title, debits, credits, balance) => {
    f.body.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${colour}" fill-opacity="0.22" stroke="currentColor" stroke-width="1.5"/>`);
    f.fitCheck(title, 13, 700, w - 16);
    f.body.push(`  <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="13" font-weight="bold">${esc(title)}</text>`);
    f.line(x + 10, y + 32, x + w - 10, y + 32);
    f.line(x + w / 2, y + 32, x + w / 2, y + h - 34);
    f.label(x + w / 2 - 8, y + 48, 'Debit', { anchor: 'end', size: 11 });
    f.label(x + w / 2 + 8, y + 48, 'Credit', { size: 11 });
    debits.forEach((t, i) => { f.fitCheck(t, 12, 400, w / 2 - 14); f.label(x + w / 2 - 8, y + 68 + i * 18, t, { anchor: 'end' }); });
    credits.forEach((t, i) => { f.fitCheck(t, 12, 400, w / 2 - 14); f.label(x + w / 2 + 8, y + 68 + i * 18, t); });
    f.fitCheck(balance, 12, 700, w - 16);
    f.body.push(`  <text x="${x + w / 2}" y="${y + h - 12}" text-anchor="middle" font-size="12" font-weight="bold">${esc(balance)}</text>`);
  };
  const w = 238, h = 140, gx = 16;
  const x = (i) => 14 + i * (w + gx);
  tAcc(x(0), 20, w, h, brand.greenDeep, 'Stock', ['(1) 1,200.00'], [], 'Balance 1,200.00 debit');
  tAcc(x(1), 20, w, h, brand.indigo, 'GR/IR clearing', ['(2) 1,200.00'], ['(1) 1,200.00'], 'Balance 0.00');
  tAcc(x(2), 20, w, h, brand.pink, 'Input tax', ['(2) 228.00'], [], 'Balance 228.00 debit');
  tAcc(x(3), 20, w, h, brand.violet, 'Supplier account', ['(3) 1,428.00'], ['(2) 1,428.00'], 'Balance 0.00');
  tAcc(x(0), 190, w, h, brand.teal, 'Bank clearing', ['(4) 1,399.44'], ['(3) 1,399.44'], 'Balance 0.00');
  tAcc(x(1), 190, w, h, brand.azure, 'Bank', [], ['(4) 1,399.44'], 'Balance 1,399.44 credit');
  tAcc(x(2), 190, w, h, brand.green, 'Cash discount gain', [], ['(3) 28.56'], 'Balance 28.56 credit');
  f.box(x(3), 190, w, h, brand.indigo, 'The four steps', { size: 13, bold: true, opacity: 0.12, sub: ['(1) goods receipt, 100 x 12.00', '(2) supplier invoice, 19 percent tax', '(3) payment, 2 percent discount', '(4) bank statement'] });
  f.label(540, 364, 'Each posting balances: step 1 1,200.00; step 2 1,200.00 + 228.00 = 1,428.00; step 3 1,399.44 + 28.56 = 1,428.00; step 4 1,399.44.', { anchor: 'middle', size: 12 });
  f.label(540, 392, 'All amounts are made up. Tax and discount rates are illustrative, and each line is written to ledgers 0L and 2L.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: order-to-cash T-accounts (goods issue, billing, incoming payment) for Example Trading Co.
{
  const f = new Fig('sap-finance-order-to-cash-t-accounts.svg', 1080, 500,
    'Order-to-cash as T-accounts: goods issue, customer invoice and incoming payment',
    'Three postings of company code EX01, all in euro. Step 1, goods issue: cost of goods sold is debited and inventory is credited with 6,000.00. Step 2, customer invoice: the customer account (a reconciliation account) is debited with 11,900.00, revenue is credited with 10,000.00 and output tax with 1,900.00. Step 3, incoming payment: the bank account is debited and the customer account is credited with 11,900.00, so the customer items add up to zero and are cleared. Amounts and the 19 percent tax rate are made up.');
  const tAccount = (x, y, name, side, amount) => {
    const w = 150, h = 110;
    f.fitCheck(name, 13, 700, w - 12);
    f.body.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${brand.ink}" fill-opacity="0.05" stroke="currentColor" stroke-width="1.2"/>`);
    f.body.push(`  <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="13" font-weight="bold">${esc(name)}</text>`);
    f.line(x, y + 26, x + w, y + 26);
    f.line(x + w / 2, y + 26, x + w / 2, y + h);
    f.label(x + w / 4, y + 41, 'Debit', { anchor: 'middle', size: 10 });
    f.label(x + 3 * w / 4, y + 41, 'Credit', { anchor: 'middle', size: 10 });
    const cx = side === 'D' ? x + w / 4 : x + 3 * w / 4;
    f.label(cx, y + 72, amount, { anchor: 'middle', size: 13, bold: true });
  };
  const panels = [
    [10, '1 Goods issue', brand.teal, 'inventory value leaves'],
    [370, '2 Customer invoice', brand.indigo, 'billing posts to Finance'],
    [730, '3 Incoming payment', brand.green, 'bank statement or manual'],
  ];
  panels.forEach(([x, t, c, s]) => f.box(x, 16, 340, 58, c, t, { size: 15, bold: true, sub: s }));
  tAccount(20, 96, 'Cost of goods sold', 'D', '6,000.00');
  tAccount(190, 96, 'Inventory', 'C', '6,000.00');
  tAccount(380, 96, 'Customer', 'D', '11,900.00');
  tAccount(550, 96, 'Revenue', 'C', '10,000.00');
  tAccount(380, 226, 'Output tax', 'C', '1,900.00');
  tAccount(740, 96, 'Bank', 'D', '11,900.00');
  tAccount(910, 96, 'Customer', 'C', '11,900.00');
  f.label(550, 250, 'Customer: reconciliation', { size: 11 });
  f.label(550, 266, 'account of the customer.', { size: 11 });
  f.label(20, 240, 'Needs a goods issue posted', { size: 11 });
  f.label(20, 256, 'for the outbound delivery.', { size: 11 });
  f.label(740, 240, 'Clears the invoice item: the two', { size: 11 });
  f.label(740, 256, 'customer items add up to zero.', { size: 11 });
  f.box(10, 350, 1060, 96, brand.violet, 'Customer account over time', { size: 14, bold: true, opacity: 0.2, sub: ['after step 2: open item, debit 11,900.00', 'after step 3: both items cleared, balance 0.00', 'gross margin: 10,000.00 revenue - 6,000.00 cost of goods sold = 4,000.00'] });
  f.label(540, 478, 'All amounts and the 19 percent tax rate are made up. Each line is written to ledgers 0L and 2L of company code EX01.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: payment terms timeline (3 percent in 10 days, 2 percent in 20 days, net 30) for Example Trading Co.
{
  const f = new Fig('sap-finance-payment-terms-timeline.svg', 1080, 330,
    'Payment terms on a timeline: baseline date, two cash discount periods and the net due date',
    'A timeline that starts at the baseline date, 2026-05-04, day 0. From day 0 to day 10 (2026-05-14) a 3 percent cash discount applies, so a gross invoice of 5,950.00 is paid with 5,771.50. From day 10 to day 20 (2026-05-24) a 2 percent discount applies and the payment is 5,831.00. From day 20 to day 30 (2026-06-03) no discount applies and the payment is the full 5,950.00. After day 30 the item is overdue. All amounts and the dates are made up for company code EX01.');
  const x0 = 60, px = 30, y = 120;
  const X = (d) => x0 + d * px;
  f.label(540, 28, 'Terms 3 percent within 10 days, 2 percent within 20 days, net 30 days, counted from the baseline date', { anchor: 'middle', size: 14, bold: true });
  f.box(X(0), y - 50, 10 * px, 90, brand.green, 'Discount period 1', { size: 13, bold: true, sub: ['3 percent', 'pay 5,771.50'] });
  f.box(X(10), y - 50, 10 * px, 90, brand.teal, 'Discount period 2', { size: 13, bold: true, sub: ['2 percent', 'pay 5,831.00'] });
  f.box(X(20), y - 50, 10 * px, 90, brand.indigo, 'Net period', { size: 13, bold: true, sub: ['no discount', 'pay 5,950.00'] });
  f.box(X(30), y - 50, 3 * px, 90, brand.pink, 'Overdue', { size: 13, bold: true, sub: ['days in', 'arrears'], opacity: 0.2 });
  f.line(x0, y + 60, X(33) + 10, y + 60, { arrow: true });
  [[0, 'Day 0', '2026-05-04', 'baseline date'], [10, 'Day 10', '2026-05-14', 'discount 1 ends'], [20, 'Day 20', '2026-05-24', 'discount 2 ends'], [30, 'Day 30', '2026-06-03', 'net due date']].forEach(([d, a, b, c]) => {
    f.line(X(d), y + 54, X(d), y + 66);
    f.label(X(d), y + 86, a, { anchor: 'middle', size: 13, bold: true });
    f.label(X(d), y + 104, b, { anchor: 'middle', size: 12 });
    f.label(X(d), y + 122, c, { anchor: 'middle', size: 12 });
  });
  f.label(540, y + 168, 'Gross invoice 5,950.00 (net 5,000.00 plus 19 percent tax 950.00), discount base gross: 5,950.00 x 0.97 = 5,771.50 and 5,950.00 x 0.98 = 5,831.00.', { anchor: 'middle', size: 12 });
  f.label(540, y + 190, 'Which base the discount uses is a company code setting. All amounts and dates are made up.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: special G/L transactions, supplier down payment and its clearing as T-accounts.
{
  const f = new Fig('sap-finance-special-gl-down-payment-t-accounts.svg', 1080, 450,
    'A supplier down payment and its clearing as T-accounts for company code EX01',
    'Seven T-accounts show the postings in euro. Step 2, the down payment of 11,900.00 including 1,900.00 tax, debits the special G/L account for down payments made and credits Bank, and posts 1,900.00 to Input tax (debit) and Input tax clearing (credit). Step 3, the final invoice of 35,700.00, debits Expense with 30,000.00 and Input tax with 5,700.00 and credits the supplier account with 35,700.00. Step 4, the transfer posting of the down payment, credits the special G/L account and debits the supplier account with 11,900.00 and corrects the tax: Input tax is credited and Input tax clearing is debited with 1,900.00. Step 5, payment of the balance, debits the supplier account and credits Bank with 23,800.00. At the end the special G/L account, the supplier account and Input tax clearing are zero.');
  const tAcc = (x, y, w, h, colour, title, debits, credits, balance) => {
    f.body.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${colour}" fill-opacity="0.22" stroke="currentColor" stroke-width="1.5"/>`);
    f.fitCheck(title, 13, 700, w - 16);
    f.body.push(`  <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="13" font-weight="bold">${esc(title)}</text>`);
    f.line(x + 10, y + 32, x + w - 10, y + 32);
    f.line(x + w / 2, y + 32, x + w / 2, y + h - 34);
    f.label(x + w / 2 - 8, y + 48, 'Debit', { anchor: 'end', size: 11 });
    f.label(x + w / 2 + 8, y + 48, 'Credit', { size: 11 });
    debits.forEach((t, i) => { f.fitCheck(t, 12, 400, w / 2 - 14); f.label(x + w / 2 - 8, y + 68 + i * 18, t, { anchor: 'end' }); });
    credits.forEach((t, i) => { f.fitCheck(t, 12, 400, w / 2 - 14); f.label(x + w / 2 + 8, y + 68 + i * 18, t); });
    f.fitCheck(balance, 12, 700, w - 16);
    f.body.push(`  <text x="${x + w / 2}" y="${y + h - 12}" text-anchor="middle" font-size="12" font-weight="bold">${esc(balance)}</text>`);
  };
  const w = 238, h = 160, gx = 16;
  const x = (i) => 14 + i * (w + gx);
  tAcc(x(0), 20, w, h, brand.azure, 'Bank', [], ['(2) 11,900.00', '(5) 23,800.00'], 'Balance 35,700.00 credit');
  tAcc(x(1), 20, w, h, brand.indigo, 'Down payments made (A)', ['(2) 11,900.00'], ['(4) 11,900.00'], 'Balance 0.00');
  tAcc(x(2), 20, w, h, brand.violet, 'Supplier account', ['(4) 11,900.00', '(5) 23,800.00'], ['(3) 35,700.00'], 'Balance 0.00');
  tAcc(x(3), 20, w, h, brand.greenDeep, 'Expense', ['(3) 30,000.00'], [], 'Balance 30,000.00 debit');
  tAcc(x(0), 200, w, h, brand.pink, 'Input tax', ['(2) 1,900.00', '(3) 5,700.00'], ['(4) 1,900.00'], 'Balance 5,700.00 debit');
  tAcc(x(1), 200, w, h, brand.teal, 'Input tax clearing', ['(4) 1,900.00'], ['(2) 1,900.00'], 'Balance 0.00');
  f.box(x(2), 200, 2 * w + gx, h, brand.indigo, 'The five steps', { size: 13, bold: true, opacity: 0.12, sub: ['(1) down payment request: noted item, no posting to the balances', '(2) down payment paid, gross display with 19 percent tax', '(3) final invoice, 30,000.00 net plus 5,700.00 tax', '(4) transfer posting of the down payment, tax corrected', '(5) payment of the balance, 35,700.00 - 11,900.00'] });
  f.label(540, 392, 'Each posting balances: step 2 11,900.00 + 1,900.00 = 11,900.00 + 1,900.00; step 3 30,000.00 + 5,700.00 = 35,700.00; step 4 11,900.00 + 1,900.00 = 11,900.00 + 1,900.00; step 5 23,800.00.', { anchor: 'middle', size: 11 });
  f.label(540, 420, 'All amounts and the tax rate are made up. Each line is written to ledgers 0L and 2L of company code EX01.', { anchor: 'middle', size: 12 });
  f.write();
}

// Finance: bank statement processing, from the four ways in to the posting phase and the manual fallback.
{
  const f = new Fig('sap-finance-bank-statement-processing.svg', 1080, 400,
    'How the system processes a bank statement',
    'Four ways bring a bank statement into the system: SAP Multi-Bank Connectivity, the Manage Incoming Payment Files app, the Bank Statement - Post API and manual entry in the Manage Bank Statements app. The system saves the statement. After posting is triggered, the first processing phase applies posting rules and interpretation algorithms and saves matching open items as clearing proposals. The second phase looks for exactly one matching processing rule per item. The posting phase performs the actions of the processing rule, or uses the proposals of the first phase, and posts and clears the items. Items without any match stop the automatic processing and are handled in the Reprocess Bank Statement Items app.');
  const ways = ['SAP Multi-Bank Connectivity', 'Manage Incoming Payment Files', 'Bank Statement - Post API', ['Manual entry in', 'Manage Bank Statements']];
  f.label(120, 22, 'Ways in', { anchor: 'middle', size: 13, bold: true });
  ways.forEach((t, i) => f.box(10, 34 + i * 62, 220, 50, brand.azure, t, { size: 12 }));
  f.box(290, 100, 150, 100, brand.indigo, 'Bank statement', { size: 13, bold: true, sub: ['saved with its items'] });
  ways.forEach((t, i) => f.line(230, 59 + i * 62, 290, 150, { arrow: true }));
  f.label(765, 22, 'After posting is triggered', { anchor: 'middle', size: 13, bold: true });
  f.box(500, 34, 200, 80, brand.violet, '1 First phase', { size: 13, bold: true, sub: ['posting rules and', 'interpretation algorithms'] });
  f.box(745, 34, 150, 80, brand.pink, '2 Second phase', { size: 13, bold: true, sub: ['one matching', 'processing rule'] });
  f.box(920, 34, 150, 80, brand.greenDeep, '3 Posting phase', { size: 13, bold: true, sub: ['post and clear', 'the items'] });
  f.line(440, 150, 470, 150);
  f.line(470, 150, 470, 74);
  f.line(470, 74, 500, 74, { arrow: true });
  f.line(700, 74, 745, 74, { arrow: true });
  f.line(895, 74, 920, 74, { arrow: true });
  f.box(560, 170, 335, 70, brand.teal, 'Clearing proposals from phase 1', { size: 12, bold: true, sub: ['used when no processing rule applies'], opacity: 0.2 });
  f.line(640, 114, 640, 170, { arrow: true, dash: true });
  f.line(895, 205, 995, 205, { dash: true });
  f.line(995, 205, 995, 114, { arrow: true, dash: true });
  f.box(500, 275, 395, 85, brand.indigo, 'No matching open item', { size: 12, bold: true, sub: ['an item without any match in phase 1 stops the', 'automatic processing; handle it by hand in', 'Reprocess Bank Statement Items'], opacity: 0.12 });
  f.line(520, 114, 520, 275, { arrow: true, dash: true });
  f.label(540, 385, 'Order of the phases as described in SAP Help. Names of the ways in and of the apps are those of SAP S/4HANA 2025 FPS02 and the Public Edition 2608.', { anchor: 'middle', size: 11 });
  f.write();
}

// Finance: cost element categories of primary and secondary cost elements (Controlling overview page).
{
  const f = new Fig('sap-finance-cost-element-categories.svg', 1080, 560,
    'A G/L account becomes a cost element through its account type and its cost element category',
    'A G/L account of the chart of accounts has an account type. Accounts of type primary costs or revenue are posted directly by entering the account, and their cost element category is 01 primary costs or cost-reducing revenues, 03 or 04 accrual and deferral, 11 revenues, 12 sales deduction or 22 external settlement. Accounts of type secondary costs are filled by the system during allocation and settlement, and their category is 21 internal settlement, 31 results analysis, 41 overhead rates, 42 assessment, 43 internal activity allocation, 50 to 52 project-related incoming orders, 61 earned value or 66 reporting cost elements for profitability analysis. The category is stored for the controlling area, here EX00. The example accounts are illustrative: a rent account in category 01 and the account 940000 in category 42.');
  f.box(300, 16, 480, 70, brand.indigo, 'G/L account in the chart of accounts', { size: 14, bold: true, sub: ['account type, then the cost element category', 'kept for the controlling area, for example EX00'] });
  f.line(420, 86, 270, 140, { arrow: true });
  f.line(660, 86, 810, 140, { arrow: true });
  f.box(20, 140, 500, 64, brand.green, 'Primary costs or revenue', { size: 14, bold: true, sub: ['posted directly: you name the account, in FI or MM', 'needs a CO account assignment such as a cost center'] });
  f.box(560, 140, 500, 64, brand.violet, 'Secondary costs', { size: 14, bold: true, sub: ['posted indirectly: the system determines the account', 'filled by allocation, assessment and settlement'] });
  const prim = ['01  Primary costs / cost-reducing revenues', '03  Accrual/deferral per surcharge', '04  Accrual/deferral per debit = actual', '11  Revenues', '12  Sales deduction', '22  External settlement'];
  const sec = ['21  Internal settlement', '31  Order/project results analysis', '41  Overhead rates', '42  Assessment', '43  Internal activity allocation', '50-52  Project-related incoming orders', '61  Earned value', '66  Reporting cost elements, CO-PA'];
  f.body.push(`  <rect x="20" y="224" width="500" height="${prim.length * 24 + 24}" rx="10" fill="${brand.green}" fill-opacity="0.14" stroke="currentColor" stroke-width="1.5"/>`);
  prim.forEach((t, i) => { f.fitCheck(t, 13, 400, 470); f.label(40, 254 + i * 24, t, { size: 13 }); });
  f.body.push(`  <rect x="560" y="224" width="500" height="${sec.length * 24 + 24}" rx="10" fill="${brand.violet}" fill-opacity="0.14" stroke="currentColor" stroke-width="1.5"/>`);
  sec.forEach((t, i) => { f.fitCheck(t, 13, 400, 470); f.label(580, 254 + i * 24, t, { size: 13 }); });
  f.line(270, 204, 270, 224, { arrow: true });
  f.line(810, 204, 810, 224, { arrow: true });
  f.box(20, 424, 500, 56, brand.teal, 'Example in EX00 (illustrative)', { size: 13, bold: true, sub: ['rent account, category 01, posted on cost center EX-ADM'], opacity: 0.2 });
  f.box(560, 456, 500, 56, brand.teal, 'Example in EX00 (illustrative)', { size: 13, bold: true, sub: ['940000 IT costs allocated, category 42, set by assessment'], opacity: 0.2 });
  f.label(540, 544, 'Categories 03, 04 and 31 appear on the on-premise page; the Public Edition page lists the other categories.', { anchor: 'middle', size: 11 });
  f.write();
}

// Finance: one allocation, from the sender through the rules to the receivers (Allocations page).
{
  const f = new Fig('sap-finance-allocation-flow.svg', 1080, 470,
    'One allocation: a sender cost center passes 1,000.00 EUR to three receiver cost centers by floor area',
    'The sender, the collector cost center EX-RENT of controlling area EX00, holds a posted rent of 1,000.00 EUR. The sender rule Posted amounts with a sender share of 100 percent releases all of it. The receiver rule Variable portions uses the statistical key figure floor area as tracing factor: EX-ADM has 120 square meters, EX-SALES 180 and EX-PROD 300, 600 in total. Each receiver gets the sender amount times its factor divided by the sum of the factors: 200.00, 300.00 and 500.00 EUR, which add up to 1,000.00 EUR. Below, two boxes compare the two allocation types: distribution keeps the original rent account on the receivers, and overhead allocation posts to one secondary account with cost element category 42, so the receivers no longer see the original account.');
  f.box(20, 120, 230, 110, brand.indigo, 'Sender: EX-RENT', { size: 14, bold: true, sub: ['rent posted: 1,000.00 EUR', 'sender rule: Posted amounts', 'sender share: 100 %'] });
  f.box(330, 20, 230, 70, brand.violet, 'Receiver rule', { size: 14, bold: true, sub: ['Variable portions', 'reference: floor area (SKF)'], opacity: 0.2 });
  f.line(250, 160, 300, 160);
  f.line(300, 160, 300, 55);
  f.line(300, 55, 330, 55, { arrow: true });
  const rec = [['EX-ADM', '120 m2', '200.00 EUR'], ['EX-SALES', '180 m2', '300.00 EUR'], ['EX-PROD', '300 m2', '500.00 EUR']];
  rec.forEach(([n, a, c], i) => {
    const y = 110 + i * 84;
    f.line(250, 175, 640, y + 33, { arrow: true });
    f.box(640, y, 220, 66, brand.green, n, { size: 14, bold: true, sub: [`factor ${a}`, `receives ${c}`] });
  });
  f.label(445, 112, '1,000.00 x factor / 600', { anchor: 'middle', size: 12 });
  f.box(890, 110, 170, 234, brand.teal, 'Check', { size: 14, bold: true, opacity: 0.2, sub: ['200.00', '+ 300.00', '+ 500.00', '= 1,000.00 EUR', '', 'sender credited', 'with the same sum'] });
  f.box(20, 372, 520, 72, brand.pink, 'Distribution', { size: 13, bold: true, sub: ['receivers see the original rent account:', 'the composition of the cost stays visible'], opacity: 0.2 });
  f.box(560, 372, 500, 72, brand.azure, 'Overhead allocation', { size: 13, bold: true, sub: ['receivers see one secondary account, category 42:', 'the original accounts are not visible'], opacity: 0.2 });
  f.label(540, 462, 'All names and amounts are made up for the running example (controlling area EX00, company code EX01).', { anchor: 'middle', size: 11 });
  f.write();
}

// Human Resources: time constraints as validity bars on one time axis (Time Constraints and Validity Periods page).
{
  const f = new Fig('sap-hr-time-constraints.svg', 1080, 560,
    'Validity periods of records under time constraints 1, 2, 3, A or B and T, drawn as bars on one time axis',
    'A time axis runs from 01.01.2024 to 01.01.2028. Time constraint 1: the Organizational Assignment (0001) records of Ana Torres, 01.03.2024 to 30.06.2026 and 01.07.2026 to 31.12.9999, follow each other with no gap and no overlap. Time constraint 2: at most one record at a time, so records may leave gaps but never overlap; the bars are example values. Time constraint 3: any number of records at the same time, so two powers of attorney, 01.01.2025 to 31.12.2025 and 01.06.2025 to 31.12.9999, overlap; the dates are example values. Time constraints A and B: one record only, valid from 01.01.1800 to 31.12.9999, which cannot be split. Time constraint T: the constraint depends on the subtype, so a main address with no gap and a temporary residence record that exists only for a while can coexist. All dates are invented example values.');
  const x0 = 250, W = 790;
  const start = Date.UTC(2024, 0, 1), end = Date.UTC(2028, 0, 1);
  const X = (y, m, d) => Math.round(x0 + ((Date.UTC(y, m - 1, d) - start) / (end - start)) * W);
  const bar = (x1, x2, y, h, colour, text, { openLeft = false, openRight = false } = {}) => {
    const w = x2 - x1;
    f.body.push(`  <rect x="${x1}" y="${y}" width="${w}" height="${h}" rx="6" fill="${colour}" fill-opacity="0.4" stroke="currentColor" stroke-width="1.5"/>`);
    const lines = Array.isArray(text) ? text : [text];
    const fs = lines.length > 1 ? 11 : 12;
    lines.forEach((t, i) => {
      f.fitCheck(t, fs, 400, w - 14 - (openRight ? 14 : 0) - (openLeft ? 14 : 0));
      f.body.push(`  <text x="${x1 + w / 2}" y="${y + h / 2 + 4 + (i - (lines.length - 1) / 2) * 14}" text-anchor="middle" font-size="${fs}">${esc(t)}</text>`);
    });
    if (openRight) f.body.push(`  <path d="M${x2 - 12} ${y + h / 2 - 5} L${x2 - 5} ${y + h / 2} L${x2 - 12} ${y + h / 2 + 5}" fill="none" stroke="currentColor" stroke-width="1.5"/>`);
    if (openLeft) f.body.push(`  <path d="M${x1 + 12} ${y + h / 2 - 5} L${x1 + 5} ${y + h / 2} L${x1 + 12} ${y + h / 2 + 5}" fill="none" stroke="currentColor" stroke-width="1.5"/>`);
  };
  const rowBox = (y, h, colour, title, sub) => f.box(10, y, 225, h, colour, title, { size: 13, bold: true, sub, opacity: 0.25 });
  // time axis
  f.label(10, 32, 'Dates on the axis', { size: 12, bold: true });
  [2024, 2025, 2026, 2027, 2028].forEach((yr) => {
    const x = X(yr, 1, 1);
    f.line(x, 40, x, 534, { dash: true });
    f.label(x, 32, `01.01.${yr}`, { anchor: yr === 2028 ? 'end' : 'middle', size: 12 });
  });
  // time constraint 1
  rowBox(50, 70, brand.indigo, 'Time constraint 1', ['Organizational Assignment (0001)', 'of Ana Torres']);
  bar(X(2024, 3, 1), X(2026, 7, 1), 60, 28, brand.indigo, '01.03.2024 - 30.06.2026');
  bar(X(2026, 7, 1), x0 + W, 60, 28, brand.indigo, '01.07.2026 - 31.12.9999', { openRight: true });
  f.label(x0 + 10, 112, 'no gap and no overlap: one record is valid on every day from the hiring', { size: 11 });
  // time constraint 2
  rowBox(130, 70, brand.violet, 'Time constraint 2', ['at most one record at a time', 'example values']);
  bar(X(2024, 6, 1), X(2025, 1, 1), 136, 34, brand.violet, ['01.06.2024', '31.12.2024']);
  bar(X(2025, 4, 1), X(2025, 10, 1), 136, 34, brand.violet, ['01.04.2025', '30.09.2025']);
  f.label(X(2025, 1, 1) + 6, 157, 'gap allowed', { size: 11 });
  f.label(x0 + 10, 192, 'gaps are allowed, overlaps are not', { size: 11 });
  // time constraint 3
  rowBox(210, 90, brand.pink, 'Time constraint 3', ['any number of records at once', 'Powers of Attorney (0030)']);
  bar(X(2025, 1, 1), X(2026, 1, 1), 220, 24, brand.pink, '01.01.2025 - 31.12.2025');
  bar(X(2025, 6, 1), x0 + W, 250, 24, brand.pink, '01.06.2025 - 31.12.9999', { openRight: true });
  f.label(x0 + 10, 292, 'overlaps are allowed, and no record has to exist (example dates)', { size: 11 });
  // time constraints A and B
  rowBox(310, 70, brand.greenDeep, 'Time constraints A and B', ['one record in total', 'B can be deleted, A cannot']);
  bar(x0, x0 + W, 320, 28, brand.greenDeep, '01.01.1800 - 31.12.9999, cannot be split', { openLeft: true, openRight: true });
  f.label(x0 + 10, 372, 'the system sets this validity itself', { size: 11 });
  // time constraint T
  rowBox(390, 130, brand.teal, 'Time constraint T', ['depends on the subtype', 'Addresses (0006)']);
  f.label(x0 + 10, 408, 'main address: always one record', { size: 11 });
  bar(X(2024, 3, 1), X(2025, 8, 1), 414, 24, brand.teal, '01.03.2024 - 31.07.2025');
  bar(X(2025, 8, 1), x0 + W, 414, 24, brand.teal, '01.08.2025 - 31.12.9999', { openRight: true });
  f.label(x0 + 10, 466, 'temporary residence: optional, may come and go', { size: 11 });
  bar(X(2026, 2, 1), X(2026, 9, 1), 472, 34, brand.teal, ['01.02.2026', '31.08.2026']);
  f.label(540, 552, 'All dates are invented example values; the records of Ana Torres extend the running example of Example Trading Co.', { anchor: 'middle', size: 11 });
  f.write();
}

// Human Resources: enterprise structure and personnel structure meet in infotype 0001 (Enterprise and Personnel Structure page).
{
  const f = new Fig('sap-hr-structures.svg', 1080, 500,
    'The enterprise structure and the personnel structure of Example Trading Co. meet in infotype 0001',
    'The enterprise structure on the left: company code EX01 contains personnel area EX01, which is divided into personnel subareas 0001 Head office and 0002 Warehouse. The personnel structure on the right: employee group 1 Active is divided into employee subgroups AA Salaried staff and AB Hourly staff, and payroll area E1 Monthly EX01 is a separate grouping for payroll runs. Infotype 0001 Organizational Assignment of employee 00001234 Ana Torres stores one value from each: personnel area EX01, personnel subarea 0001, employee group 1, employee subgroup AA and payroll area E1. All codes are invented example values.');
  f.label(260, 22, 'Enterprise structure: where the employee works', { anchor: 'middle', size: 14, bold: true });
  f.label(820, 22, 'Personnel structure: what kind of employee', { anchor: 'middle', size: 14, bold: true });
  // left column
  f.box(20, 40, 480, 56, brand.indigo, 'Company code EX01', { size: 14, bold: true, sub: 'the legal company, shared with Finance' });
  f.line(260, 96, 260, 130, { arrow: true });
  f.box(20, 130, 480, 56, brand.violet, 'Personnel area EX01 "Example Trading Co."', { size: 14, bold: true, sub: 'one company code per personnel area (table T500P)' });
  f.line(140, 186, 132, 220, { arrow: true });
  f.line(380, 186, 388, 220, { arrow: true });
  f.box(20, 220, 225, 60, brand.pink, 'Subarea 0001', { size: 13, bold: true, sub: 'Head office' });
  f.box(275, 220, 225, 60, brand.pink, 'Subarea 0002', { size: 13, bold: true, sub: 'Warehouse' });
  f.label(260, 304, 'Personnel areas and subareas: table T001P', { anchor: 'middle', size: 11 });
  // right column
  f.box(580, 40, 480, 56, brand.green, 'Employee group 1 "Active"', { size: 14, bold: true, sub: 'one-character code' });
  f.line(700, 96, 692, 130, { arrow: true });
  f.line(940, 96, 948, 130, { arrow: true });
  f.box(580, 130, 225, 60, brand.teal, 'Subgroup AA', { size: 13, bold: true, sub: 'Salaried staff' });
  f.box(835, 130, 225, 60, brand.teal, 'Subgroup AB', { size: 13, bold: true, sub: 'Hourly staff' });
  f.label(820, 214, 'Groups and subgroups: table T503', { anchor: 'middle', size: 11 });
  f.box(835, 230, 225, 56, brand.azure, 'Payroll area E1', { size: 13, bold: true, sub: 'Monthly EX01' });
  f.label(620, 250, 'A payroll area groups employees', { size: 11 });
  f.label(620, 266, 'who are paid together; it is not', { size: 11 });
  f.label(620, 282, 'a subdivision of the group', { size: 11 });
  // infotype 0001
  f.line(132, 280, 132, 340, { arrow: true });
  f.line(600, 190, 600, 340, { arrow: true });
  f.line(947, 286, 947, 340, { arrow: true });
  f.box(20, 340, 1040, 110, brand.indigo, 'Infotype 0001 Organizational Assignment of 00001234 Ana Torres', { size: 15, bold: true, opacity: 0.2,
    sub: ['Personnel area EX01  |  Personnel subarea 0001', 'Employee group 1  |  Employee subgroup AA  |  Payroll area E1', 'one valid record at all times during employment'] });
  f.label(540, 480, 'All codes and names are invented example values for Example Trading Co.; they are not SAP-delivered values.', { anchor: 'middle', size: 11 });
  f.write();
}

// Human Resources: Employee Central to SAP S/4HANA replication (Employee Central to SAP S/4HANA Integration page).
{
  const f = new Fig('sap-hr-ec-s4-integration.svg', 1080, 690,
    'Employee Central to SAP S/4HANA: replication through SAP Cloud Integration, the staging area and the confirmation back',
    'Three columns. Left: SAP SuccessFactors Employee Central, the system of record, with the Compound Employee API for employee data and organizational assignments, OData APIs for organizational objects, the source record of Ana Torres, and the Data Replication Monitor in the Admin Center. Middle: SAP Cloud Integration with one integration flow for employee master data and organizational assignments, one for organizational objects and one for the confirmation. Right: SAP S/4HANA with the query program for employees, the query program for organizational objects, the staging area with one replication request per employee, the processing program started by an event, and the infotypes of Personnel Administration and Organizational Management. Steps one to four: S/4HANA sends a query to the middleware, the middleware requests the data from Employee Central, Employee Central returns it, and the middleware passes it to the staging area in S/4HANA. After processing, S/4HANA sends Successful, Failed or Pending confirmations through the middleware to the Data Replication Monitor. A band at the bottom shows the alternative for SAP S/4HANA Cloud Public Edition: SAP Master Data Integration replicates only the workforce person, which is not enough for payroll. Ana Torres, personnel number 00001234, is an invented example value.');
  const cx = [20, 390, 760], cw = 300;
  f.label(cx[0] + cw / 2, 70, 'SAP SuccessFactors Employee Central', { anchor: 'middle', size: 14, bold: true });
  f.label(cx[1] + cw / 2, 70, 'SAP Cloud Integration (middleware)', { anchor: 'middle', size: 14, bold: true });
  f.label(cx[2] + cw / 2, 70, 'SAP S/4HANA (on premise or Private Edition)', { anchor: 'middle', size: 14, bold: true });
  // row 1: employee data
  f.box(cx[0], 100, cw, 70, brand.green, 'Compound Employee API', { size: 13, bold: true, sub: ['SOAP: employee data and', 'organizational assignments'] });
  f.box(cx[1], 100, cw, 70, brand.violet, 'Integration flow', { size: 13, bold: true, sub: ['employee master data and', 'organizational assignments'] });
  f.box(cx[2], 100, cw, 70, brand.indigo, ['Query program', 'ECPAO_EE_ORG_REPL_QUERY'], { size: 12, bold: true, sub: 'sends the query on a schedule' });
  // row 2: organizational objects
  f.box(cx[0], 190, cw, 70, brand.green, 'OData APIs', { size: 13, bold: true, sub: ['organizational objects:', 'departments, divisions, positions'] });
  f.box(cx[1], 190, cw, 70, brand.violet, 'Integration flow', { size: 13, bold: true, sub: 'organizational objects' });
  f.box(cx[2], 190, cw, 70, brand.indigo, ['Query program', 'RH_SFIOM_ORG_OBJ_REPL_QUERY'], { size: 12, bold: true });
  // arrows rows 1 and 2
  [[100, 'a'], [190, 'b']].forEach(([y0]) => {
    f.line(760, y0 + 22, 690, y0 + 22, { arrow: true });
    f.line(390, y0 + 22, 320, y0 + 22, { arrow: true });
    f.line(320, y0 + 50, 390, y0 + 50, { arrow: true });
    f.line(690, y0 + 50, 760, y0 + 50, { arrow: true });
  });
  f.label(725, 116, 'query', { anchor: 'middle', size: 11 });
  f.label(355, 116, 'request', { anchor: 'middle', size: 11 });
  f.label(355, 160, 'data', { anchor: 'middle', size: 11 });
  f.label(725, 160, 'data', { anchor: 'middle', size: 11 });
  f.label(725, 206, 'query', { anchor: 'middle', size: 11 });
  f.label(355, 206, 'request', { anchor: 'middle', size: 11 });
  f.label(355, 250, 'data', { anchor: 'middle', size: 11 });
  f.label(725, 250, 'data', { anchor: 'middle', size: 11 });
  // row 3: staging area, source record, event note
  f.box(cx[0], 290, cw, 80, brand.pink, 'Source record in Employee Central', { size: 12, bold: true, sub: ['Ana Torres, Sales Manager, hired 01.03.2024', 'position in the department Sales'] });
  f.box(cx[1], 290, cw, 80, brand.azure, 'Event starts the processing job', { size: 12, bold: true, opacity: 0.18, sub: ['writing to the staging area raises', 'an event; a background job reacts'] });
  f.box(cx[2], 290, cw, 80, brand.teal, 'Staging area', { size: 13, bold: true, sub: ['one replication request per employee', 'status Open when stored'] });
  f.line(910, 260, 910, 290, { arrow: true });
  f.line(690, 330, 760, 330, { dash: true });
  // row 4: processing and confirmation
  f.box(cx[2], 400, cw, 70, brand.indigo, ['Processing program', 'ECPAO_RPRQ_EE_PROCESSING'], { size: 12, bold: true });
  f.line(910, 370, 910, 400, { arrow: true });
  f.box(cx[1], 400, cw, 70, brand.violet, 'Integration flow', { size: 13, bold: true, sub: 'confirmation' });
  f.box(cx[0], 400, cw, 70, brand.green, 'Data Replication Monitor', { size: 13, bold: true, sub: ['Admin Center: Successful,', 'Failed or Pending per employee'] });
  f.line(760, 435, 690, 435, { arrow: true });
  f.line(390, 435, 320, 435, { arrow: true });
  f.label(725, 429, 'result', { anchor: 'middle', size: 11 });
  f.label(355, 429, 'result', { anchor: 'middle', size: 11 });
  // row 5: infotypes
  f.line(910, 470, 910, 500, { arrow: true });
  f.box(cx[2], 500, cw, 80, brand.green, 'Infotypes in PA and OM', { size: 13, bold: true, sub: ['Ana: Organizational Assignment (0001),', 'Relationships (1001) of her position'] });
  f.box(cx[0], 500, 670, 80, brand.azure, 'Status of every replication request', { size: 13, bold: true, opacity: 0.18, sub: ['Successful when processing worked; Pending after a temporary problem', '(Failed after three days); Failed after a data or configuration problem'] });
  f.line(760, 540, 690, 540, { arrow: true });
  // public edition band
  f.box(20, 610, 1040, 56, brand.pink, 'SAP S/4HANA Cloud Public Edition: SAP Master Data Integration instead of the add-on', { size: 13, bold: true, opacity: 0.2, sub: 'Only the workforce person is replicated: not enough for HR processes such as payroll.' });
  f.label(540, 684, 'Ana Torres and all values are invented examples; names of programs and statuses are those of the SAP documentation for the add-on ECS4HCM.', { anchor: 'middle', size: 11 });
  f.write();
}
