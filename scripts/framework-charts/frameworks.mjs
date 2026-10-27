// Shared helpers for the backend and web frameworks comparison: the framework list, names and the radar groups. Kept
// free of rendering code so scores.mjs, chart-definitions.mjs and generate-tables.mjs can all use it.
import { isMissing, toNumber } from '../language-charts/data-utils.mjs';

export const PAGES = ['backend', 'web'];
export const FILE_PREFIX = { backend: 'backend-frameworks-comparison-', web: 'web-frameworks-comparison-' };

/** Radar groups: at most six frameworks each so every chart stays readable. */
export const RADAR_GROUPS = {
  backend: [
    { id: 'jvm', title: 'JVM frameworks', members: ['spring-boot', 'quarkus', 'micronaut', 'helidon', 'ktor', 'vertx'] },
    { id: 'dotnet-php', title: '.NET and PHP frameworks', members: ['aspnet-core', 'laravel', 'symfony', 'codeigniter', 'cakephp'] },
    { id: 'node', title: 'Node.js and TypeScript frameworks', members: ['express', 'fastify', 'nestjs', 'hono', 'koa', 'adonisjs'] },
    { id: 'python', title: 'Python frameworks', members: ['django', 'fastapi', 'flask', 'litestar', 'sanic', 'tornado'] },
    { id: 'rust-go-swift-elixir', title: 'Rust, Go, Swift and Elixir frameworks', members: ['axum', 'actix-web', 'gin', 'fiber', 'vapor', 'phoenix'] },
    { id: 'mainstream', title: 'Mainstream picks (most used framework of each language)', members: ['spring-boot', 'aspnet-core', 'express', 'django', 'laravel', 'rails'] },
  ],
  web: [
    { id: 'client', title: 'Client-side UI frameworks', members: ['react', 'angular', 'vue', 'svelte', 'solid', 'preact'] },
    { id: 'meta', title: 'Meta-frameworks', members: ['nextjs', 'nuxt', 'sveltekit', 'astro', 'remix', 'angular-ssr'] },
    { id: 'server-java', title: 'Server-driven Java UI', members: ['vaadin', 'jsf', 'thymeleaf', 'gwt', 'jsp'] },
    { id: 'server-other', title: 'Other server-rendered UI', members: ['blazor', 'razor-pages', 'livewire', 'django-templates', 'liveview', 'hotwire'] },
    { id: 'css', title: 'CSS frameworks', members: ['bootstrap', 'tailwind', 'bulma', 'foundation', 'mui', 'shadcn'] },
  ],
};

/** Radar axes per page (CSS frameworks have their own axes). `kind` says whether the axis is computed or editorial. */
export const AXES = {
  backend: ['popularity', 'growth', 'talent_jobs', 'ease_of_use', 'ecosystem_maturity', 'productivity', 'throughput', 'memory', 'startup'],
  web: ['popularity', 'growth', 'talent_jobs', 'ease_of_use', 'ecosystem_maturity', 'productivity', 'runtime_performance', 'bundle_size', 'performance'],
  css: ['popularity', 'growth', 'site_usage', 'ease_of_use', 'ecosystem_maturity', 'bundle_size'],
};
export const EDITORIAL_AXES = ['ease_of_use', 'ecosystem_maturity', 'productivity'];
export const AXIS_LABELS = {
  popularity: 'Popularity', growth: 'Growth', talent_jobs: 'Talent pool / jobs', ease_of_use: 'Ease of use',
  ecosystem_maturity: 'Ecosystem and maturity', productivity: 'Productivity', throughput: 'Throughput', memory: 'Memory',
  startup: 'Startup', runtime_performance: 'Runtime performance', bundle_size: 'Bundle size', performance: 'Performance', site_usage: 'Usage on websites',
};
export const axisKind = (axis) => (EDITORIAL_AXES.includes(axis) ? 'editorial' : 'computed');
export const axisLabel = (axis) => `${AXIS_LABELS[axis]} (${axisKind(axis) === 'editorial' ? 'E' : 'C'})`;

/** { id: row } of frameworks.csv. */
export function frameworkIndex(data) {
  return Object.fromEntries(data.frameworks.map((f) => [f.id, f]));
}
/** Display name; short forms keep chart labels readable. */
const SHORT = { 'aspnet-mvc5': 'ASP.NET MVC 5', 'remix': 'Remix / RR7', 'vaadin': 'Vaadin', 'jsf': 'JSF', 'jsp': 'JSP', 'hotwire': 'Hotwire', 'sass': 'Sass', 'go-net-http': 'Go net/http', 'laminas': 'Zend / Laminas', 'django-templates': 'Django templates', 'angularjs': 'AngularJS', 'j2ee-ejb2': 'J2EE / EJB 2' };
export function nameOf(data, id) {
  if (SHORT[id]) return SHORT[id];
  return frameworkIndex(data)[id]?.name ?? id;
}
/** Frameworks of one page (`both` belongs to both pages). */
export function frameworksOf(data, page) {
  return data.frameworks.filter((f) => f.page === page || f.page === 'both');
}
/** Number or null from a CSV cell. */
export const num = (v) => toNumber(v);
export { isMissing, toNumber };
/** Sorted unique source ids of a set of rows. */
export function sourceIds(rows) {
  const ids = new Set();
  for (const r of rows) for (const s of String(r.source ?? '').split(';')) if (s.trim() && s.trim() !== 'n/a') ids.add(s.trim());
  return [...ids].sort();
}
/** Decimal year for an ISO date or a YYYY / YYYY-MM period. */
export function decimalYear(iso) {
  const [y, m = '01', d = '01'] = String(iso).split('-');
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}
/** The snapshot date shared by the data files. */
export const snapshotOf = (data) => data.frameworks[0]?.retrieved ?? 'n/a';
export const round1 = (v) => (v === null || v === undefined || Number.isNaN(v) ? null : Math.round(v * 10) / 10);
export const clamp10 = (v) => (v === null ? null : Math.min(10, Math.max(0, v)));
export const mean = (vals) => { const v = vals.filter((x) => x !== null && x !== undefined && !Number.isNaN(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
