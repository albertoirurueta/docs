// Which guide shows which screen map. A map (figures/<product>-maps.mjs, file monitoring-alerting-<product>-map-<area>.svg)
// is shown once, before the first step in that area, by the guide listed here (the file is guide-<name>.adoc in the
// product's folder). Until that guide exists the map has no page and the test accepts that; once it exists the map must
// be referenced by it and by no other page. A guide may show several maps (G5 and K5 show two each).
export const mapGuides = {
  grafana: {
    explore: 'explore-metrics', // G3
    'dashboard-edit': 'first-dashboard', // G5
    'panel-editor': 'first-dashboard', // G5
    'alert-rule': 'create-an-alert-rule', // G16
  },
  kibana: {
    discover: 'explore-logs-in-discover', // K3
    'lens-editor': 'first-dashboard', // K5
    dashboard: 'first-dashboard', // K5
    'rule-form': 'create-a-rule', // K13
  },
};
