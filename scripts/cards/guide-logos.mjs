// Logos shown in coloured form by the figures of the monitoring guides (scripts/monitoring-guides/).
// Each entry names a key of logos.json and the product's real colour. The card marks stay white: generate-cards.mjs
// ignores `colour`. A mark that neither Simple Icons nor Devicon has is taken from the vendor's own asset, stored in
// vendor-logos/ with its origin and licence recorded here and listed in LOGO-SOURCES.md.
//
// colour: one solid fill (the product's brand colour). vendor: { file, source, license, note } for vendor assets.
export const guideLogos = [
  { key: 'si:grafana', title: 'Grafana', colour: '#F46800' },
  { key: 'si:elastic', title: 'Elastic', colour: '#0B64DD' },
  { key: 'si:kibana', title: 'Kibana', colour: '#F04E98' },
  { key: 'si:elasticsearch', title: 'Elasticsearch', colour: '#FEC514' },
  { key: 'si:prometheus', title: 'Prometheus', colour: '#E6522C' },
  { key: 'si:postgresql', title: 'PostgreSQL', colour: '#4169E1' },
  { key: 'dv:grafanaloki', title: 'Loki', colour: '#F68D2E' },
  {
    key: 'vendor:tempo',
    title: 'Tempo',
    colour: '#F05A28',
    vendor: {
      file: 'scripts/cards/vendor-logos/tempo.svg',
      source: 'Grafana Labs (tempo_logo.svg bundled with Grafana 13.3.0)',
      license: 'Grafana Labs trademark, used for identification only',
    },
  },
];
