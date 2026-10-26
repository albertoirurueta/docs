// Shared helpers for reading the CSV data. Kept free of imports so every module can use them.

/** True for empty values and the `n/a` marker used by the data files. */
export function isMissing(v) {
  if (v === null || v === undefined) return true;
  const s = String(v).trim().toLowerCase();
  return s === '' || s === 'n/a' || s === 'na';
}

/** Converts a CSV cell to a finite number, or null when missing or not numeric. Never returns 0 for missing. */
export function toNumber(v) {
  if (isMissing(v)) return null;
  const n = Number(String(v).trim().replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}
