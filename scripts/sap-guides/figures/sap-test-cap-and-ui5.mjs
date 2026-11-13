// Figures of "SAP Guide: Test a CAP Service and a UI5 App" (erp/sap/guide-test-cap-and-ui5.adoc). Facts: the lab project
// modules/ROOT/examples/sap-lab/claims-tested built and run on 2026-11-13 with @sap/cds 10.2.2, @sap/cds-dk 10.2.1,
// @cap-js/cds-test 1.0.2, Node.js 24.21.0, @ui5/cli 4.0.73, @ui5/linter 1.23.8, OpenUI5 1.154.0 and Google Chrome (headless).
// The terminal text is the real output of cds init, npm install, npm test, npm run lint and npm run ci (blank lines, banner lines
// and the counts of installed packages are left out); the code is the lab's own files. The step numbers are the callout numbers
// of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'claims-tested');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const testFile = labText(read('test/claims.test.js'), { drop: ['negative'] });
const handler = labText(read('srv/claim-service.js'));
const journey = labText(read('ui5app/webapp/test/integration/MainJourney.js'));

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
const ok = (str) => out(`✔ ${str}`, 'state.normal.bg');
const bad = (str) => out(`✖ ${str}`, 'danger');

const EDX = 48 + 300;
// Height of an editor figure with a terminal that holds the given source: it shows every line.
const heightFor = (text, min = 480) => Math.max(min, 65 + 24 + 180 + 22 + text.split('\n').length * 19 + 8 + 16 + 8);
function editor({ id, alt, h, tabs, activeTab, code, terminal, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'claims-tested', explorer: exp, tabs, activeTab, code, terminal });
  // A mark on terminal line i (0 based) is given as { line: i }.
  const termLine = (i) => ({ x: EDX + 8, y: sh.geo.terminal.y + 52 + i * 19 - 13, w: 360, h: 18 });
  const list = marksFor(sh.geo, termLine).flatMap(([b, n]) => mark(b, n));
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

const packageJson = `{
  "name": "claims-tested",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@sap/cds": "^10"
  },
  "devDependencies": {
    "@cap-js/cds-test": "^1.0.2",
    "@cap-js/sqlite": "^3"
  },
  "scripts": {
    "start": "cds-serve",
    "test": "node --test \\"test/*.test.js\\""
  },
  "private": true
}`;

const serviceExplorer = ({ active, handlerFile = false, tests = false }) => [
  { label: 'CLAIMS-TESTED', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true, open: true },
  { label: 'sap.guide.tested-Claims.csv', indent: 3 },
  { label: 'schema.cds', indent: 2 },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'claim-service.cds', indent: 2 },
  ...(handlerFile ? [{ label: 'claim-service.js', indent: 2, ...(active === 'claim-service.js' ? { active: true } : {}) }] : []),
  ...(tests ? [{ label: 'test', indent: 1, folder: true, open: true }, { label: 'claims.test.js', indent: 2, ...(active === 'claims.test.js' ? { active: true } : {}) }] : []),
  { label: 'package.json', indent: 1, ...(active === 'package.json' ? { active: true } : {}) },
];

const ui5Explorer = [
  { label: 'UI5APP', folder: true, open: true },
  { label: 'webapp', indent: 1, folder: true, open: true },
  { label: 'controller', indent: 2, folder: true, open: true },
  { label: 'Main.controller.js', indent: 3 },
  { label: 'test', indent: 2, folder: true, open: true },
  { label: 'integration', indent: 3, folder: true, open: true },
  { label: 'MainJourney.js', indent: 4, active: true },
  { label: 'opaTests.qunit.js', indent: 4 },
  { label: 'unit', indent: 3, folder: true, open: true },
  { label: 'Main.qunit.js', indent: 4 },
  { label: 'Test.qunit.html', indent: 3 },
  { label: 'testsuite.qunit.html', indent: 3 },
  { label: 'testsuite.qunit.js', indent: 3 },
  { label: 'view', indent: 2, folder: true, open: true },
  { label: 'Main.view.xml', indent: 3 },
  { label: 'Component.js', indent: 2 },
  { label: 'manifest.json', indent: 2 },
  { label: 'package.json', indent: 1 },
  { label: 'run-tests.mjs', indent: 1 },
  { label: 'ui5.yaml', indent: 1 },
];

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'test-cap-and-ui5',
  figures: [
    terminal({
      id: '01-project-created',
      alt: 'Terminal: cds init claims-tested with the option nodejs prints Successfully initialized CAP project, then cd claims-tested and npm install end in found 0 vulnerabilities, then npm install with the option save-dev adds the package @cap-js/cds-test and ends in found 0 vulnerabilities; callout 1 marks the cds init command and callout 2 marks the command that installs cds-test',
      lines: [
        prompt('cds init claims-tested --nodejs'),
        out('Adding facet: nodejs'),
        out('Successfully initialized CAP project'),
        out('Continue with: code claims-tested'),
        prompt('cd claims-tested && npm install'),
        out('found 0 vulnerabilities'),
        prompt('npm install --save-dev @cap-js/cds-test'),
        out('found 0 vulnerabilities'),
      ],
      marksOf: [[0, 1], [6, 2]],
    }),
    editor({
      id: '02-package-and-service', h: 480, tabs: ['package.json'], activeTab: 0, code: plainCode(packageJson),
      exp: serviceExplorer({ active: 'package.json' }),
      alt: 'Visual Studio Code with the claims-tested project: the explorer lists db/data/sap.guide.tested-Claims.csv, db/schema.cds, srv/claim-service.cds and package.json, and the editor shows package.json with the dependency @cap-js/cds-test and the script test, node --test with the pattern test/*.test.js; callout 3 marks the package.json tab and callout 4 marks the service file',
      marksFor: (g) => [[g['tab:package.json'], 3], [g['entry:claim-service.cds'], 4]],
    }),
    editor({
      id: '03-first-tests', h: heightFor(testFile), tabs: ['claims.test.js'], activeTab: 0, code: plainCode(testFile),
      exp: serviceExplorer({ active: 'claims.test.js', tests: true }),
      terminal: [
        prompt('npm test'),
        ok('lists the two claims of the sample data (144.195291ms)'),
        ok('creates a claim with the status N (8.060917ms)'),
        ok('filters claims by status (4.961542ms)'),
        out('ℹ pass 3'),
        out('ℹ fail 0'),
      ],
      alt: 'Visual Studio Code with the file test/claims.test.js open: it starts the service with cds.test, resets the data before each test and has three tests that list, create and filter claims; the terminal shows npm test with three passing tests, pass 3 and fail 0; callout 5 marks the test file and callout 6 marks the npm test command',
      marksFor: (g, line) => [[g['entry:claims.test.js'], 5], [line(0), 6]],
    }),
    terminal({
      id: '04-first-failure',
      alt: 'Terminal after npm test with the fourth test added: the first three tests pass, the test rejects a negative amount is marked as failed, the summary says pass 3 and fail 1, and the failing test is listed with the message AssertionError, Missing expected rejection; echo $? prints 1; callout 8 marks the npm test command',
      lines: [
        prompt('npm test'),
        ok('lists the two claims of the sample data (141.614416ms)'),
        ok('creates a claim with the status N (7.731792ms)'),
        ok('filters claims by status (2.709167ms)'),
        bad('rejects a negative amount (2.8115ms)'),
        out('ℹ tests 4'),
        out('ℹ pass 3'),
        out('ℹ fail 1'),
        out('✖ failing tests:'),
        out('test at test/claims.test.js:28:1'),
        bad('rejects a negative amount (2.8115ms)'),
        out('  AssertionError [ERR_ASSERTION]: Missing expected rejection.'),
        prompt('echo $?'),
        out('1'),
      ],
      marksOf: [[0, 8]],
    }),
    editor({
      id: '05-handler', h: 480, tabs: ['claim-service.js'], activeTab: 0, code: plainCode(handler),
      exp: serviceExplorer({ active: 'claim-service.js', handlerFile: true, tests: true }),
      terminal: [
        prompt('npm test'),
        ok('lists the two claims of the sample data (147.982875ms)'),
        ok('creates a claim with the status N (8.458959ms)'),
        ok('filters claims by status (3.177708ms)'),
        ok('rejects a negative amount (3.585875ms)'),
        out('ℹ pass 4'),
      ],
      alt: 'Visual Studio Code with the file srv/claim-service.js open: the class ClaimService extends cds.ApplicationService and a before handler for CREATE and UPDATE of Claims calls req.error with the status 400 and the message Amount must not be negative when the amount is below zero; the terminal shows npm test with all four tests passing; callout 9 marks the handler file and callout 10 marks the npm test command',
      marksFor: (g, line) => [[g['entry:claim-service.js'], 9], [line(0), 10]],
    }),
    editor({
      id: '06-ui5-checks', h: heightFor(journey, 560), tabs: ['MainJourney.js'], activeTab: 0, code: plainCode(journey),
      exp: ui5Explorer,
      terminal: [
        prompt('npm run lint'),
        out('UI5 linter report:'),
        out('Success! No findings detected.'),
        prompt('npm test'),
        out('unit/Main: 2 tests, 0 failed, 2 of 2 assertions passed'),
        out('integration/opaTests: 1 tests, 0 failed, 1 of 1 assertions passed'),
      ],
      alt: 'Visual Studio Code with the folder ui5app of the lab: the explorer lists the webapp folder with the controller, the view, the component, the manifest and the test folders, plus package.json, run-tests.mjs and ui5.yaml; the editor shows the OPA5 journey MainJourney.js, which starts the component, presses the Total button and checks the text of the total; the terminal shows npm run lint ending in Success, No findings detected, and npm test with 2 QUnit tests and 1 OPA5 test and no failure; callout 13 marks npm run lint, callout 14 marks the journey file and callout 17 marks npm test',
      marksFor: (g, line) => [[line(0), 13], [g['entry:MainJourney.js'], 14], [line(3), 17]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal after npm run ci: the four service tests pass with pass 4 and fail 0, the UI5 linter reports Success, No findings detected, the QUnit unit tests and the OPA5 journey report no failed test, and and echo $? prints 0',
      lines: [
        prompt('npm run ci'),
        ok('lists the two claims of the sample data (152.957709ms)'),
        ok('creates a claim with the status N (8.148834ms)'),
        ok('filters claims by status (2.885875ms)'),
        ok('rejects a negative amount (3.550334ms)'),
        out('ℹ pass 4'),
        out('ℹ fail 0'),
        out('UI5 linter report:'),
        out('Success! No findings detected.'),
        out('unit/Main: 2 tests, 0 failed, 2 of 2 assertions passed'),
        out('integration/opaTests: 1 tests, 0 failed, 1 of 1 assertions passed'),
        prompt('echo $?'),
        out('0'),
      ],
      marksOf: [],
    }),
  ],
};
