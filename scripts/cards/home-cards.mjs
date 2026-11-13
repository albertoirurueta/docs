// The hand-made home page cards (modules/ROOT/images/<name>.svg, linked from modules/ROOT/pages/index.adoc).
// Their logos and text layout are drawn by hand; generate-cards.mjs only re-applies the shared palette to them
// (restyle()), so a guide section's home card uses the same gradient as that section's subsection cards.
import { otherVariant, sectionVariant, variants } from './palette.mjs';

const bySection = {
  'ai.svg': 'ai',
  'apps.svg': 'apps',
  'backend-development.svg': 'backend',
  'cloud.svg': 'cloud',
  'cms.svg': 'cms',
  'data-science.svg': 'data-science',
  'databases.svg': 'database',
  'documentation-tools.svg': 'documentation-tools',
  'ecommerce.svg': 'ecommerce',
  'erp.svg': 'erp',
  'git-and-github.svg': 'git-and-github',
  'graphics-games.svg': 'graphics-games',
  'ml.svg': 'ml',
  'programming-languages.svg': 'programming-languages',
  'ui-ux.svg': 'ui-ux',
  'web-development.svg': 'web',
};

const javaProjects = [
  'algebra.svg', 'ar.svg', 'geometry-io.svg', 'geometry.svg', 'hermes.svg', 'navigation-indoor.svg',
  'navigation-inertial-extra.svg', 'navigation-inertial.svg', 'navigation.svg', 'numerical.svg', 'sorting.svg',
  'statistics.svg', 'units.svg',
];

export const homeCards = [
  ...Object.entries(bySection).map(([file, section]) => ({ file, colors: variants[sectionVariant[section]] })),
  ...javaProjects.map((file) => ({ file, colors: variants[otherVariant['java-projects']] })),
  { file: 'ai-catalog.svg', colors: variants[otherVariant['ai-catalog']] },
  { file: 'irurueta-auth-server.svg', colors: variants[otherVariant['auth-server']] },
];
