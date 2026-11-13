// Figures of "SAP Guide: Secure a CAP Service with Roles" (erp/sap/guide-secure-a-cap-service.adoc). Facts: the project
// modules/ROOT/examples/sap-lab/claims-secured was built and run on 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2 and Node.js
// 24.21.0 (cds watch, curl with the built-in mocked users alice and bob, npm test). The terminal text is the real output of those
// commands, run on another port than 4004 because that port was taken on the machine; the port in the text is 4004, as a reader
// sees it. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, cdsCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'claims-secured');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const service = read('srv/claims-service.cds');
const access = read('srv/claims-access.cds');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
const ok = (str) => out(str, 'state.normal.bg');

const explorer = ({ active, access: acc = false }) => [
  { label: 'CLAIMS-SECURED', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true, open: true },
  { label: 'sap.guide.secured-Claims.csv', indent: 3 },
  { label: 'schema.cds', indent: 2 },
  { label: 'srv', indent: 1, folder: true, open: true },
  ...(acc ? [{ label: 'claims-access.cds', indent: 2, ...(active === 'claims-access.cds' ? { active: true } : {}) }] : []),
  { label: 'claims-service.cds', indent: 2, ...(active === 'claims-service.cds' ? { active: true } : {}) },
  { label: 'claims-service.js', indent: 2 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, h, tabs, activeTab, code, terminal, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'claims-secured', explorer: exp, tabs, activeTab, code, terminal });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function terminal({ id, alt, lines, marksOf }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = marksOf.flatMap(([i, n, span = 1]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const claimJson = '{"@odata.context":"$metadata#Claims","value":[{"title":"Train ticket","ID":"11111111-1111-1111-1111-111111111111"}]}';
const forbidden = '{"error":{"message":"Forbidden","code":"403","@Common.numericSeverity":4}}';
const patchCmd = "curl -s -w '\\nHTTP %{http_code}\\n' -u bob: -X PATCH -H 'Content-Type: application/json' -d '{\"amount\":50}' \"$CLAIM\"";
const approveBob = "curl -s -w '\\nHTTP %{http_code}\\n' -u bob: -X POST -H 'Content-Type: application/json' -d '{}' \\";
const approveAlice = "curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -u alice: -X POST -H 'Content-Type: application/json' -d '{}' \\";
const patchAlice = "curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -u alice: -X PATCH -H 'Content-Type: application/json' -d '{\"amount\":50}' \"$CLAIM\"";
const vars = [
  prompt('BASE=http://localhost:4004/odata/v4/claims/Claims'),
  prompt('CLAIM="$BASE(11111111-1111-1111-1111-111111111111)"'),
];

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'secure-a-cap-service',
  figures: [
    editor({
      id: '01-project-files', h: 640, tabs: ['claims-service.cds'], activeTab: 0, code: cdsCode(service), exp: explorer({ active: 'claims-service.cds' }),
      terminal: [prompt('cds init claims-secured --nodejs'), out('Adding facet: nodejs'), out('Successfully initialized CAP project'), out('Continue with: code claims-secured'), prompt('cd claims-secured && npm install'), out('found 0 vulnerabilities')],
      alt: 'Visual Studio Code with the claims-secured project: the explorer lists the folders app, db and srv, the CSV file and schema.cds in db, the files claims-service.cds and claims-service.js in srv and package.json; the editor shows srv/claims-service.cds with the service ClaimsService, the entity Claims as a projection on db.Claims and the action approve; the terminal shows cds init with the option nodejs and npm install ending in found 0 vulnerabilities; callout 2 marks schema.cds, callout 3 the CSV file, callout 4 the service file and callout 5 the handler file',
      marksFor: (g) => ['schema.cds', 'sap.guide.secured-Claims.csv', 'claims-service.cds', 'claims-service.js'].map((f, i) => [{ ...g[`entry:${f}`], y: g[`entry:${f}`].y + 2, h: 20 }, i + 2]),
    }),
    terminal({
      id: '02-cds-watch',
      alt: 'Terminal after cds watch: the log lists the model files srv/claims-service.cds, db/schema.cds and the common.cds of CAP, connects to an in-memory SQLite database, initializes it from db/data/sap.guide.secured-Claims.csv, shows the line using auth strategy kind mocked, serves ClaimsService at /odata/v4/claims with the implementation srv/claims-service.js and ends with server listening on http://localhost:4004; callout 6 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  srv/claims-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.secured-Claims.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving ClaimsService {'),
        out("  at: [ '/odata/v4/claims' ],"),
        out("  decl: 'srv/claims-service.cds:3',"),
        out("  impl: 'srv/claims-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 6]],
    }),
    terminal({
      id: '03-open-service',
      alt: 'Terminal with two curl calls to the service before any rule exists: the first, a read without credentials, answers HTTP 200 with the claim Train ticket; the second, a PATCH that sets the amount to 50 without credentials, also answers HTTP 200; callout 7 marks the read and callout 8 the write',
      lines: [
        ...vars,
        prompt('curl -s -w \'\\nHTTP %{http_code}\\n\' "$BASE?\\$top=1&\\$select=title"'),
        out(claimJson),
        out('HTTP 200'),
        prompt('curl -s -o /dev/null -w \'HTTP %{http_code}\\n\' -X PATCH -H \'Content-Type: application/json\' -d \'{"amount":50}\' "$CLAIM"'),
        out('HTTP 200'),
      ],
      marksOf: [[2, 7], [5, 8]],
    }),
    editor({
      id: '04-access-rules', h: 480, tabs: ['claims-access.cds'], activeTab: 0, code: cdsCode(access), exp: explorer({ active: 'claims-access.cds', access: true }),
      terminal: [out('[cds] - loaded model from 4 file(s):'), out(''), out('  srv/claims-access.cds'), out('  srv/claims-service.cds'), out('  db/schema.cds'), out('  node_modules/@sap/cds/common.cds')],
      alt: 'Visual Studio Code with the new file srv/claims-access.cds open: it annotates ClaimsService with requires authenticated-user and the entity ClaimsService.Claims with a restrict list that grants READ to authenticated-user and grants CREATE, UPDATE, DELETE and approve to admin; the terminal shows the restart of cds watch, which now loads four model files and lists srv/claims-access.cds first; callout 9 marks the file in the explorer and callout 10 marks the terminal',
      marksFor: (g) => [[g['entry:claims-access.cds'], 9], [{ x: g.terminal.x + 8, y: g.terminal.y + 36, w: g.terminal.w - 44, h: 22 }, 10]],
    }),
    terminal({
      id: '05-read-and-refuse',
      alt: 'Terminal with three curl calls after the rules: a read without credentials answers HTTP/1.1 401 Unauthorized and a WWW-Authenticate header for Basic realm Users; a read as bob answers HTTP 200 with the claim Train ticket; a PATCH as bob answers the error Forbidden with code 403 and HTTP 403; callout 11 marks the first call, callout 12 the second and callout 13 the third',
      lines: [
        prompt('curl -s -i "$BASE" | grep -iE \'^(HTTP|www-authenticate)\''),
        out('HTTP/1.1 401 Unauthorized'),
        out('WWW-Authenticate: Basic realm="Users"'),
        prompt('curl -s -w \'\\nHTTP %{http_code}\\n\' -u bob: "$BASE?\\$top=1&\\$select=title"'),
        out(claimJson),
        out('HTTP 200'),
        prompt(patchCmd),
        out(forbidden),
        out('HTTP 403'),
      ],
      marksOf: [[0, 11], [3, 12], [6, 13]],
    }),
    terminal({
      id: '06-admin-writes',
      alt: 'Terminal with four curl calls: a PATCH as alice answers HTTP 200; an approve call as bob answers the error Forbidden with code 403 and HTTP 403; the same approve call as alice answers HTTP 204; a read as alice shows the claim Train ticket with the status A and the amount 50.00; callouts 14 to 17 mark the four calls in order',
      lines: [
        prompt(patchAlice),
        out('HTTP 200'),
        prompt(approveBob),
        out('    "$CLAIM/ClaimsService.approve"'),
        out(forbidden),
        out('HTTP 403'),
        prompt(approveAlice),
        out('    "$CLAIM/ClaimsService.approve"'),
        out('HTTP 204'),
        prompt('curl -s -u alice: "$CLAIM?\\$select=title,status,amount"'),
        out('{"@odata.context":"$metadata#Claims/$entity","title":"Train ticket","status":"A","amount":"50.00",'),
        out('"ID":"11111111-1111-1111-1111-111111111111"}'),
      ],
      marksOf: [[0, 14], [2, 15, 2], [6, 16, 2], [9, 17]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal after npm test: four tests pass, named without a login the answer is 401, alice and bob may read, bob may not change a claim and alice may, and only alice may approve; the summary lists tests 4, pass 4 and fail 0',
      lines: [
        prompt('npm test'),
        out('> claims-secured@1.0.0 test'),
        out('> node --test'),
        out(''),
        ok('✔ without a login the answer is 401 (286.143ms)'),
        ok('✔ alice and bob may read (14.131583ms)'),
        ok('✔ bob may not change a claim, alice may (19.631416ms)'),
        ok('✔ only alice may approve (4.454ms)'),
        out('ℹ tests 4'),
        out('ℹ pass 4'),
        out('ℹ fail 0'),
      ],
      marksOf: [],
    }),
  ],
};
