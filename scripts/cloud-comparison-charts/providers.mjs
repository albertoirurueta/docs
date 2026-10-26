// The three compared providers, their canonical ids and the one colour each keeps in every figure. The renderers of
// scripts/language-charts colour a series by its index in the palette, so every figure lists the providers in this
// fixed order (an empty series is kept) and a provider therefore has the same colour everywhere.
export const PROVIDERS = [
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'google-cloud', name: 'Google Cloud' },
];
export const PROVIDER_IDS = PROVIDERS.map((p) => p.id);

// Okabe-Ito colours of palette slots 0..2 in scripts/language-charts/generate-charts.mjs.
export const PROVIDER_COLORS = { aws: '#0072B2', azure: '#D55E00', 'google-cloud': '#009E73' };

const ALIASES = new Map([
  ['aws', 'aws'], ['amazon', 'aws'], ['azure', 'azure'], ['microsoft', 'azure'],
  ['google-cloud', 'google-cloud'], ['google_cloud', 'google-cloud'], ['google cloud', 'google-cloud'],
  ['gcp', 'google-cloud'], ['google', 'google-cloud'],
]);

/**
 * Canonical provider id for the spellings used by the CSVs: `aws`/`azure`/`google-cloud`, `google_cloud` (service-mapping
 * header), `gcp` (pricing.csv), `AWS`/`Azure`/`Google Cloud` (footprint, regions, availability)
 * and `microsoft` (revenue.csv). Returns null for anything else.
 */
export function providerId(raw) {
  return ALIASES.get(String(raw ?? '').trim().toLowerCase()) ?? null;
}

export const providerName = (id) => PROVIDERS.find((p) => p.id === id)?.name ?? id;
/** Palette slot (series index) of a provider id. */
export const providerIndex = (id) => PROVIDER_IDS.indexOf(id);
