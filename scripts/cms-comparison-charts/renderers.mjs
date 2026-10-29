// Renderers for the CMS comparison figures. They are the e-commerce comparison renderers (palette-slot lines, bars and
// radars, a support-window Gantt chart, grouped bars and the shared scatter chart), re-exported so that the chart
// definitions import everything from one place.
export {
  MARKERS, decimalYear, monthStartTicks, yearMonthLabel, slotLegend, renderSlotLine, renderSlotBars, renderSlotRadar,
  renderGantt, ECOMMERCE_RENDERERS, renderEcommerceChart as renderCmsChart, wrapText,
} from '../ecommerce-comparison-charts/renderers.mjs';
