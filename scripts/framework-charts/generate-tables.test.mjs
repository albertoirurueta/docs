import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadData } from './generate-charts.mjs';
import { frameworksOf } from './frameworks.mjs';
import { TABLE_PARTIALS, bibliography, citedSources, comparisonTable, generateTables, nameCell, otherMetricsTable, scopeTable } from './generate-tables.mjs';

const data = loadData();

test('framework names link to their site section, else to the official website', () => {
  assert.equal(nameCell({ name: 'Spring Boot', site_xref: 'backend/springboot/index.adoc', website: 'https://spring.io' }), 'xref:backend/springboot/index.adoc[Spring Boot]');
  assert.equal(nameCell({ name: 'Hono', site_xref: '', website: 'https://hono.dev/' }), 'link:++https://hono.dev/++[Hono]');
  assert.equal(nameCell(undefined, 'vanillajs'), '+++vanilla JavaScript (baseline)+++');
});

test('the scope table lists every framework of the page', () => {
  for (const page of ['backend', 'web']) {
    const t = scopeTable(data, page);
    for (const f of frameworksOf(data, page)) assert.ok(t.includes(`[${f.name}]`) || t.includes(f.name), `${page}: ${f.id}`);
  }
});

test('the comparison table has one row per framework and one column per metric', () => {
  for (const page of ['backend', 'web']) {
    const t = comparisonTable(data, page);
    const header = t.split('\n').find((l) => l.startsWith('|Framework'));
    const cols = header.split(' |').length;
    const body = t.split('\n|===\n')[0];
    const cells = t.split('\n').filter((l) => l.startsWith('|') && l !== '|===' && !l.startsWith('|Framework')).length;
    assert.equal(cells, cols * frameworksOf(data, page).length, page);
    assert.ok(body.length > 0);
  }
});

test('the bibliography anchors every source cited on the page and marks unusable ones', () => {
  for (const page of ['backend', 'web']) {
    const b = bibliography(data, page);
    for (const id of citedSources(data, page)) if (data.sources.some((s) => s.id === id)) assert.ok(b.includes(`[[src-${id}]]`), `${page}: ${id}`);
    assert.match(b, /could not be used \(unverified\)/);
  }
});

test('every <<src-id>> link in the partials has an anchor in the same page bibliography', () => {
  const dir = mkdtempSync(join(tmpdir(), 'fw-tables-'));
  try {
    const dirs = { backend: join(dir, 'backend'), web: join(dir, 'web') };
    generateTables(data, dirs);
    for (const page of ['backend', 'web']) {
      const files = readdirSync(dirs[page]);
      const text = files.map((f) => readFileSync(join(dirs[page], f), 'utf8')).join('\n');
      const anchors = new Set([...text.matchAll(/\[\[src-([a-z0-9-]+)\]\]/g)].map((m) => m[1]));
      for (const m of text.matchAll(/<<src-([a-z0-9-]+),/g)) assert.ok(anchors.has(m[1]), `${page}: <<src-${m[1]}>> has no anchor`);
      assert.doesNotMatch(text, /undefined|NaN/, page);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('table generation is deterministic and writes every partial', () => {
  const a = mkdtempSync(join(tmpdir(), 'fw-ta-'));
  const b = mkdtempSync(join(tmpdir(), 'fw-tb-'));
  try {
    const fa = generateTables(data, { backend: join(a, 'backend'), web: join(a, 'web') });
    generateTables(loadData(), { backend: join(b, 'backend'), web: join(b, 'web') });
    const expected = TABLE_PARTIALS.reduce((n, p) => n + (p.pages ? p.pages.length : 2), 0);
    assert.equal(fa.length, expected);
    for (const page of ['backend', 'web']) for (const f of readdirSync(join(a, page))) assert.equal(readFileSync(join(a, page, f), 'utf8'), readFileSync(join(b, page, f), 'utf8'), f);
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('advisory totals never count n/a years as zero', () => {
  const [a, b] = frameworksOf(data, 'backend').map((f) => f.id);
  const adv = (id, period, value) => ({ framework_id: id, metric: 'advisories', period, value });
  const t = otherMetricsTable({ ...data, security: [adv(a, '2021', '2'), adv(a, '2022', 'n/a'), adv(b, '2021', 'n/a')] }, 'backend');
  const cellAfter = (id) => { const lines = t.split('\n'); const i = lines.findIndex((l) => l.includes(data.frameworks.find((f) => f.id === id).name)); return lines[i + 1]; };
  assert.equal(cellAfter(a), '|2 (partial)');
  assert.equal(cellAfter(b), '|n/a');
});

test('a site_xref of n/a is not reported as on this site', () => {
  const f = frameworksOf(data, 'backend').find((x) => x.site_xref);
  const t = scopeTable({ ...data, frameworks: data.frameworks.map((x) => (x.id === f.id ? { ...x, site_xref: 'n/a' } : x)) }, 'backend');
  const lines = t.split('\n');
  const i = lines.findIndex((l) => l.includes(`[${f.name}]`));
  assert.ok(i >= 0);
  assert.equal(lines[i + 7], '|no');
});
