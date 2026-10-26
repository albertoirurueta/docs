import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  parseCsv, parseCsvRows, isMissing, toNumber, niceScale, linearScale, escapeXml, formatTick, loadData,
  renderLineChart, renderBarChart, renderScatterChart, renderRadarChart, renderChart, generateCharts, FILE_PREFIX,
} from './generate-charts.mjs';

/** Minimal well-formedness check: balanced tags, no stray ampersands, required elements. */
function assertWellFormed(svg) {
  assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
  assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
  assert.doesNotMatch(svg, /prefers-color-scheme/);
  assert.doesNotMatch(svg, /currentColor/);
  assert.match(svg, /class="legend"/);
  assert.ok(svg.trimEnd().endsWith('</svg>'));
  assert.doesNotMatch(svg, /&(?!amp;|lt;|gt;|quot;|apos;)/);
  const stack = [];
  for (const m of svg.replace(/<style>[\s\S]*?<\/style>/g, '').matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, close, name, , self] = m;
    if (self) continue;
    if (close) assert.equal(stack.pop(), name); else stack.push(name);
  }
  assert.deepEqual(stack, []);
  assert.doesNotMatch(svg, /NaN|undefined|Infinity/);
}

test('parseCsv handles quotes, commas, escaped quotes, CRLF and BOM', () => {
  const rows = parseCsv('﻿a,b,c\r\n1,"x, y","say ""hi"""\r\n2,,\n');
  assert.deepEqual(rows, [{ a: '1', b: 'x, y', c: 'say "hi"' }, { a: '2', b: '', c: '' }]);
});

test('parseCsvRows keeps newlines inside quotes and skips blank lines', () => {
  assert.deepEqual(parseCsvRows('a,b\n"l1\nl2",x\n\n'), [['a', 'b'], ['l1\nl2', 'x']]);
  assert.deepEqual(parseCsv(''), []);
});

test('n/a and empty values are missing and never become zero', () => {
  for (const v of ['n/a', 'N/A', '', '  ', null, undefined]) { assert.equal(isMissing(v), true); assert.equal(toNumber(v), null); }
  assert.equal(toNumber('0'), 0);
  assert.equal(toNumber('1,234.5'), 1234.5);
  assert.equal(toNumber('abc'), null);
});

test('niceScale produces round ticks covering the data', () => {
  const s = niceScale([3, 97], { zero: true });
  assert.equal(s.min, 0);
  assert.ok(s.max >= 97);
  assert.deepEqual(s.ticks, [0, 20, 40, 60, 80, 100]);
  assert.deepEqual(niceScale([null, undefined]).ticks.length > 1, true);
  const flat = niceScale([5, 5]);
  assert.ok(flat.min < 5 && flat.max > 5);
  assert.deepEqual(niceScale([0, 0]).max, 1);
  assert.equal(niceScale([1.5, 2.5]).min <= 1.5, true);
});

test('linearScale maps the domain and handles a degenerate one', () => {
  const f = linearScale(0, 10, 100, 200);
  assert.equal(f(0), 100); assert.equal(f(5), 150); assert.equal(f(10), 200);
  assert.equal(linearScale(1, 1, 0, 10)(1), 5);
});

test('escapeXml and formatTick', () => {
  assert.equal(escapeXml(`C++ & <C#> "x" 'y'`), 'C++ &amp; &lt;C#&gt; &quot;x&quot; &apos;y&apos;');
  assert.equal(formatTick(2500000), '2.5M');
  assert.equal(formatTick(12000), '12k');
  assert.equal(formatTick(0.5), '0.5');
});

test('line chart is well formed and leaves n/a as gaps', () => {
  const svg = renderLineChart({
    id: 't', title: 'Line & test', desc: 'd', xLabel: 'Year', yLabel: 'Share (%)',
    series: [
      { name: 'A', points: [{ x: 2000, y: 1 }, { x: 2001, y: 'n/a' }, { x: 2002, y: 3 }, { x: 2003, y: 4 }] },
      { name: 'B', points: [{ x: 2000, y: 2 }, { x: 2001, y: 2 }] },
    ],
  });
  assertWellFormed(svg);
  assert.match(svg, /Line &amp; test/);
  assert.match(svg, /Year/); assert.match(svg, /Share \(%\)/);
  // series A: the point at 2000 is isolated (marker only), 2002-2003 form the only path for A.
  assert.equal((svg.match(/<path class="l0"/g) ?? []).length, 1);
  assert.equal((svg.match(/class="m0"/g) ?? []).length, 3 + 1); // 3 plotted points + legend marker
});

test('bar chart shows n/a rows without a bar', () => {
  const svg = renderBarChart({
    id: 'b', title: 'Bars', desc: 'd', xLabel: 'Ratio (x)', yLabel: 'Language',
    items: [{ label: 'C', value: 1 }, { label: 'Lua', value: 'n/a' }, { label: 'Go', value: 2.5 }],
  });
  assertWellFormed(svg);
  assert.equal((svg.match(/<rect class="f0"/g) ?? []).length, 2);
  assert.match(svg, /class="na"[^>]*>n\/a</);
});

test('scatter chart skips points with a missing coordinate', () => {
  const svg = renderScatterChart({
    id: 's', title: 'Scatter', desc: 'd', xLabel: 'X (u)', yLabel: 'Y (u)',
    series: [{ name: 'G', points: [{ x: 1, y: 2, label: 'a' }, { x: 'n/a', y: 3, label: 'gone' }, { x: 2, y: '', label: 'gone2' }, { x: 3, y: 4, label: 'b' }] }],
  });
  assertWellFormed(svg);
  assert.doesNotMatch(svg, /gone/);
  assert.match(svg, />a</); assert.match(svg, />b</);
});

test('radar chart closes complete series and breaks incomplete ones', () => {
  const svg = renderRadarChart({
    id: 'r', title: 'Radar', desc: 'd', axes: ['A', 'B', 'C', 'D'],
    series: [{ name: 'full', values: [1, 2, 3, 4] }, { name: 'gap', values: [5, 'n/a', 7, 8] }],
  });
  assertWellFormed(svg);
  assert.equal((svg.match(/<path class="a0"/g) ?? []).length, 1);
  assert.equal((svg.match(/<path class="a1"/g) ?? []).length, 0);
  assert.equal((svg.match(/<path class="l1"/g) ?? []).length, 2); // C-D and D-A only
  assert.throws(() => renderRadarChart({ id: 'x', title: 't', desc: 'd', axes: ['a', 'b'], series: [] }), /3 axes/);
});

test('renderChart dispatches and rejects unknown types or missing fields', () => {
  assert.throws(() => renderChart({ type: 'pie', id: 'p' }), /unknown chart type/);
  assert.throws(() => renderLineChart({ id: 'x' }), /missing "title"/);
  const svg = renderChart({ type: 'bar', id: 'b', title: 't', desc: 'd', xLabel: 'x', yLabel: 'y', items: [{ label: 'a', value: 1 }] });
  assertWellFormed(svg);
});

test('generateCharts writes prefixed files and accepts builder functions', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lang-charts-'));
  try {
    const files = generateCharts([
      { type: 'bar', id: 'one', title: 't', desc: 'd', xLabel: 'x', yLabel: 'y', items: [{ label: 'a', value: 1 }] },
      (data) => ({ type: 'bar', id: 'two', title: 't', desc: 'd', xLabel: 'x', yLabel: 'y', items: data.languages.slice(0, 3).map((l) => ({ label: l.name, value: l.first_appeared })) }),
    ], loadData(), join(dir, 'out'));
    assert.equal(files.length, 2);
    assert.deepEqual(readdirSync(join(dir, 'out')).sort(), [`${FILE_PREFIX}one.svg`, `${FILE_PREFIX}two.svg`]);
    assertWellFormed(readFileSync(files[1], 'utf8'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('real data files load and keep n/a as missing', () => {
  const data = loadData();
  assert.ok(data.languages.length >= 21);
  const na = data.ecosystem.filter((r) => r.value === 'n/a');
  assert.ok(na.length > 0);
  assert.ok(na.every((r) => toNumber(r.value) === null));
  const hist = data['popularity-history'].filter((r) => r.language_id === 'java' && r.source === 'tiobe');
  const svg = renderLineChart({
    id: 'h', title: 'Java TIOBE', desc: 'd', xLabel: 'Year', yLabel: 'Rating (%)',
    series: [{ name: 'Java', points: hist.map((r) => ({ x: r.year, y: r.value })) }],
  });
  assertWellFormed(svg);
});

test('square markers take their series colour from the class, not an inline style', () => {
  const svg = renderLineChart({
    id: 'sq', title: 'T', desc: 'D', xLabel: 'Year', yLabel: 'Value',
    series: [{ name: 'A', points: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }, { name: 'B', points: [{ x: 1, y: 2 }, { x: 2, y: 3 }] }],
  });
  const squares = [...svg.matchAll(/<rect class="m1"[^>]*>/g)].map((m) => m[0]);
  assert.ok(squares.length > 0);
  for (const s of squares) assert.doesNotMatch(s, /style=/);
  assert.match(svg, /\.m1\{fill:var\(--s1\)/);
});

test('the CLI rejects --out without a directory', async () => {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, [new URL('./generate-charts.mjs', import.meta.url).pathname, '--out'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Usage:/);
});

test('legend columns are wide enough for the longest name', () => {
  const long = 'C and C++ (combined entry)';
  const svg = renderLineChart({
    id: 'lg', title: 'T', desc: 'D', xLabel: 'X', yLabel: 'Y',
    series: [{ name: long, points: [{ x: 1, y: 1 }] }, { name: 'B', points: [{ x: 1, y: 2 }] }],
  });
  const xs = [...svg.matchAll(/<text x="(\d+(?:\.\d+)?)" y="[\d.]+">([^<]+)<\/text>/g)].filter((m) => m[2] === long.replace(/&/g, '&amp;') || m[2] === 'B').map((m) => Number(m[1]));
  assert.equal(xs.length, 2);
  assert.ok(xs[1] - xs[0] >= long.length * 6.6, `${xs}`);
});
