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
// provider has the id "<prefix>-<pricing_id>" (for example aws-vm-us-east, gcp-vm-us-east). All totals use list prices for
// the US East region, with no free allowance, discount or tax. Run: node compute-totals.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsv } from '../language-charts/generate-charts.mjs';
import { toCsv } from './csv.mjs';
import { PROVIDER_IDS } from './providers.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, 'data');

// pricing.csv ids start with the short provider prefix; reference-totals.csv uses the canonical provider id.
const PRICING_PREFIX = { aws: 'aws', azure: 'azure', 'google-cloud': 'gcp' };

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
  for (const provider of PROVIDER_IDS) {
    for (const a of architectures) {
      const price = byId.get(`${PRICING_PREFIX[provider]}-${a.pricing_id}`);
      if (!price) throw new Error(`Missing pricing row ${PRICING_PREFIX[provider]}-${a.pricing_id}`);
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
  const pricing = readCsv('pricing.csv', dataDir);
  const architectures = readCsv('reference-architectures.csv', dataDir);
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

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
