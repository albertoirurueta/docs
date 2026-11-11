// Extracts the world country outlines that the map figures of the monitoring guides draw (Kibana Maps and region map,
// Grafana Geomap) into data/world-110m.json, so that the generator needs no geography package at run time.
//
//   npm i --no-save world-atlas@2.0.2
//   node scripts/monitoring-guides/extract-geo.mjs node_modules/world-atlas/countries-110m.json
//
// Source: world-atlas 2.0.2 (ISC, Mike Bostock), a TopoJSON build of the Natural Earth 1:110m Admin 0 countries, which are
// in the public domain. The input file is treated as untrusted data: it is parsed as JSON and only numbers and the
// country names are read from it. The TopoJSON is decoded here (delta-encoded, quantized arcs) and projected to Web
// Mercator, the projection of the Elastic Maps Service and of the Grafana basemaps, cropped to latitudes -58..84 (no
// Antarctica). Output coordinates are in a 1000-unit-wide box, rounded to 0.1.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const outFile = join(here, 'data', 'world-110m.json');

const W = 1000;
const LAT_TOP = 84;
const LAT_BOTTOM = -58;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, lat)) * Math.PI) / 360));
const K = W / (2 * Math.PI);
const Y0 = mercY(LAT_TOP);
export const HEIGHT = Math.round((Y0 - mercY(LAT_BOTTOM)) * K * 10) / 10;
export const project = ([lon, lat]) => [((lon + 180) / 360) * W, (Y0 - mercY(lat)) * K];

// Rings that cross the antimeridian (Russia, Fiji) jump from +180 to -180 between two points. Unwrap them into one
// continuous ring (east of 180 becomes 180..200); the caller then also draws a copy shifted one map width to the left, and
// the figure crops both to the map, so the far-east sliver shows at the left edge as on a real Web Mercator map.
function unwrap(r) {
  const out = [];
  let shift = 0;
  r.forEach(([lon, lat], i) => {
    if (i) { const d = lon + shift - out[i - 1][0]; if (d < -180) shift += 360; else if (d > 180) shift -= 360; }
    out.push([lon + shift, lat]);
  });
  return out;
}

// ISO 3166-1 numeric -> alpha-2, for the countries the figures colour or mark. Others keep only their numeric id.
const ALPHA2 = {
  '036': 'AU', '076': 'BR', '124': 'CA', '156': 'CN', '250': 'FR', '276': 'DE', '356': 'IN', '360': 'ID', '392': 'JP',
  '484': 'MX', '566': 'NG', '643': 'RU', '710': 'ZA', '724': 'ES', '826': 'GB', '840': 'US', '032': 'AR', '050': 'BD',
  '586': 'PK', '608': 'PH', '704': 'VN', '764': 'TH', '792': 'TR', '364': 'IR', '818': 'EG', '231': 'ET', '180': 'CD',
  '380': 'IT', '616': 'PL', '804': 'UA', '410': 'KR', '458': 'MY', '170': 'CO', '604': 'PE', '152': 'CL', '682': 'SA',
  '012': 'DZ', '404': 'KE', '752': 'SE', '578': 'NO', '528': 'NL', '620': 'PT', '398': 'KZ', '496': 'MN', '554': 'NZ',
};

function decodeArcs(topo) {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;
  return topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
  });
}

function ring(arcs, idx) {
  const pts = [];
  idx.forEach((i, k) => {
    const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    pts.push(...(k ? a.slice(1) : a));
  });
  return pts;
}

const round = (v) => Math.round(v * 10) / 10;
const area = (p) => p.reduce((s, [x, y], i) => { const [x2, y2] = p[(i + 1) % p.length]; return s + x * y2 - x2 * y; }, 0) / 2;
function centroid(p) {
  const a = area(p);
  let cx = 0, cy = 0;
  p.forEach(([x, y], i) => { const [x2, y2] = p[(i + 1) % p.length]; const f = x * y2 - x2 * y; cx += (x + x2) * f; cy += (y + y2) * f; });
  return [cx / (6 * a), cy / (6 * a)];
}

// One SVG path per country: every ring as M...Z, consecutive equal rounded points dropped.
function pathOf(rings) {
  return rings.map((r) => {
    const out = [];
    let last = '';
    for (const [x, y] of r) {
      const s = `${round(x)} ${round(y)}`;
      if (s !== last) out.push(s);
      last = s;
    }
    return out.length >= 3 ? `M${out.join('L')}Z` : '';
  }).join('');
}

export function extract(topo) {
  if (topo?.type !== 'Topology' || !topo.objects?.countries || !Array.isArray(topo.arcs)) throw new Error('not a world-atlas countries TopoJSON');
  const arcs = decodeArcs(topo);
  const countries = [];
  for (const g of topo.objects.countries.geometries) {
    const id = String(g.id ?? '');
    if (id === '010' || !g.arcs) continue; // Antarctica, and geometries without shape
    const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    const projected = polys.map((p) => p.map((r) => unwrap(ring(arcs, r)).map(project)));
    const outer = projected.map((p) => p[0]).filter((r) => r.length >= 3);
    const wrapped = projected.flat().filter((r) => r.some(([x]) => x > W)).map((r) => r.map(([x, y]) => [x - W, y]));
    if (!outer.length) continue;
    const largest = outer.reduce((a, b) => (Math.abs(area(b)) > Math.abs(area(a)) ? b : a));
    let [cx, cy] = centroid(largest);
    if (cx > W) cx -= W;
    const d = pathOf([...projected.flat(), ...wrapped]);
    if (!d) continue;
    countries.push({ id, ...(ALPHA2[id] ? { iso2: ALPHA2[id] } : {}), name: String(g.properties?.name ?? id).slice(0, 60), centroid: [round(cx), round(cy)], d });
  }
  countries.sort((a, b) => a.id.localeCompare(b.id));
  return {
    source: 'world-atlas 2.0.2 countries-110m.json (ISC), from Natural Earth 1:110m Admin 0 countries (public domain)',
    projection: `Web Mercator, latitudes ${LAT_BOTTOM}..${LAT_TOP}`,
    width: W, height: HEIGHT, countries,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const input = process.argv[2];
  if (!input) { console.error('usage: node scripts/monitoring-guides/extract-geo.mjs <path to world-atlas countries-110m.json>'); process.exit(2); }
  const data = extract(JSON.parse(readFileSync(input, 'utf8')));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(data)}\n`);
  console.log(`wrote ${data.countries.length} countries to ${outFile} (${data.width} x ${data.height})`);
}
