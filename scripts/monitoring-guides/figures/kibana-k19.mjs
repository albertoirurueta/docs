// Figures of the Kibana guide K19, "Console" (guide-console.adoc).
// Facts: guides-brief/kibana-facts.md sections 1 and 14 (Kibana 9.5.6). Verified there: the primary navigation with Dev
// Tools in the Management section, and the Dev Tools Console page (top tabs Console, Search Profiler, Grok Debugger and
// Painless Lab, sub-tabs Shell, History and Config, the toolbar Export requests, Import requests, Keyboard shortcuts and
// Help, the editor with line number 1, the button that sends a request, the Request options wrench, Clear this input and
// Variables at the bottom, and the empty output message). NOT VERIFIED there (drawn generically): the Request options menu,
// the Variables editor, the History list, autocompletion, and every response. The response bodies are sample data in the
// shape of the Elasticsearch and Kibana APIs. Callout numbers are the step numbers of the page; a figure shows the screen
// as the step starts, with the control to act on highlighted.
import { FW, lbl, box, btn, ico, mark, marks, menu, kibanaFrame } from '../lib/shells.mjs';

const figures = [];
const K = (t) => ({ t, kind: 'keyword' });
const S = (t) => ({ t, kind: 'string' });
const L = (t) => ({ t, kind: 'label' });
const N = (t) => ({ t, kind: 'number' });
const P = (t) => ({ t });

// The Dev Tools page. `input`/`output` are editor lines; `sub` the active sub-tab; `children(geo)` adds callouts or popovers.
function consoleScreen({ h = 520, sub = 0, input = [], output, hot, children, history, flyout }) {
  const fr = kibanaFrame({ h, crumbs: ['Dev Tools'] });
  const geo = { ...fr.geo };
  const n = [
    { block: 'tabs', x: 16, y: 104, w: 1048, tabs: ['Console', 'Search Profiler', 'Grok Debugger', 'Painless Lab'], active: 0 },
    { block: 'tabs', x: 16, y: 146, w: 330, tabs: ['Shell', 'History', 'Config'], active: sub },
  ];
  geo.subTabs = { Shell: { x: 16, y: 146, w: 60, h: 32 }, History: { x: 76, y: 146, w: 78, h: 32 } };
  let rx = FW - 16;
  [['Help', 70], ['Keyboard shortcuts', 160], ['Import requests', 134], ['Export requests', 132]].forEach(([t, w]) => { rx -= w; n.push(btn(rx, 146, w, t)); rx -= 6; });
  const top = 194, ph = h - top - 16;
  const IX = 16, IW = 600, OX = 628, OW = 436;
  if (sub === 1) {
    n.push(box(16, top, 1048, ph, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push(...history.nodes);
    Object.assign(geo, history.geo);
  } else {
    n.push(box(IX, top, IW, ph, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push(box(OX, top, OW, ph, { fill: 'surface', stroke: 'border', radius: 6 }));
    geo.input = { x: IX + 8, y: top + 8, w: IW - 16, h: ph - 60 };
    n.push({ block: 'queryEditor', x: IX + 8, y: top + 8, w: IW - 16, h: ph - 60, lines: input.length ? input : [[P('')]], lineNumbers: true });
    geo.play = { x: IX + IW - 80, y: top + 14, w: 24, h: 24 };
    n.push(box(geo.play.x, geo.play.y, 24, 24, { fill: 'threshold.green', radius: 4 }), ico(geo.play.x + 4, geo.play.y + 4, 'play', 'textOnPrimary'));
    geo.wrench = { x: IX + IW - 48, y: top + 14, w: 24, h: 24 };
    n.push(ico(geo.wrench.x + 4, geo.wrench.y + 4, 'gear', 'textMuted'));
    geo.clear = { x: IX + 8, y: top + ph - 44, w: 150, h: 32 };
    geo.vars = { x: IX + 166, y: top + ph - 44, w: 110, h: 32 };
    n.push(btn(geo.clear.x, geo.clear.y, 150, 'Clear this input'), btn(geo.vars.x, geo.vars.y, 110, 'Variables'));
    if (output) n.push({ block: 'queryEditor', x: OX + 8, y: top + 8, w: OW - 16, h: ph - 16, lines: output, lineNumbers: true });
    else {
      n.push(lbl(OX + OW / 2, top + ph / 2 - 20, 'Enter a new request', { size: 'title', weight: 600, anchor: 'middle', box: 400 }));
      n.push(lbl(OX + OW / 2, top + ph / 2 + 4, 'When you run a request in the input panel,', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 400 }));
      n.push(lbl(OX + OW / 2, top + ph / 2 + 22, 'you will see the output response here.', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 400 }));
      n.push(lbl(OX + OW / 2, top + ph / 2 + 48, 'Want to learn more? Read the Console docs', { size: 'small', tone: 'link', anchor: 'middle', box: 400 }));
    }
    geo.output = { x: OX, y: top, w: OW, h: ph };
  }
  void hot;
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

const COUNT = [[K('GET'), P(' logs-generic.otel-default/_count')]];
const SEARCH_ONE = [[K('GET'), P(' logs-generic.otel-default/_search')], [P('{"size":2,"query":{"match":{"attributes.status":200}}}')]];
const SEARCH_INDENTED = [
  [K('GET'), P(' logs-generic.otel-default/_search')], [P('{')], [P('  '), L('"size"'), P(': '), N('2'), P(',')], [P('  '), L('"query"'), P(': {')],
  [P('    '), L('"match"'), P(': {')], [P('      '), L('"attributes.status"'), P(': '), N('200')], [P('    }')], [P('  }')], [P('}')],
];
const VAR_COUNT = [[K('GET'), P(' ${index}/_count')]];
const COUNT_OUT = [[P('{')], [P('  '), L('"count"'), P(': '), N('1534'), P(',')], [P('  '), L('"_shards"'), P(': {')], [P('    '), L('"total"'), P(': '), N('1'), P(',')], [P('    '), L('"successful"'), P(': '), N('1'), P(',')], [P('    '), L('"skipped"'), P(': '), N('0'), P(',')], [P('    '), L('"failed"'), P(': '), N('0')], [P('  }')], [P('}')]];

// 01: the primary navigation, Dev Tools (steps 1 and 2)
{
  const fr = kibanaFrame({ h: 650, crumbs: ['Home'] });
  const items = [
    { label: 'Home', icon: 'home' }, { label: 'Analytics' }, { label: 'Elasticsearch' }, { label: 'Observability' }, { label: 'Security' }, { label: 'Management' },
    { label: 'Dev Tools', indent: 1 }, { label: 'Workflows', indent: 1 }, { label: 'Integrations', indent: 1 }, { label: 'Fleet', indent: 1 }, { label: 'Osquery', indent: 1 },
    { label: 'Stack Monitoring', indent: 1 }, { label: 'Cloud Connect', indent: 1 }, { label: 'Stack Management', indent: 1 }, { label: 'Streams', indent: 1 },
  ];
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 248, h: 534, items },
    ...marks([[fr.geo.menu, 1], [{ x: 8, y: 96 + 8 + 6 * 34, w: 232, h: 32 }, 2]]),
  );
  figures.push({
    id: '01-primary-navigation',
    alt: 'Kibana 9.5 with the primary navigation open and the Management section listing Dev Tools, Workflows, Integrations, Fleet, Osquery, Stack Monitoring, Cloud Connect, Stack Management and Streams; callout 1 marks the menu button of the second bar and callout 2 marks Dev Tools',
    width: FW, height: 650, nodes: fr.nodes,
  });
}

// 02: the empty Console (step 3)
{
  const c = consoleScreen({ children: (g) => mark(g.input, 3) });
  figures.push({
    id: '02-console-empty',
    alt: 'Dev Tools Console of Kibana 9.5 on the Shell sub-tab with an empty editor on the left and the message Enter a new request in the output pane on the right; the editor is marked by callout 3',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 03: the first request typed (steps 4 and 5)
{
  const c = consoleScreen({ input: COUNT, children: (g) => marks([[{ x: g.input.x, y: g.input.y, w: g.input.w - 100, h: 30 }, 4], [g.play, 5]]) });
  figures.push({
    id: '03-count-request',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET logs-generic.otel-default/_count typed on line 1 and marked by callout 4; the green button that sends the request is marked by callout 5',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 04: a request with a one-line body (steps 7 and 8)
{
  const c = consoleScreen({ input: SEARCH_ONE, output: COUNT_OUT, children: (g) => marks([[{ x: g.input.x, y: g.input.y, w: g.input.w - 100, h: 30 }, 7], [{ x: g.input.x, y: g.input.y + 30, w: g.input.w, h: 30 }, 8]]) });
  figures.push({
    id: '04-search-one-line',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET logs-generic.otel-default/_search on line 1, marked by callout 7, and its JSON body written on one line 2, marked by callout 8; the output pane still shows the previous response with a count',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 05: the Request options menu (step 9)
{
  const c = consoleScreen({
    input: SEARCH_ONE, output: COUNT_OUT,
    children: (g) => {
      const m = menu({ x: g.wrench.x - 150, y: g.wrench.y + 28, w: 190, items: ['Open documentation', 'Auto indent', 'Copy as cURL'], hot: 1 });
      return [...mark(g.wrench, 9), ...m.nodes, ...mark(m.rows[1], 9).slice(0, 1)];
    },
  });
  figures.push({
    id: '05-request-options',
    alt: 'Dev Tools Console of Kibana 9.5 with the Request options wrench marked by callout 9 and its menu open; the entry that indents the request, Auto indent, is highlighted',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 06: the indented request (step 10)
{
  const c = consoleScreen({ h: 560, input: SEARCH_INDENTED, output: COUNT_OUT, children: (g) => mark(g.play, 10) });
  figures.push({
    id: '06-indented-request',
    alt: 'Dev Tools Console of Kibana 9.5 with the search request indented over nine lines, the keys size and query and the match on attributes.status with 200; the green button that sends the request is marked by callout 10',
    width: FW, height: 560, nodes: c.nodes,
  });
}

// 07: the response with hits (step 11)
{
  const out = [
    [P('{')], [P('  '), L('"took"'), P(': '), N('3'), P(',')], [P('  '), L('"hits"'), P(': {')], [P('    '), L('"total"'), P(': {')], [P('      '), L('"value"'), P(': '), N('1488'), P(',')],
    [P('      '), L('"relation"'), P(': '), S('"eq"')], [P('    },')], [P('    '), L('"hits"'), P(': [')], [P('      { '), L('"_source"'), P(': {')], [P('        '), L('"body"'), P(': {'), L('"text"'), P(': '), S('"Served /api/search"')],
    [P('        }, '), L('"attributes"'), P(': {'), L('"status"'), P(': '), N('200'), P('}')], [P('      } },')], [P('      '), P('...')], [P('    ]')], [P('  }')], [P('}')],
  ];
  const c = consoleScreen({ h: 560, input: SEARCH_INDENTED, output: out, children: (g) => mark({ x: g.output.x + 8, y: g.output.y + 8, w: g.output.w - 16, h: 250 }, 11) });
  figures.push({
    id: '07-search-response',
    alt: 'Dev Tools Console of Kibana 9.5 with the response of the search in the output pane: took, hits with a total value and a list of documents whose body text is Served /api/search and whose attributes.status is 200; the response is marked by callout 11',
    width: FW, height: 560, nodes: c.nodes,
  });
}

// 08: the Variables button (step 12)
{
  const c = consoleScreen({ input: COUNT, output: COUNT_OUT, children: (g) => mark(g.vars, 12) });
  figures.push({
    id: '08-variables-button',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET logs-generic.otel-default/_count and its response; the Variables button at the bottom of the editor is marked by callout 12',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 09: the variables editor (steps 13 and 14)
{
  const fx = 640, fw = 424;
  const c = consoleScreen({
    input: COUNT, output: COUNT_OUT,
    children: () => {
      const name = { x: fx + 20, y: 262, w: 130, h: 32 };
      const val = { x: fx + 192, y: 262, w: 168, h: 32 };
      const save = { x: fx + fw - 20 - 80, y: 440, w: 80, h: 32 };
      return [
        { block: 'flyout', x: fx, y: 194, w: fw, h: 326, title: 'Variables' },
        lbl(fx + 20, 254, 'Variable name', { size: 'small', weight: 500, box: 130 }), lbl(fx + 162, 254, 'Value', { size: 'small', weight: 500, box: 160 }),
        { block: 'field', x: fx + 20, y: 262, w: 130, value: 'index' }, { block: 'field', x: fx + 162, y: 262, w: 242, value: 'logs-generic.otel-default' },
        btn(fx + 20, 320, 140, 'Add variable', 'secondary', 'plus'),
        btn(save.x - 92, 440, 84, 'Cancel'), btn(save.x, save.y, 80, 'Save', 'primary'),
        ...marks([[name, 13], [save, 14]]),
      ];
    },
  });
  figures.push({
    id: '09-variables-editor',
    alt: 'Variables editor of the Dev Tools Console of Kibana 9.5 with one variable: the name index is marked by callout 13 and its value is the index logs-generic.otel-default; the Save button is marked by callout 14',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 10: a request that uses the variable (step 15)
{
  const c = consoleScreen({ input: VAR_COUNT, output: COUNT_OUT, children: (g) => [...mark({ x: g.input.x, y: g.input.y, w: g.input.w - 100, h: 30 }, 15), ...mark(g.play, 16)] });
  figures.push({
    id: '10-use-variable',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET and the variable index between the characters dollar and braces in front of the path _count, marked by callout 15; the green button that sends the request is marked by callout 16',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 11: the History sub-tab (steps 17 and 18)
{
  const hist = {
    nodes: [
      lbl(32, 238, 'History', { size: 'title', weight: 600, box: 300 }),
      { block: 'table', x: 32, y: 252, w: 1016, columns: [{ title: 'Request', w: 6 }, { title: 'Time', w: 2 }], rows: [['GET ${index}/_count', '10:52:18'], ['GET logs-generic.otel-default/_search', '10:49:03'], ['GET logs-generic.otel-default/_count', '10:44:41']], selectedRow: 0 },
    ],
    geo: { entry: { x: 32, y: 282, w: 1016, h: 30 } },
  };
  const c = consoleScreen({ sub: 1, history: hist, children: (g) => marks([[g.subTabs.History, 17], [g.entry, 18]]) });
  figures.push({
    id: '11-history',
    alt: 'History sub-tab of the Dev Tools Console of Kibana 9.5 listing three earlier requests with the time they were sent; the History sub-tab is marked by callout 17 and the first request of the list by callout 18',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 12: Copy as cURL (step 20)
{
  const c = consoleScreen({
    input: COUNT, output: COUNT_OUT,
    children: (g) => {
      const m = menu({ x: g.wrench.x - 150, y: g.wrench.y + 28, w: 190, items: ['Open documentation', 'Auto indent', 'Copy as cURL'], hot: 2 });
      return [...m.nodes, ...mark(m.rows[2], 20)];
    },
  });
  figures.push({
    id: '12-copy-as-curl',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET logs-generic.otel-default/_count and the Request options menu open; the entry that copies the request as a cURL command, Copy as cURL, is marked by callout 20',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 13: a Kibana API request (steps 22 and 23)
{
  const c = consoleScreen({ input: [[K('GET'), P(' kbn:/api/status')]], children: (g) => marks([[{ x: g.input.x, y: g.input.y, w: g.input.w - 100, h: 30 }, 22], [g.play, 23]]) });
  figures.push({
    id: '13-kbn-request',
    alt: 'Dev Tools Console of Kibana 9.5 with the request GET kbn:/api/status typed on line 1 and marked by callout 22; the green button that sends the request is marked by callout 23',
    width: FW, height: 520, nodes: c.nodes,
  });
}

// 14: the Kibana API response (What you build)
{
  const out = [
    [P('{')], [P('  '), L('"name"'), P(': '), S('"kibana"'), P(',')], [P('  '), L('"version"'), P(': {')], [P('    '), L('"number"'), P(': '), S('"9.5.6"'), P(',')], [P('    '), L('"build_flavor"'), P(': '), S('"traditional"')],
    [P('  },')], [P('  '), L('"status"'), P(': {')], [P('    '), L('"overall"'), P(': {'), L('"level"'), P(': '), S('"available"'), P('}')], [P('  }')], [P('}')],
  ];
  const c = consoleScreen({ input: [[K('GET'), P(' kbn:/api/status')]], output: out });
  figures.push({
    id: '14-result',
    alt: 'Dev Tools Console of Kibana 9.5 after sending GET kbn:/api/status: the output pane shows the answer of the Kibana API with the name kibana, the version number 9.5.6 and the overall status level available',
    width: FW, height: 520, nodes: c.nodes,
  });
}

export default { product: 'kibana', guide: 'k19', figures };
