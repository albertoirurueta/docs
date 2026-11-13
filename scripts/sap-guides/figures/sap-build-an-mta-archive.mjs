// Figures of "SAP Guide: Package a CAP App as an MTA Archive" (erp/sap/guide-build-an-mta-archive.adoc). Facts: the lab project
// modules/ROOT/examples/sap-lab/claims-mta built and run on 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2, mbt 1.2.52,
// GNU Make 3.81 and Node.js 24.21.0: the YAML shown is the lab's mta.yaml and xs-security.json (written by `cds add`), the terminal
// text is what the commands printed (the build log leaves out the lines that hold paths, npm summaries and the cds build output).
// Nothing was deployed. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, cdsCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'claims-mta');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const service = read('srv/claim-service.cds');
const mta = read('mta.yaml').replace(/\n$/, '').split('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });

function terminal({ id, alt, lines, markLines }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = markLines.flatMap(([from, n, span = 1]) => {
    const i = typeof from === 'string' ? lines.findIndex((l) => (l.str ?? l).includes(from)) : from;
    if (i < 0) throw new Error(`figure ${id}: no terminal line with ${from}`);
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

// An editor figure. `marksFor(geo, at)` returns [box, step] pairs; `at(i, count)` is the box of `count` code lines from line index i.
function editor({ id, alt, h, tabs, activeTab, code, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'claims-mta', explorer: exp, tabs, activeTab, code });
  const g = sh.geo;
  const at = (i, count = 1) => ({ x: g.editor.x + 44, y: g.editor.y + 16 + i * 20, w: g.editor.w - 64, h: count * 20 });
  const list = marksFor(g, at).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}
const heightFor = (n) => 30 + 35 + 8 + 30 + n * 20 + 16 + 24;

const rootEntries = (active) => [
  { label: 'CLAIMS-MTA', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true },
  { label: 'srv', indent: 1, folder: true },
  { label: 'mta.yaml', indent: 1, ...(active === 'mta.yaml' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
  { label: 'xs-security.json', indent: 1 },
];

const modulesPart = mta.slice(0, 37);
const resourcesPart = mta.slice(37);
const idx = (arr, s) => arr.findIndex((l) => l.startsWith(s));

const log = (t, msg) => out(`[2026-11-13 ${t}]  INFO ${msg}`);
const archiveList = ['META-INF/', 'META-INF/MANIFEST.MF', 'META-INF/mtad.yaml', 'claims-mta-db-deployer/', 'claims-mta-db-deployer/data.zip', 'claims-mta-srv/', 'claims-mta-srv/data.zip', 'xs-security.json'];
const manifest = ['manifest-Version: 1.0', 'Created-By: SAP Application Archive Builder 1.2.52', '', 'Name: claims-mta-srv/data.zip', 'MTA-Module: claims-mta-srv', 'Content-Type: application/zip', '', 'Name: claims-mta-db-deployer/data.zip', 'MTA-Module: claims-mta-db-deployer', 'Content-Type: application/zip', '', 'Name: xs-security.json', 'MTA-Resource: claims-mta-auth', 'Content-Type: application/json', '', 'Name: META-INF/mtad.yaml', 'Content-Type: text/plain'];
const mtad = `_schema-version: 3.3.0
ID: claims-mta
description: A simple CAP project.
version: 1.0.0
modules:
- name: claims-mta-srv
  type: javascript.nodejs
  path: claims-mta-srv
  requires:
  - name: claims-mta-auth
  - name: claims-mta-db
  provides:
  - name: srv-api
    properties:
      srv-url: \${default-url}
  parameters:
    buildpack: nodejs_buildpack
    instances: 1
- name: claims-mta-db-deployer
  type: com.sap.xs.hdi
  path: claims-mta-db-deployer
  requires:
  - name: claims-mta-db
  parameters:
    buildpack: nodejs_buildpack`.split('\n');

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'build-an-mta-archive',
  figures: [
    terminal({
      id: '01-tools-and-project',
      alt: 'Terminal that checks the tools and creates the project: mbt --version prints Cloud MTA Build Tool version 1.2.52 and make --version prints GNU Make 3.81, cds init claims-mta --nodejs prints Successfully initialized CAP project, and npm install in the new folder ends with found 0 vulnerabilities; callout 1 marks the two version checks, callout 2 the cds init command and its answer, callout 3 the npm install',
      lines: [
        prompt('mbt --version'), out('Cloud MTA Build Tool version 1.2.52'),
        prompt('make --version | head -n 1'), out('GNU Make 3.81'),
        prompt('cds init claims-mta --nodejs'), out('Adding facet: nodejs'), out(''), out('Successfully initialized CAP project'), out('Continue with: code claims-mta'),
        prompt('cd claims-mta && npm install'), out('found 0 vulnerabilities'),
      ],
      markLines: [[0, 1, 4], [4, 2, 5], [9, 3, 2]],
    }),
    editor({
      id: '02-model-and-service', h: 400, tabs: ['schema.cds', 'claim-service.cds'], activeTab: 1, code: cdsCode(service),
      exp: [
        { label: 'CLAIMS-MTA', folder: true, open: true },
        { label: 'app', indent: 1, folder: true },
        { label: 'db', indent: 1, folder: true, open: true },
        { label: 'data', indent: 2, folder: true, open: true },
        { label: 'sap.guide.claims-Claims.csv', indent: 3 },
        { label: 'schema.cds', indent: 2 },
        { label: 'srv', indent: 1, folder: true, open: true },
        { label: 'claim-service.cds', indent: 2, active: true },
        { label: 'package.json', indent: 1 },
      ],
      alt: 'Visual Studio Code with the claims-mta project: the editor shows srv/claim-service.cds, in which the service ClaimService exposes the entity Claims as a projection on db.Claims; callout 4 marks db/schema.cds in the explorer, callout 5 marks the service file and callout 6 marks the CSV file sap.guide.claims-Claims.csv in db/data',
      marksFor: (g) => [[g['entry:schema.cds'], 4], [g['entry:claim-service.cds'], 5], [g['entry:sap.guide.claims-Claims.csv'], 6]],
    }),
    terminal({
      id: '03-cds-add',
      alt: 'Terminal: cds add mta,hana,xsuaa prints Adding facet for mta, xsuaa and hana and Successfully added features to your project; cds env get requires.auth.kind prints mocked and, with the profile production, xsuaa; cds env get requires.db.kind prints sqlite and, with the profile production, hana; callout 7 marks the cds add command and callout 8 marks the four cds env commands',
      lines: [
        prompt('cds add mta,hana,xsuaa'), out('Adding facet: mta'), out('Adding facet: xsuaa'), out('Adding facet: hana'), out(''),
        out('Successfully added features to your project'),
        prompt('cds env get requires.auth.kind'), out('mocked'),
        prompt('cds env get requires.auth.kind --profile production'), out('xsuaa'),
        prompt('cds env get requires.db.kind'), out('sqlite'),
        prompt('cds env get requires.db.kind --profile production'), out('hana'),
      ],
      markLines: [[0, 7, 6], [6, 8, 8]],
    }),
    editor({
      id: '04-modules', h: heightFor(modulesPart.length), tabs: ['mta.yaml'], activeTab: 0, code: plainCode(modulesPart.join('\n')), exp: rootEntries('mta.yaml'),
      alt: 'Visual Studio Code with mta.yaml open, showing the file down to the end of the modules part: the header with the ID claims-mta and the before-all build step that runs npm ci and npx cds build --production is marked by callout 10, the module claims-mta-srv of type nodejs with the path gen/srv, which provides srv-api and requires claims-mta-auth and claims-mta-db, by callout 11, and the module claims-mta-db-deployer of type hdb with the path gen/db by callout 12',
      marksFor: (g, at) => [[at(idx(modulesPart, 'build-parameters'), 6), 10], [at(idx(modulesPart, '  - name: claims-mta-srv'), 15), 11], [at(idx(modulesPart, '  - name: claims-mta-db-deployer'), 7), 12]],
    }),
    editor({
      id: '05-resources', h: heightFor(resourcesPart.length), tabs: ['mta.yaml'], activeTab: 0, code: plainCode(resourcesPart.join('\n')), exp: rootEntries('mta.yaml'),
      alt: 'Visual Studio Code with mta.yaml open, showing the file from the line resources on, drawn with its own line numbers: the resource claims-mta-auth of type org.cloudfoundry.managed-service with the service xsuaa and the file xs-security.json is marked by callout 13, and the resource claims-mta-db of type com.sap.xs.hdi-container with the service hana and the plan hdi-shared by callout 14',
      marksFor: (g, at) => [[at(idx(resourcesPart, '  - name: claims-mta-auth'), 14), 13], [at(idx(resourcesPart, '  - name: claims-mta-db'), 5), 14]],
    }),
    terminal({
      id: '06-mbt-build',
      alt: 'Terminal: mbt build -t gen --mtar claims-mta.mtar prints the build log, shortened to its main lines: the before-all build runs npm ci and npx cds build --production, then the modules claims-mta-srv and claims-mta-db-deployer are built, the metadata and the archive are generated and the last lines say that the MTA archive was generated at gen/claims-mta.mtar; callout 15 marks the command, callout 16 the before-all and module build lines and callout 17 the line that names the archive',
      lines: [
        prompt('mbt build -t gen --mtar claims-mta.mtar'),
        log('19:43:47', 'Cloud MTA Build Tool version 1.2.52'),
        log('19:43:47', 'running the "before-all" build...'),
        log('19:43:47', 'executing the "npm ci" command...'),
        log('19:43:48', 'executing the "npx cds build --production" command...'),
        log('19:43:50', 'building the "claims-mta-srv" module...'),
        log('19:43:50', 'finished building the "claims-mta-srv" module'),
        log('19:43:50', 'building the "claims-mta-db-deployer" module...'),
        log('19:43:51', 'finished building the "claims-mta-db-deployer" module'),
        log('19:43:51', 'running the "after-all" build...'),
        log('19:43:51', 'generating the metadata...'),
        log('19:43:51', 'generating the MTA archive...'),
        log('19:43:51', 'the MTA archive generated at: gen/claims-mta.mtar'),
        log('19:43:51', 'cleaning temporary files...'),
      ],
      markLines: [[0, 15], [2, 16, 7], ['archive generated at', 17]],
    }),
    terminal({
      id: '07-archive-list',
      alt: 'Terminal: unzip -Z1 gen/claims-mta.mtar lists META-INF/, META-INF/MANIFEST.MF, META-INF/mtad.yaml, claims-mta-db-deployer/, claims-mta-db-deployer/data.zip, claims-mta-srv/, claims-mta-srv/data.zip and xs-security.json, and unzip -p gen/claims-mta.mtar META-INF/MANIFEST.MF prints the manifest, which ties each data.zip to its module and xs-security.json to the resource claims-mta-auth; callout 18 marks the file list',
      lines: [
        prompt('unzip -Z1 gen/claims-mta.mtar'), ...archiveList.map((l) => out(l)),
        prompt('unzip -p gen/claims-mta.mtar META-INF/MANIFEST.MF'), ...manifest.map((l) => out(l)),
      ],
      markLines: [[0, 18, 9]],
    }),
    terminal({
      id: '08-result',
      alt: 'Terminal: unzip -p gen/claims-mta.mtar META-INF/mtad.yaml piped to head -n 25 prints the start of the deployment descriptor inside the archive, in which the modules claims-mta-srv and claims-mta-db-deployer have the resolved types javascript.nodejs and com.sap.xs.hdi and a path that names the packed module; callout 19 marks the module types',
      lines: [
        prompt('unzip -p gen/claims-mta.mtar META-INF/mtad.yaml | head -n 25'), ...mtad.map((l) => out(l)),
      ],
      markLines: [['type: javascript.nodejs', 19]],
    }),
  ],
};
