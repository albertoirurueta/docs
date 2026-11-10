// Reads the logos named in manifest.mjs and ide-manifest.mjs out of the Simple Icons and Devicon npm packages and writes
// logos.json (path data, source, licence). The downloaded SVG files are untrusted data: only the `d`
// attribute of <path> elements is read (with regular expressions) and validated, nothing is executed.
//
//   mkdir /tmp/icons && cd /tmp/icons && npm i --ignore-scripts simple-icons@16.37.0 devicon@2.18.0
//   node scripts/cards/extract-logos.mjs /tmp/icons/node_modules
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cards } from './manifest.mjs';
import { ideCards } from './ide-manifest.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = process.argv[2];
if (!root) {
  console.error('usage: node extract-logos.mjs <node_modules dir containing simple-icons and devicon>');
  process.exit(1);
}
const version = (pkg) => JSON.parse(readFileSync(join(root, pkg, 'package.json'), 'utf8')).version;
const PATH_DATA = /^[0-9a-zA-Z .,\-+]+$/;

function paths(svg) {
  const found = [...svg.matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)].map((m) => m[1].trim());
  if (!found.length) throw new Error('no path data');
  if (/<(circle|rect|ellipse|polygon|polyline|line|image|text|use|mask|clipPath|linearGradient)\b/.test(svg)) {
    throw new Error('unsupported element');
  }
  if (/\btransform=/.test(svg)) throw new Error('transform not supported');
  for (const d of found) if (!PATH_DATA.test(d)) throw new Error('unexpected characters in path data');
  return found;
}

const logos = {};
for (const key of new Set([...cards, ...ideCards].map((c) => c.logo).filter((l) => !l.startsWith('gl:')))) {
  const [src, slug] = key.split(':');
  let file, meta;
  if (src === 'si') {
    file = join(root, 'simple-icons', 'icons', `${slug}.svg`);
    meta = { source: 'Simple Icons', license: 'CC0-1.0', version: version('simple-icons'), viewBox: 24 };
  } else {
    const variant = ['plain', 'original', 'line'].find((v) => existsSync(join(root, 'devicon', 'icons', slug, `${slug}-${v}.svg`)));
    if (!variant) throw new Error(`no devicon variant for ${slug}`);
    file = join(root, 'devicon', 'icons', slug, `${slug}-${variant}.svg`);
    meta = { source: 'Devicon', license: 'MIT', version: version('devicon'), viewBox: 128 };
  }
  logos[key] = { ...meta, file: file.slice(root.length + 1), paths: paths(readFileSync(file, 'utf8')) };
}
writeFileSync(join(here, 'logos.json'), JSON.stringify(logos, null, 1) + '\n');
console.log(`wrote ${Object.keys(logos).length} logos`);
