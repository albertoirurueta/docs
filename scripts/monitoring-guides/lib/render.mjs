// Re-exports the shared renderer (scripts/figure-lib/render.mjs) and keeps the monitoring-specific file naming.
export * from '../../figure-lib/render.mjs';

// monitoring-alerting-<product>-guide-<guide>-<nn>-<what>.svg for a guide spec ({ guide }),
// monitoring-alerting-<product>-map-<area>.svg for a screen-map spec ({ maps: true }); the figure id is "<nn>-<what>" or "<area>".
export function figureFileName(spec, figure) {
  const base = spec.maps ? `monitoring-alerting-${spec.product}-map-${figure.id}` : `monitoring-alerting-${spec.product}-guide-${spec.guide}-${figure.id}`;
  return `${base}.svg`;
}

export function expectedIdPattern(spec) {
  return spec.maps ? /^[a-z0-9]+(-[a-z0-9]+)*$/ : /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
}
