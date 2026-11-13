// Figures of "SAP Guide: Model a Domain and Add Custom Logic in CAP" (erp/sap/guide-cap-domain-model-and-custom-logic.adoc). Facts:
// the project built and run on 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2 and Node.js 24.21.0 (cds init claims --nodejs, then
// the lab files of modules/ROOT/examples/sap-lab/claims-model added stage by stage); the terminal text is the output of cds watch (the
// banner lines and a line about service bindings are left out) and of curl, the browser text is the response of the running service
// (pretty-printed, as the browser's formatting option shows it). The listening address is the default port 4004. A generated id or a
// time stamp may differ from a run. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'claims-model');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const schema = read('db/schema.cds');
const serviceStart = labText(read('srv/claims-service.cds'), { drop: ['action'] });
// The handler as the guide shows it in step 9 (without the action) and the part of the final file that step 14 adds.
const handlerStart = labText(read('srv/claims-service.js'), { drop: ['hook', 'submit'] });
const handlerFull = read('srv/claims-service.js');
const classPart = labText(handlerFull, {}).split('\n').slice(0, 9).join('\n');
const submitPart = labText(handlerFull, { only: ['submit'] });
const handlerExcerpt = `${classPart}\n\n// ...\n\n${submitPart}`;

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal holds about 118 characters per line: a longer answer continues on the next line, indented.
const wrap = (str, width = 118) => {
  const lines = [];
  let rest = str;
  let first = true;
  while (rest.length) {
    const room = first ? width : width - 2;
    lines.push(first ? rest.slice(0, room) : `  ${rest.slice(0, room)}`);
    rest = rest.slice(room);
    first = false;
  }
  return lines;
};

const explorer = ({ active, data = false, srv = [], http = [], fresh = false }) => [
  { label: 'CLAIMS', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true, open: !fresh },
  ...(fresh ? [] : [{ label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) }]),
  ...(data ? [{ label: 'data', indent: 2, folder: true }] : []),
  { label: 'srv', indent: 1, folder: true, open: srv.length > 0 },
  ...srv.map((f) => ({ label: f, indent: 2, ...(active === f ? { active: true } : {}) })),
  ...(http.length ? [{ label: 'http', indent: 1, folder: true, open: true }, ...http.map((f) => ({ label: f, indent: 2 }))] : []),
  { label: 'package.json', indent: 1 },
  { label: 'readme.md', indent: 1 },
];

function editor({ id, alt, h, tabs, activeTab, code, terminal, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'claims', explorer: exp, tabs, activeTab, code, terminal });
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

function browser({ id, alt, url, lines, h, markAddress }) {
  const sh = browserShell({ h, url, tab: 'localhost', lines });
  const list = markAddress ? mark(sh.geo.address, markAddress) : [];
  return { id, alt, width: FW, height: h, theme: 'browser', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const expandJson = `{
    "@odata.context": "$metadata#Claims",
    "value": [
        {
            "title": "Customer visit Chicago",
            "items": [
                {
                    "category": {
                        "code": "TRAVEL",
                        "name": "Travel"
                    },
                    "description": "Train ticket",
                    "ID": "b1111111-1111-1111-1111-111111111111"
                },
                {
                    "category": {
                        "code": "MEALS",
                        "name": "Meals"
                    },
                    "description": "Client dinner",
                    "ID": "b2222222-2222-2222-2222-222222222222"
                }
            ],
            "ID": "a1111111-1111-1111-1111-111111111111"
        }
    ]
}`;

const grep = 'grep -E "^(HTTP|\\{)"';
const post = (file) => `curl -s -i --json @http/${file}.json localhost:4004/odata/v4/claims/Claims | ${grep}`;
const bad = '{"error":{"message":"Item \\"Airport taxi\\" needs an amount above zero","code":"400","target":"in/items","@Common.numericSeverity":4}}';
const empty = '{"error":{"message":"Multiple errors occurred, see details below.","code":"MULTIPLE_ERRORS","details":[{"message":"A claim needs a title","code":"400","target":"in/title","@Common.numericSeverity":4},{"message":"A claim needs at least one item","code":"400","target":"in/items","@Common.numericSeverity":4}],"@Common.numericSeverity":4}}';
const submitted = '{"@odata.context":"../$metadata#Claims/$entity","ID":"a1111111-1111-1111-1111-111111111111","createdAt":"2026-11-13T18:47:56.468Z","createdBy":"anonymous","modifiedAt":"2026-11-13T18:48:01.118Z","modifiedBy":"anonymous","title":"Customer visit Chicago","status":"S","total":"128.50"}';
const conflict = '{"error":{"message":"Claim is already submitted (status S)","code":"409","@Common.numericSeverity":4}}';

const badLines = [prompt(post('bad-claim')), out('HTTP/1.1 400 Bad Request'), ...wrap(bad).map((s) => out(s))];
const emptyLines = [prompt(post('empty-claim')), out('HTTP/1.1 400 Bad Request'), ...wrap(empty).map((s) => out(s))];
const url = "URL='localhost:4004/odata/v4/claims/Claims(a1111111-1111-1111-1111-111111111111)/ClaimsService.submit'";
const call = `curl -s -i --json '{}' "$URL" | ${grep}`;
const resultLines = [prompt(url), prompt(call), out('HTTP/1.1 200 OK'), ...wrap(submitted).map((s) => out(s)), prompt(call), out('HTTP/1.1 409 Conflict'), ...wrap(conflict).map((s) => out(s))];

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'cap-domain-model-and-custom-logic',
  figures: [
    editor({
      id: '01-schema-file', h: 560, tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schema), exp: explorer({ active: 'schema.cds' }),
      alt: 'Visual Studio Code with the file db/schema.cds open: it imports cuid and managed, sets the namespace sap.guide.claimsmodel and defines the entities Categories with the key code, Claims with the composition items, and ClaimItems with the associations claim and category; callout 2 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 2]],
    }),
    editor({
      id: '02-service-and-data', h: 400, tabs: ['schema.cds', 'claims-service.cds'], activeTab: 1, code: cdsCode(serviceStart), exp: explorer({ active: 'claims-service.cds', data: true, srv: ['claims-service.cds'] }),
      alt: 'Visual Studio Code with the file srv/claims-service.cds open: the service ClaimsService exposes the entities Claims and Categories as projections on db.Claims and db.Categories; callout 3 marks the service file and callout 4 marks the folder db/data, which holds the three CSV files',
      marksFor: (g) => [[g['entry:claims-service.cds'], 3], [g['entry:data'], 4]],
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch: the log lists the model files srv/claims-service.cds, db/schema.cds and the common.cds of CAP, connects to an in-memory SQLite database, initializes it from the three CSV files for Claims, ClaimItems and Categories, serves ClaimsService at /odata/v4/claims and ends with server listening on http://localhost:4004; callout 5 marks the command and callout 6 the lines that load the CSV files',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  srv/claims-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.claimsmodel-Claims.csv'),
        out('  > init from db/data/sap.guide.claimsmodel-ClaimItems.csv'),
        out('  > init from db/data/sap.guide.claimsmodel-Categories.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving ClaimsService {'),
        out("  at: [ '/odata/v4/claims' ],"),
        out("  decl: 'srv/claims-service.cds:3'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 5], [6, 6, 3]],
    }),
    browser({
      id: '04-expand', h: 690, url: 'localhost:4004/odata/v4/claims/Claims?$top=1&$select=title&$expand=items($select=description;$expand=category)', markAddress: 7,
      alt: 'Browser with the address localhost:4004/odata/v4/claims/Claims with the query options top, select and expand, marked by callout 7: the JSON response holds one claim, Customer visit Chicago, with its two items, the Train ticket in the category TRAVEL named Travel and the Client dinner in the category MEALS named Meals',
      lines: plainCode(expandJson),
    }),
    editor({
      id: '05-handler-file', h: 800, tabs: ['claims-service.cds', 'claims-service.js'], activeTab: 1, code: plainCode(handlerStart), exp: explorer({ active: 'claims-service.js', data: true, srv: ['claims-service.cds', 'claims-service.js'] }),
      alt: 'Visual Studio Code with the file srv/claims-service.js open: the class ClaimsService attaches the function validateClaim as a before handler for CREATE and UPDATE of Claims, and validateClaim checks the title, the items and each item amount and sums the total in cents; callout 9 marks the file in the explorer',
      marksFor: (g) => [[g['entry:claims-service.js'], 9]],
    }),
    terminal({
      id: '06-validation-errors',
      alt: 'Terminal with two curl requests that the handler refuses: the first, for bad-claim.json, answers HTTP 400 with the message that the item Airport taxi needs an amount above zero, marked by callout 11; the second, for empty-claim.json, answers HTTP 400 with the code MULTIPLE_ERRORS and two details, a claim needs a title and a claim needs at least one item, marked by callout 12',
      lines: [...badLines, ...emptyLines],
      marksOf: [[0, 11], [badLines.length, 12]],
    }),
    editor({
      id: '07-action-handler', h: 560, tabs: ['claims-service.cds', 'claims-service.js'], activeTab: 1, code: plainCode(handlerExcerpt), exp: explorer({ active: 'claims-service.js', data: true, srv: ['claims-service.cds', 'claims-service.js'], http: ['bad-claim.json', 'empty-claim.json', 'new-claim.json'] }),
      alt: 'Visual Studio Code with the file srv/claims-service.js open, shown as an excerpt: the class attaches submitClaim with this.on for the action submit of Claims, and the function submitClaim reads the claim with req.subject, refuses a claim whose status is not N with HTTP 409 and otherwise sets the status to S and returns the claim; callout 14 marks the file in the explorer',
      marksFor: (g) => [[g['entry:claims-service.js'], 14]],
    }),
    terminal({
      id: '08-result',
      alt: 'Terminal with the call of the action submit on the claim Customer visit Chicago: the first call answers HTTP 200 with the claim, whose status is now S and whose total is 128.50, and the second call answers HTTP 409 with the message Claim is already submitted (status S)',
      lines: resultLines,
      marksOf: [],
    }),
  ],
};
