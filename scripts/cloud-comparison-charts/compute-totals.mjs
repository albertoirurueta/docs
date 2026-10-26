// Computes the monthly total of each reference architecture for each provider.
//
// Inputs (data/):
//   pricing.csv                 unit prices, one row per provider, region and building block
//   reference-architectures.csv architecture,line,pricing_id,quantity,unit
// Output (data/):
//   reference-totals.csv        architecture,line,provider,pricing_id,quantity,unit,unit_price_usd,line_usd,
//                               and one total row per architecture and provider (line = TOTAL)
//
// A pricing_id in reference-architectures.csv is the provider-neutral key; the row of pricing.csv used for a
// provider has the id "<provider>-<pricing_id>" (for example aws-vm-us-east). All totals use list prices for
// the US East region, with no free allowance, discount or tax. Run: node compute-totals.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, 'data');

export const PROVIDERS = ['aws', 'azure', 'gcp'];

/** Parses CSV text with quoted fields into an array of objects keyed by the header row. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function toCsv(columns, records) {
  const esc = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(','), ...records.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
}

/**
 * Computes line items and totals.
 * @param {Array<object>} pricing rows of pricing.csv
 * @param {Array<object>} architectures rows of reference-architectures.csv
 * @returns {{lines: Array<object>, totals: Array<object>}} the priced lines and one total per architecture and provider
 */
export function computeTotals(pricing, architectures) {
  const byId = new Map(pricing.map((p) => [p.id, p]));
  const lines = [];
  const sums = new Map();
  for (const provider of PROVIDERS) {
    for (const a of architectures) {
      const price = byId.get(`${provider}-${a.pricing_id}`);
      if (!price) throw new Error(`Missing pricing row ${provider}-${a.pricing_id}`);
      if (price.unit !== a.unit) {
        throw new Error(`Unit mismatch for ${price.id}: pricing has "${price.unit}", architecture has "${a.unit}"`);
      }
      const unitPrice = Number(price.price_usd);
      const quantity = Number(a.quantity);
      if (!Number.isFinite(unitPrice) || !Number.isFinite(quantity)) {
        throw new Error(`Non-numeric price or quantity for ${price.id} in ${a.architecture}`);
      }
      const lineUsd = quantity * unitPrice;
      lines.push({
        architecture: a.architecture,
        line: a.line,
        provider,
        pricing_id: price.id,
        quantity,
        unit: a.unit,
        unit_price_usd: unitPrice,
        line_usd: lineUsd,
      });
      const key = `${a.architecture}|${provider}`;
      sums.set(key, (sums.get(key) ?? 0) + lineUsd);
    }
  }
  const totals = [...sums].map(([key, usd]) => {
    const [architecture, provider] = key.split('|');
    return { architecture, provider, total_usd: usd };
  });
  return { lines, totals };
}

const money = (n) => (Math.round(n * 100) / 100).toFixed(2);

function main() {
  const pricing = parseCsv(readFileSync(join(dataDir, 'pricing.csv'), 'utf8'));
  const architectures = parseCsv(readFileSync(join(dataDir, 'reference-architectures.csv'), 'utf8'));
  const { lines, totals } = computeTotals(pricing, architectures);
  const records = lines.map((l) => ({ ...l, line_usd: money(l.line_usd) }));
  for (const t of totals) {
    records.push({
      architecture: t.architecture,
      line: 'TOTAL',
      provider: t.provider,
      pricing_id: '',
      quantity: '',
      unit: 'USD per month',
      unit_price_usd: '',
      line_usd: money(t.total_usd),
    });
  }
  const columns = ['architecture', 'line', 'provider', 'pricing_id', 'quantity', 'unit', 'unit_price_usd', 'line_usd'];
  writeFileSync(join(dataDir, 'reference-totals.csv'), toCsv(columns, records));
  for (const t of totals) console.log(`${t.architecture}\t${t.provider}\t${money(t.total_usd)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
