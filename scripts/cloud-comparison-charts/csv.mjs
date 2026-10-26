// CSV writer shared by the scripts that regenerate derived data files; reading uses parseCsv/readCsv of
// scripts/language-charts/generate-charts.mjs.

const esc = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

/** CSV text with a header row: `header` lists the columns, each record is an object keyed by column. */
export const toCsv = (header, records) =>
  `${[header, ...records.map((r) => header.map((h) => r[h]))].map((r) => r.map(esc).join(',')).join('\n')}\n`;
