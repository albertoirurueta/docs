// Figures of "ABAP Guide: Set Up a Local ABAP Playground" (programming-languages/abap/guide-set-up-a-local-abap-playground.adoc).
// Facts: the project of the guide was built from nothing in a copy outside the repository on 2026-11-13 (Node.js 24.21.0,
// npm 11.19.0, open-abap transpiler 2.14.30, runtime 2.14.30, abaplint 2.120.103, open-abap-core a9acc41). The configuration
// files and sources shown are the files of modules/ROOT/examples/abap-lab; the package.json is the minimal one of the page
// (PACKAGE_JSON below must stay equal to the listing on the page). Terminal text is what the commands printed. The step numbers
// are the callout numbers of the page. Colours are theme tokens only. No screen of the VS Code extension is drawn: nobody ran it.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab');
const labFile = (f) => readFileSync(join(lab, f), 'utf8');

const PACKAGE_JSON = `{
  "name": "abap-lab",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "transpile": "abap_transpile abap_transpile.json",
    "test": "npm run transpile && node output/index.mjs",
    "run:hello": "npm run transpile && node output/project/zhello.prog.mjs",
    "lint": "abaplint abaplint.json"
  },
  "devDependencies": {
    "@abaplint/cli": "2.120.103",
    "@abaplint/database-sqlite": "2.14.12",
    "@abaplint/runtime": "2.14.30",
    "@abaplint/transpiler-cli": "2.14.30"
  },
  "engines": {
    "node": ">=22.12"
  }
}
`;

const entry = (label, indent, extra = {}) => ({ label, indent, ...extra });
const explorer = ({ active, config = true, sources = false }) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  ...(sources ? [
    entry('src', 1, { folder: true, open: true }),
    ...['zcl_greeter.clas.abap', 'zcl_greeter.clas.testclasses.abap', 'zcl_greeter.clas.xml', 'zhello.prog.abap', 'zhello.prog.xml'].map((l) => entry(l, 2)),
  ] : []),
  ...(config ? [entry('node_modules', 1, { folder: true, open: false })] : []),
  ...(config ? ['abap_transpile.json', 'abaplint.json', 'package.json', 'setup.mjs'] : ['package.json']).map((l) => entry(l, 1)),
].map((e) => (e.label === active ? { ...e, active: true } : e));

function editor({ id, alt, file, code, h, tree, marksFor }) {
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorer({ ...tree, active: file }), tabs: [file], activeTab: 0, code });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function terminal({ id, alt, lines, markLines }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = markLines.flatMap(([i, n, span = 1]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const txt = (str) => ({ str, tone: 'text' });
const lib = [txt('5 files added from source'), txt('727 files added from lib, 1.3 seconds'), txt('Output files: 927 written')];

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'set-up-a-local-abap-playground',
  figures: [
    terminal({
      id: '01-node-version',
      alt: 'Terminal with the command node --version, which prints v24.21.0, and npm --version, which prints 11.19.0; callout 1 marks the node command',
      lines: [prompt('node --version'), txt('v24.21.0'), prompt('npm --version'), txt('11.19.0')],
      markLines: [[0, 1, 2]],
    }),
    editor({
      id: '02-package-json', file: 'package.json', h: 520, code: plainCode(PACKAGE_JSON), tree: { config: false },
      alt: 'Visual Studio Code with the empty abap-lab folder holding only the new file package.json, which lists the four scripts transpile, test, run:hello and lint and the four abaplint packages; callout 3 marks package.json in the explorer',
      marksFor: (g) => [[g['entry:package.json'], 3]],
    }),
    editor({
      id: '03-config-files', file: 'abap_transpile.json', h: 520, code: plainCode(labFile('abap_transpile.json')), tree: {},
      alt: 'Visual Studio Code with abap_transpile.json open: it names the src folder, the output folder, the open-abap-core library and the setup module; callout 5 marks abap_transpile.json, callout 6 marks setup.mjs and callout 7 marks abaplint.json in the explorer',
      marksFor: (g) => [[g['entry:abap_transpile.json'], 5], [g['entry:setup.mjs'], 6], [g['entry:abaplint.json'], 7]],
    }),
    editor({
      id: '04-sources', file: 'zhello.prog.abap', h: 420, code: abapCode(labFile('src/zhello.prog.abap')), tree: { sources: true },
      alt: 'Visual Studio Code with the src folder holding the report zhello and the class zcl_greeter, and the report file zhello.prog.abap is open and shows its single WRITE statement; callout 8 marks the report file and callout 9 marks the test file of the class in the explorer',
      marksFor: (g) => [[g['entry:zhello.prog.abap'], 8], [g['entry:zcl_greeter.clas.testclasses.abap'], 9]],
    }),
    terminal({
      id: '05-npm-test',
      alt: 'Terminal after npm test: the transpiler counts its source and library files and reports the output files written (one example run), and the test run prints ZCL_GREETER: running ltcl_greeter->greets_by_name; callout 10 marks the command',
      lines: [prompt('npm test'), ...lib, txt('ZCL_GREETER: running ltcl_greeter->greets_by_name')],
      markLines: [[0, 10]],
    }),
    terminal({
      id: '06-lint',
      alt: 'Terminal after npm run lint: abaplint prints its version and configuration lines and ends with abaplint: 0 issue(s) found, 5 file(s) analyzed; callout 11 marks the command',
      lines: [prompt('npm run lint'), txt('abaplint 2.120.103'), txt('Using config: abaplint.json'), txt('Clone: https://github.com/open-abap/open-abap-core'), { str: 'abaplint: 0 issue(s) found, 5 file(s) analyzed', tone: 'state.normal.bg' }],
      markLines: [[0, 11]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal showing the result of the guide: the command npm run run:hello followed by the line Hello from the local ABAP playground',
      lines: [prompt('npm run run:hello'), ...lib, { str: 'Hello from the local ABAP playground', tone: 'state.normal.bg' }],
      markLines: [],
    }),
  ],
};
