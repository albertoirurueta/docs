import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSheet, pageCount, renderHtml, tints, validate } from './render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const attachments = resolve(here, '../../modules/ROOT/attachments');
const pagesDir = resolve(here, '../../modules/ROOT/pages');
const names = readdirSync(join(here, 'sheets')).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4));

test('every sheet module is valid and renders to HTML with its title and boxes', async () => {
  assert.ok(names.length > 0);
  for (const name of names) {
    const sheet = await loadSheet(name);
    const html = renderHtml(sheet);
    assert.ok(html.includes('size: A4'));
    assert.equal((html.match(/<section /g) || []).length, sheet.boxes.length, name);
  }
});

test('validate rejects bad sheets', () => {
  const ok = { file: 'x-cheat-sheet.pdf', title: 't', subtitle: 's', footer: 'f',
    boxes: Object.keys(tints).map((color) => ({ title: color, color, items: [{ label: 'l', code: 'c' }] })) };
  validate(ok, 'ok');
  assert.throws(() => validate({ ...ok, file: 'X.pdf' }, 'bad'), /file name/);
  assert.throws(() => validate({ ...ok, boxes: ok.boxes.slice(0, 3) }, 'bad'), /6 to 12/);
  const long = { ...ok, boxes: [...ok.boxes.slice(1), { title: 'b', color: 'teal', items: [{ label: 'l', code: 'x'.repeat(45) }] }] };
  assert.throws(() => validate(long, 'bad'), /44/);
});

test('every sheet has its one-page PDF in attachments and a page linking it', async () => {
  const links = new Set();
  const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.adoc')) for (const m of readFileSync(p, 'utf8').matchAll(/attachment\$([\w.-]+\.pdf)/g)) links.add(m[1]);
  });
  walk(pagesDir);
  for (const name of names) {
    const { file } = await loadSheet(name);
    assert.ok(existsSync(join(attachments, file)), `${file} missing: run npm run cheat-sheets`);
    assert.equal(pageCount(readFileSync(join(attachments, file))), 1, `${file} must be one page`);
    assert.ok(links.has(file), `${file} is not linked from any page`);
  }
});
