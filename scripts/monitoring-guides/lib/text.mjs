// Text-width estimator for the figures. Widths are the Helvetica/Arial advance widths (per 1000 em), scaled to
// Inter, which is a little wider; bold and monospace are handled separately. It is an estimate, kept slightly on the
// wide side so that a text that passes the check also fits in the real font.
const W = {};
const put = (chars, w) => [...chars].forEach((c) => (W[c] = w));
put(' !,./:;[]\\ft', 278); put('Il|', 260); put('ij', 222); put('"', 355); put("'", 191); put('()-`r{}', 333);
put('*', 389); put('#$0123456789?_abdeghnopqu', 556); put('+<=>~', 584); put('%', 889); put('&ABEKPSVXY', 667);
put('CDHNRU', 722); put('FTZ', 611); put('GOQ', 778); put('L', 556); put('M', 833); put('m', 833); put('W', 944);
put('@', 1015); put('^', 469); put('J', 500); put('kvxyzs', 500); put('c', 500); put('w', 722);
const INTER = 1.06; // Inter is wider than Helvetica
const BOLD = 1.06;
const MONO = 0.6;

export function textWidth(str, size, { weight = 400, mono = false } = {}) {
  if (mono) return [...String(str)].length * size * MONO;
  let em = 0;
  for (const c of String(str)) em += (W[c] ?? (c.charCodeAt(0) > 0x2000 ? 1000 : 600)) / 1000;
  return em * size * INTER * (weight >= 600 ? BOLD : 1);
}
