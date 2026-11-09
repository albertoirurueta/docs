// Renderers for the graphics and game libraries comparison figures. The line, bar, radar and Gantt renderers are the
// platform-slot renderers of scripts/ecommerce-comparison-charts/renderers.mjs (one colour, dash and marker per
// library in every figure, "n/a" never drawn as zero); this module only adds the dispatch and footer for this page.
import { renderChart } from '../language-charts/generate-charts.mjs';
import { addFooter } from '../cloud-comparison-charts/renderers.mjs';
import {
  ECOMMERCE_RENDERERS, decimalYear, yearMonthLabel, monthStartTicks,
} from '../ecommerce-comparison-charts/renderers.mjs';

export { decimalYear, yearMonthLabel, monthStartTicks };
export const GRAPHICS_RENDERERS = { ...ECOMMERCE_RENDERERS };

/** Renders any definition, then appends the caption (source and date) as a footer when the spec has one. */
export function renderGraphicsChart(def) {
  const own = GRAPHICS_RENDERERS[def.type];
  const svg = own ? own(def) : renderChart(def);
  return def.footer ? addFooter(svg, def.footer) : svg;
}
