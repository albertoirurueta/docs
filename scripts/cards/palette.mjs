// Shared colour palette of every card-like SVG on the site: section and subsection cards, home page cards, IDE
// cards and the cheat-sheet download button. It is derived from the UI bundle's animated top bar, whose gradient
// runs through --navbar-background1/2/3 (#ff6ec4 pink, #7873f5 indigo, #4ade80 green). The green is used one step
// deeper (#2fbf71) at the end of a gradient so that white text keeps enough contrast.
export const brand = {
  pink: '#ff6ec4',
  indigo: '#7873f5',
  green: '#4ade80',
  greenDeep: '#2fbf71',
  violet: '#b76fe0', // midpoint of pink and indigo
  azure: '#5b9bd5', // midpoint of indigo and green, nudged towards blue
  teal: '#4fa3c8',
  ink: '#1e1b4b', // dark indigo used for the bottom scrim
  buttonText: '#4c46c9', // indigo text on the white button (contrast > 7:1)
};

// Diagonal three-stop gradients (top-left -> bottom-right), all built from the top bar's three colours.
export const variants = {
  pinkIndigo: [brand.pink, brand.violet, brand.indigo],
  indigoGreen: [brand.indigo, brand.azure, brand.greenDeep],
  sweep: [brand.pink, brand.indigo, brand.greenDeep],
  greenIndigo: ['#34d399', brand.teal, brand.indigo],
  indigoPink: [brand.indigo, brand.violet, brand.pink],
  sweepReverse: [brand.greenDeep, brand.indigo, brand.pink],
};

// One variant per section, so that a section's home card and its subsection cards read as a family.
export const sectionVariant = {
  'programming-languages': 'sweep',
  database: 'indigoGreen',
  web: 'pinkIndigo',
  backend: 'greenIndigo',
  apps: 'indigoPink',
  cloud: 'sweepReverse',
  ai: 'pinkIndigo',
  'documentation-tools': 'indigoGreen',
  ecommerce: 'indigoPink',
  cms: 'greenIndigo',
  'ui-ux': 'pinkIndigo',
  'data-science': 'indigoGreen',
  ml: 'sweepReverse',
  'graphics-games': 'indigoPink',
  'git-and-github': 'sweep',
};

// Variants for the cards that are not tied to a guide section.
export const otherVariant = {
  'java-projects': 'sweep',
  'ai-catalog': 'pinkIndigo',
  'auth-server': 'greenIndigo',
  ide: 'sweep',
};
