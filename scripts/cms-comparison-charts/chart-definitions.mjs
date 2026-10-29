// Chart builders for the CMS comparison page. Each builder takes the parsed CSV data ({ name: rows }) and returns a chart
// spec for ./renderers.mjs. A CMS keeps its palette slot (colour, dash, marker) from its position inside its group, so it
// looks the same in every figure of that group; figures that mix groups colour by group (bars, scatter) or assign slots by
// position and say so in the legend. Missing (n/a) values are never plotted as zero: they are gaps or "n/a" labels.
import { toNumber } from '../language-charts/data-utils.mjs';
import {
  AXES, CMS, CMS_GROUP, CMS_NAMES, CMS_SLOT, GROUPS, computeScores, leaderOf, numericRows,
} from './scores.mjs';
import { decimalYear, yearMonthLabel } from './renderers.mjs';

export { decimalYear, yearMonthLabel };
export const SNAPSHOT = '2026-10-29';
const roundTo = (v, d) => Number(v.toFixed(d));
const pct = (v) => `${roundTo(v, 1)}%`;
const pct0 = (v) => `${Math.round(v)}%`;
const int = (v) => Math.round(v).toLocaleString('en-US');
const SHORT = { ...CMS_NAMES, aem: 'AEM', 'craft-cms': 'Craft CMS', shopify: 'Shopify (context)' };
const GROUP_BY_ID = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
const CONTEXT_SLOT = 4;

const pick = (rows, f) => rows.filter((r) => Object.entries(f).every(([k, v]) => (v instanceof RegExp ? v.test(r[k]) : r[k] === v)));
const latest = (rows, f) => {
  const m = pick(rows, f).filter((r) => toNumber(r.value) !== null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return m.length ? toNumber(m.at(-1).value) : null;
};
const latestDate = (rows, f) => {
  const m = pick(rows, f).filter((r) => toNumber(r.value) !== null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return m.length ? m.at(-1).date : 'n/a';
};
const footer = (sources, file, extra = '') => `Source: ${sources}; retrieved ${SNAPSHOT}. ${extra}${extra ? ' ' : ''}Raw data: scripts/cms-comparison-charts/data/${file}.csv. See the Bibliography for the sources.`;
const groupLegend = (ids = GROUPS.map((g) => g.id), withContext = false) => [
  ...ids.map((id) => ({ name: GROUP_BY_ID[id].short, slot: GROUP_BY_ID[id].slot })),
  ...(withContext ? [{ name: 'Market-share context (Shopify)', slot: CONTEXT_SLOT }] : []),
];
const groupSlot = (id) => (CMS_GROUP[id] ? GROUP_BY_ID[CMS_GROUP[id]].slot : CONTEXT_SLOT);
const names = (ids) => ids.map((id) => SHORT[id]).join(', ');

/** Points {x: decimal year, y} of a monthly or dated series; rows without a number (n/a) or a valid date are left out. */
const datedPoints = (rows, platform, metric) => numericRows(rows, platform, metric)
  .filter((r) => /^\d{4}-\d{2}(-\d{2})?$/.test(r.date))
  .map((r) => ({ x: decimalYear(r.date), y: toNumber(r.value) }));

/** Series of the group members (own CMS slot) from a point builder; members without any point are dropped. */
const groupSeries = (group, build) => group.members
  .map((id) => ({ name: SHORT[id], slot: CMS_SLOT[id], points: build(id) }))
  .filter((s) => s.points.some((p) => p.y !== null));
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));

// ---------------------------------------------------------------- popularity

const w3History = (data) => {
  const ids = ['wordpress', 'wix', 'squarespace', 'shopify', 'joomla', 'drupal', 'webflow'];
  return {
    type: 'slotline', id: 'w3techs-history', width: 900,
    title: 'W3Techs share of all websites per year',
    desc: `Share of all websites using each CMS on 1 January of each year from 2015 and on ${SNAPSHOT} according to W3Techs, for WordPress, Wix, Squarespace, Shopify (market-share context only), Joomla, Drupal and Webflow. WordPress rose to about 43% and has been flat since 2022, Wix and Squarespace keep growing, Joomla and Drupal decline. W3Techs publishes yearly history only for systems above 1% of all sites (Webflow from 2019), so the other CMSs have no series (n/a). Colours are assigned by position in this figure.`,
    xLabel: `Year (1 January; last point ${SNAPSHOT})`, yLabel: 'Share of all websites (%)', yFormat: (v) => `${v}%`,
    series: ids.map((id, i) => ({ name: SHORT[id], slot: i, points: datedPoints(data.popularity, id, 'w3techs_share_all_sites_yearly') })),
    footer: footer('W3Techs historical yearly trends (w3techs.com/technologies/history_overview/content_management/all/y)', 'popularity'),
  };
};

const w3Now = (data) => {
  const ids = [...CMS, 'shopify'].sort((a, b) => (latest(data.popularity, { platform: b, metric: 'w3techs_share_all_sites' }) ?? -1) - (latest(data.popularity, { platform: a, metric: 'w3techs_share_all_sites' }) ?? -1));
  return {
    type: 'groupedbar', id: 'w3techs-share-now', width: 1200,
    title: 'W3Techs market share now',
    desc: `Share of all websites and share of websites with a known CMS for each CMS on ${SNAPSHOT} (W3Techs), ordered by share of all websites. WordPress holds about two fifths of all websites and three fifths of the sites with a known CMS. W3Techs does not report the CMSs shown as n/a, mostly headless and enterprise products that do not leave a visible fingerprint.`,
    xLabel: 'CMS (ordered by share of all websites)', yLabel: 'Share (%)', categories: ids.map((id) => SHORT[id]), valueFormat: pct,
    series: [['w3techs_share_all_sites', 'Share of all websites'], ['w3techs_share_known_cms', 'Share of websites with a known CMS']]
      .map(([metric, name]) => ({ name, values: ids.map((id) => latest(data.popularity, { platform: id, metric })) })),
    footer: footer('W3Techs (w3techs.com/technologies/details/cm-<system>)', 'popularity', 'Daily-updated survey of the top 10 million sites.'),
  };
};

const originsMobile = (group) => (data) => ({
  type: 'slotline', id: `origins-mobile-${group.id}`, width: 900,
  title: `Origins using each CMS, mobile (${group.short.toLowerCase()})`,
  desc: `Number of origins in the HTTP Archive crawl detected as using ${names(group.members)} on mobile, monthly from 2020-01 to ${latestDate(data.popularity, { platform: group.members[0], metric: 'httparchive_origins_mobile' })}. Origins are websites visited in the Chrome UX Report, not live sites, and a CMS missing from the chart has no HTTP Archive series (n/a). The desktop crawl shows the same trends.`,
  xLabel: 'Month (year)', yLabel: 'Origins detected, mobile (count)',
  series: groupSeries(group, (id) => datedPoints(data.popularity, id, 'httparchive_origins_mobile')),
  footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/adoption)', 'popularity', 'Counts origins in the crawl, not sites.'),
});

const githubBars = (data, metric, id, title, unit, extra) => {
  const rows = data.popularity.filter((r) => r.metric === metric && CMS.includes(r.platform) && toNumber(r.value) !== null && r.item)
    .sort((a, b) => toNumber(b.value) - toNumber(a.value));
  return {
    type: 'slotbars', id, width: 900,
    title,
    desc: `${unit} of the main GitHub repository of each open-source CMS on ${SNAPSHOT}, coloured by group. Webflow, Wix, Squarespace, Contentful and AEM are closed products with no public repository (n/a, not shown). Stars measure interest, not usage.`,
    xLabel: `${unit} (count)`, yLabel: 'GitHub repository', valueFormat: int, legend: groupLegend(),
    items: rows.map((r) => ({ label: r.item, slot: groupSlot(r.platform), value: toNumber(r.value) })),
    footer: footer('GitHub REST API (api.github.com)', 'popularity', extra),
  };
};

const packagistInstalls = (data) => ({
  type: 'slotbars', id: 'packagist-installs', width: 860,
  title: 'Packagist installs in the last 30 days',
  desc: `Composer installs in the last 30 days of Drupal core, TYPO3 core and Craft CMS on Packagist (${SNAPSHOT}). Registry counts are only comparable within one registry: WordPress, Joomla, Webflow and Wix are not distributed through Packagist or are not counted there, and the npm, PyPI and NuGet counts are charted separately or kept in the page tables. Installs include CI and mirror traffic.`,
  xLabel: 'Installs in the last 30 days (count)', yLabel: 'Package', valueFormat: int, legend: groupLegend(['traditional']),
  items: pick(data.popularity, { metric: 'packagist_installs_last_30_days' }).filter((r) => toNumber(r.value) !== null)
    .map((r) => ({ label: r.item, slot: groupSlot(r.platform), value: toNumber(r.value) })).sort((a, b) => b.value - a.value),
  footer: footer('Packagist statistics (packagist.org)', 'popularity', 'Not comparable with npm, PyPI or NuGet counts.'),
});

const npmDownloads = (data) => {
  const defs = [['strapi', '@strapi/strapi'], ['payload', 'payload'], ['sanity', 'sanity'], ['contentful', 'contentful'], ['ghost', 'ghost']];
  return {
    type: 'slotline', id: 'npm-downloads', width: 900,
    title: 'npm downloads per year',
    desc: 'Yearly npm downloads of @strapi/strapi, payload, sanity, contentful and ghost, 2020 to 2026 year to date. Payload and Sanity downloads grow fastest; Strapi is flat. Counts include CI and mirror traffic and compare only npm packages with each other: PHP, Python and .NET CMSs ship through other registries. Colours are assigned by position in this figure.',
    xLabel: 'Year (2026 is year to date)', yLabel: 'Downloads per year (npm, includes CI)',
    series: defs.map(([id, pkg], i) => {
      const rows = pick(data.popularity, { platform: id, metric: 'npm_downloads_year', item: pkg }).filter((r) => /^\d{4}$/.test(r.date) && toNumber(r.value) !== null).sort((x, y) => x.date.localeCompare(y.date));
      while (rows.length && toNumber(rows[0].value) === 0) rows.shift(); // years before the package was published
      return { name: `${SHORT[id]} (${pkg})`, slot: i, points: rows.map((r) => ({ x: Number(r.date), y: toNumber(r.value) })) };
    }),
    footer: footer('npm downloads API (api.npmjs.org)', 'popularity', 'Not comparable with Packagist, PyPI or NuGet counts.'),
  };
};

const soQuestions = (group) => (data) => ({
  type: 'slotline', id: `stackoverflow-questions-${group.id}`, width: 900,
  title: `Stack Overflow questions per year (${group.short.toLowerCase()})`,
  desc: `Questions asked each year on Stack Overflow with the tag of ${names(group.members)}, 2018 to 2025. Every tag falls steeply from 2023, mirroring the decline of the whole site, so the trend says little about the popularity of a CMS. The partial year 2026 is omitted.`,
  xLabel: 'Year asked', yLabel: 'Questions asked (count)',
  series: groupSeries(group, (id) => range(2018, 2025).map((y) => ({ x: Number(y), y: toNumber(pick(data.popularity, { platform: id, metric: 'stackexchange_questions_year', item: /^stackoverflow:/, date: y })[0]?.value) }))),
  footer: footer('Stack Exchange API (api.stackexchange.com)', 'popularity', 'A CMS with no tag series is not shown.'),
});

// ---------------------------------------------------------------- talent

const soUsage = (data) => {
  const ids = ['wordpress', 'drupal', 'strapi'];
  return {
    type: 'slotline', id: 'stackoverflow-usage', width: 860,
    title: 'Stack Overflow survey usage per year',
    desc: 'Share of respondents to the Stack Overflow Developer Survey who did extensive development work with WordPress, Drupal and Strapi in the past year, 2023 to 2026. Only these CMSs are listed under web frameworks and technologies; Strapi appears in 2024 only (n/a elsewhere). WordPress stays near 13% and Drupal near 2%. Colours are assigned by position in this figure.',
    xLabel: 'Survey year', yLabel: 'Respondents (%)', yFormat: (v) => `${v}%`,
    series: ids.map((id, i) => ({ name: SHORT[id], slot: i, points: pick(data.talent, { platform: id, metric: 'so_usage_all' }).filter((r) => toNumber(r.value) !== null).map((r) => ({ x: Number(r.date), y: toNumber(r.value) })) })),
    footer: footer('Stack Overflow Developer Survey 2023 to 2026 (survey.stackoverflow.co)', 'talent'),
  };
};

const hnShare = (data) => {
  const years = range(2018, 2025);
  const ranked = CMS.map((id) => ({ id, vals: years.map((y) => toNumber(pick(data.talent, { platform: id, metric: 'hn_whoishiring_mention_share', date: y })[0]?.value)) }))
    .filter((c) => c.vals.some((v) => v !== null && v > 0))
    .sort((a, b) => Math.max(...b.vals.filter((v) => v !== null)) - Math.max(...a.vals.filter((v) => v !== null)))
    .slice(0, 8);
  return {
    type: 'slotline', id: 'hn-job-share', width: 900,
    title: 'Hacker News job mentions per year',
    desc: `Share of the postings in the monthly "Who is hiring?" threads on Hacker News that mention each CMS, per year 2018 to 2025, for the CMSs with at least one mention (${names(ranked.map((c) => c.id))}). It is a demand proxy biased to startups and mentions stay below about half a percent of postings for every CMS, with WordPress highest but noisy from year to year. Colours are assigned by position in this figure.`,
    xLabel: 'Year', yLabel: 'Postings mentioning the CMS (%)', yFormat: (v) => `${v}%`,
    series: ranked.map((c, i) => ({ name: SHORT[c.id], slot: i, points: years.map((y, j) => ({ x: Number(y), y: c.vals[j] })) })),
    footer: footer('Hacker News search API (hn.algolia.com)', 'talent', 'Mentions are matched by name and also match unrelated uses.'),
  };
};

// ---------------------------------------------------------------- performance (HTTP Archive)

const cwvSeries = (group, dev) => (data) => ({
  type: 'slotline', id: `cwv-${dev}-${group.id}`, width: 900,
  title: `Core Web Vitals pass rate, ${dev} (${group.short.toLowerCase()})`,
  desc: `Share of origins passing all Core Web Vitals on ${dev} devices for ${names(group.members)}, monthly from 2020-01 to ${latestDate(data.performance, { platform: group.members[0], metric: `cwv_pass_${dev}` })}, from the HTTP Archive Tech Report. A dashed vertical line marks March 2024, when INP replaced FID in the definition, so the series is not strictly comparable across it. This is origin-level field data, not a controlled benchmark.`,
  xLabel: 'Month (year)', yLabel: `Origins passing Core Web Vitals, ${dev} (%)`, yInclude: [0, 100], yFormat: (v) => `${v}%`,
  vlines: [{ x: decimalYear('2024-03'), label: '2024-03 INP replaces FID' }],
  series: groupSeries(group, (id) => datedPoints(data.performance, id, `cwv_pass_${dev}`)),
  footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/cwv)', 'performance', 'Survivor bias may flatter small populations.'),
});

const cwvNow = (data) => ({
  type: 'groupedbar', id: 'cwv-now', width: 1200,
  title: 'Core Web Vitals pass rate now',
  desc: `Share of origins passing all Core Web Vitals in ${latestDate(data.performance, { platform: 'wordpress', metric: 'cwv_pass_mobile' })}, mobile and desktop, for the sixteen CMSs (HTTP Archive Tech Report). Wix and TYPO3 lead on mobile at about 80%, Umbraco and Ghost follow, WordPress is below half, and Contentful, Strapi and AEM trail with fewer than two fifths of origins. Payload has no HTTP Archive series (n/a).`,
  xLabel: 'CMS', yLabel: 'Origins passing Core Web Vitals (%)', categories: CMS.map((id) => SHORT[id]), valueFormat: pct0,
  series: ['mobile', 'desktop'].map((d) => ({ name: d === 'mobile' ? 'Mobile' : 'Desktop', values: CMS.map((id) => latest(data.performance, { platform: id, metric: `cwv_pass_${d}` })) })),
  footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/cwv)', 'performance', 'Origin-level field data.'),
});

const lighthouseNow = (data) => ({
  type: 'groupedbar', id: 'lighthouse-now', width: 1200,
  title: 'Median Lighthouse performance score now',
  desc: `Median Lighthouse performance score (0 to 100) of the origins detected for each CMS in ${latestDate(data.performance, { platform: 'wordpress', metric: 'lighthouse_performance_mobile' })}, mobile and desktop (HTTP Archive Tech Report). Lab scores come from a throttled test profile and are lower than real-user experience on fast devices. Payload has no series (n/a).`,
  xLabel: 'CMS', yLabel: 'Median Lighthouse performance score (0-100)', categories: CMS.map((id) => SHORT[id]), valueFormat: (v) => String(Math.round(v)),
  series: ['mobile', 'desktop'].map((d) => ({ name: d === 'mobile' ? 'Mobile' : 'Desktop', values: CMS.map((id) => { const v = latest(data.performance, { platform: id, metric: `lighthouse_performance_${d}` }); return v === null ? null : roundTo(v * 100, 1); }) })),
  footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/lighthouse)', 'performance', 'Lab data, median over origins.'),
});

const vitalsNow = (dev) => (data) => {
  const cats = [['lcp', 'Good LCP'], ['inp', 'Good INP'], ['cls', 'Good CLS']];
  return {
    type: 'groupedbar', id: `vitals-${dev}`, width: 1300,
    title: `Good LCP, INP and CLS, ${dev}`,
    desc: `Share of ${dev} origins with a good Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift for the sixteen CMSs in ${latestDate(data.performance, { platform: 'wordpress', metric: `cwv_good_lcp_${dev}` })} (HTTP Archive Tech Report). LCP separates the CMSs most; INP and CLS are good for most origins of most CMSs, except for Contentful, Strapi, Sanity and AEM. Payload has no series (n/a).`,
    xLabel: 'CMS', yLabel: `Origins with a good value, ${dev} (%)`, categories: CMS.map((id) => SHORT[id]), valueFormat: pct0,
    series: cats.map(([k, name]) => ({ name, values: CMS.map((id) => latest(data.performance, { platform: id, metric: `cwv_good_${k}_${dev}` })) })),
    footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/cwv)', 'performance'),
  };
};

const lighthouseHistory = (data) => {
  const ids = ['wordpress', 'drupal', 'joomla', 'webflow', 'wix', 'squarespace', 'ghost'];
  return {
    type: 'slotline', id: 'lighthouse-history', width: 900,
    title: 'Median Lighthouse performance score, mobile',
    desc: `Median Lighthouse performance score (0 to 100) of mobile origins detected for WordPress, Drupal, Joomla, Webflow, Wix, Squarespace and Ghost, monthly from 2020-01 to ${latestDate(data.performance, { platform: 'wordpress', metric: 'lighthouse_performance_mobile' })} (HTTP Archive Tech Report). Lab scores, so levels are low for every CMS; compare the direction of each line. Colours are assigned by position in this figure.`,
    xLabel: 'Month (year)', yLabel: 'Median Lighthouse performance, mobile (0-100)', yInclude: [0, 100],
    series: ids.map((id, i) => ({ name: SHORT[id], slot: i, points: datedPoints(data.performance, id, 'lighthouse_performance_mobile').map((p) => ({ x: p.x, y: roundTo(p.y * 100, 1) })) })),
    footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/lighthouse)', 'performance', 'Lab data, median over origins.'),
  };
};

// ---------------------------------------------------------------- security

function cveSeries(data, id, title, desc, defs, footerExtra, metric = 'nvd_cves_year', yLabel = 'CVEs published (NVD, count)', src = 'NVD CVE API 2.0 (services.nvd.nist.gov)', first = 2015) {
  const years = range(first, 2026);
  return {
    type: 'slotline', id, width: 900, title, desc,
    xLabel: 'Year published (2026 to 2026-10-29)', yLabel,
    series: defs.map(([p, item, name, slot, variant]) => ({
      name, slot: slot ?? CMS_SLOT[p], variant: variant ?? 0,
      points: years.map((y) => ({ x: Number(y), y: toNumber(pick(data.security, { platform: p, metric, item, date: y })[0]?.value) })),
    })),
    footer: footer(src, 'security', footerExtra),
  };
}

const cvesCoreTraditional = (d) => cveSeries(d, 'cves-core-traditional', 'CVEs per year, core of the traditional CMSs',
  'CVEs published per year in the NVD for the core of WordPress, Drupal, Joomla, TYPO3 and Craft CMS (CPE-matched), 2015 to 2026 year to date. WordPress core stays low because plugin and theme CVEs are filed under other vendors; TYPO3 rose in 2025. CVE counts measure disclosure, not real risk, and NVD CPE tagging can lag.',
  [['wordpress', 'core:wordpress_cpe', 'WordPress core'], ['drupal', 'core:drupal_cpe', 'Drupal core'], ['joomla', 'core:joomla_cpe', 'Joomla core'], ['typo3', 'core:typo3_cpe', 'TYPO3 core'], ['craft-cms', 'core:craft_cms_cpe', 'Craft CMS core']],
  'CVE counts measure disclosure, not real risk.');

const cvesCoreOther = (d) => cveSeries(d, 'cves-core-other', 'CVEs per year, core of the other self-hosted CMSs',
  'CVEs published per year in the NVD for AEM, Umbraco, Strapi, Payload and Ghost (CPE-matched), 2015 to 2026 year to date. AEM counts are an order of magnitude higher because Adobe files every AEM and add-on component under one product. Hosted products (Webflow, Wix, Squarespace, Contentful, Sanity) fix their platform without CVEs and have no series; they are not comparable. Wagtail is only found by keyword and appears in the ecosystem chart.',
  [['aem', 'core:aem_cpe', 'AEM'], ['umbraco', 'core:umbraco_cpe', 'Umbraco'], ['strapi', 'core:strapi_cpe', 'Strapi'], ['payload', 'core:payload_cpe', 'Payload'], ['ghost', 'core:ghost_cpe', 'Ghost']].map(([p, i, n], k) => [p, i, n, k]),
  'CVE counts measure disclosure, not real risk. Colours are assigned by position in this figure.');

const cvesEcosystem = (d) => cveSeries(d, 'cves-ecosystem', 'CVEs per year, ecosystem and keyword search',
  'CVEs published per year in the NVD that mention WordPress (plugins and themes, by keyword), Drupal (vendor CPE), Joomla, TYPO3 (extensions) and Wagtail (by keyword), 2015 to 2026 year to date. The WordPress keyword series reaches thousands a year, driven by CNAs issuing CVEs for plugins in bulk, and dwarfs the other CMSs. Keyword searches also match unrelated mentions.',
  [['wordpress', 'ecosystem:wordpress_keyword', 'WordPress keyword (plugins and themes)', 0], ['drupal', 'ecosystem:drupal_vendor_cpe', 'Drupal vendor CPE (contrib)', 1], ['joomla', 'ecosystem:joomla_keyword', 'Joomla keyword (extensions)', 2], ['typo3', 'ecosystem:typo3_keyword', 'TYPO3 keyword (extensions)', 3], ['wagtail', 'ecosystem:wagtail_keyword', 'Wagtail keyword', 4]],
  'Keyword searches also match unrelated mentions. Colours are assigned by position in this figure.');

const advisoriesTraditional = (d) => cveSeries(d, 'advisories-traditional', 'Security advisories per year, traditional CMSs',
  'Security advisories published per year by the Drupal security team (core), the Joomla Security Centre (core), the TYPO3 core advisories and GitHub global advisories for Craft CMS, 2015 to 2026 year to date. Each project counts differently (one advisory can bundle several CVEs), so levels are not comparable between lines. Craft CMS jumps in 2026 year to date.',
  [['drupal', 'core:drupal_sa_core', 'Drupal core (SA)'], ['joomla', 'core:joomla_security_centre', 'Joomla core (Security Centre)'], ['typo3', 'core:typo3_core_sa', 'TYPO3 core (SA)'], ['craft-cms', 'core:ghsa_global_composer_craftcms_cms', 'Craft CMS (GitHub advisories)']],
  'Counting methods differ between projects.', 'advisories_year', 'Advisories published (count)', 'Drupal, Joomla and TYPO3 security advisories, GitHub advisory database');

const advisoriesOther = (d) => cveSeries(d, 'advisories-other', 'Security advisories per year, other open-source CMSs',
  'GitHub global advisories per year for the Strapi, Payload, Ghost, Wagtail and Umbraco packages (npm, pip and NuGet), 2015 to 2026 year to date. Counts are low until 2025, and Ghost jumps in 2026 year to date; young projects such as Payload and Strapi publish few advisories, which reflects both quality and disclosure habits. Colours are assigned by position in this figure.',
  [['strapi', 'core:ghsa_global_npm_strapi', 'Strapi', 0], ['payload', 'core:ghsa_global_npm_payload', 'Payload', 1], ['ghost', 'core:ghsa_global_npm_ghost', 'Ghost', 2], ['wagtail', 'core:ghsa_global_pip_wagtail', 'Wagtail', 3], ['umbraco', 'core:ghsa_global_nuget_umbraco_cms', 'Umbraco', 4]],
  'Counting methods differ between ecosystems.', 'advisories_year', 'Advisories published (count)', 'GitHub advisory database');

const patchstackShare = (data) => {
  const v = (metric) => latest(data.security, { platform: 'wordpress', metric });
  const core = v('patchstack_core_vulnerabilities');
  const total = v('patchstack_total_vulnerabilities');
  return {
    type: 'slotbars', id: 'patchstack-share', width: 860,
    title: 'Where new WordPress vulnerabilities are found',
    desc: `Share of the ${int(total)} new WordPress ecosystem vulnerabilities reported in 2025 by Patchstack that were in plugins (${v('patchstack_share_plugins')}%), themes (${v('patchstack_share_themes')}%) or WordPress core (${core} vulnerabilities, ${roundTo((core / total) * 100, 2)}%). The ecosystem, not the core, is where WordPress sites are attacked. The share for core is computed from the two published counts.`,
    xLabel: 'Share of new vulnerabilities, 2025 (%)', yLabel: 'Component', valueFormat: (x) => `${roundTo(x, 2)}%`, legend: groupLegend(['traditional']),
    items: [
      { label: 'Plugins', slot: 0, value: v('patchstack_share_plugins') }, { label: 'Themes', slot: 0, value: v('patchstack_share_themes') },
      { label: 'WordPress core (computed)', slot: 0, value: core !== null && total ? (core / total) * 100 : null },
    ],
    footer: footer('Patchstack State of WordPress Security in 2026', 'security', 'Patchstack counts differ from NVD counts.'),
  };
};

// ---------------------------------------------------------------- cost

const costEntryPlans = (data) => {
  const exact = (s) => new RegExp(`^${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  const val = (platform, metric, item) => latest(data.cost, { platform, metric, item: exact(item) });
  const yearly = 'plan_price_yearly_billing_usd';
  const items = [
    { label: 'WordPress.com Personal (hosted)', p: 'wordpress', value: val('wordpress', yearly, 'WordPress.com Personal') },
    { label: 'Drupal (free software)', p: 'drupal', value: val('drupal', 'plan_price_monthly', 'software licence') },
    { label: 'Joomla (free software)', p: 'joomla', value: val('joomla', 'plan_price_monthly', 'software licence') },
    { label: 'TYPO3 (free software)', p: 'typo3', value: val('typo3', 'plan_price_monthly', 'software licence') },
    { label: 'Craft CMS Cloud Team', p: 'craft-cms', value: val('craft-cms', yearly, 'Craft Cloud Team') },
    { label: 'Webflow Basic (no CMS)', p: 'webflow', value: val('webflow', yearly, 'Basic') },
    { label: 'Webflow Premium (with CMS)', p: 'webflow', value: val('webflow', yearly, 'Premium') },
    { label: 'Wix Light', p: 'wix', value: val('wix', yearly, 'Light') },
    { label: 'Squarespace Basic', p: 'squarespace', value: null, naNote: 'EUR price only' },
    { label: 'Contentful', p: 'contentful', value: null, naNote: 'unverified' },
    { label: 'Strapi Cloud Starter', p: 'strapi', value: val('strapi', yearly, 'Strapi Cloud Starter') },
    { label: 'Sanity Growth (per seat, monthly)', p: 'sanity', value: val('sanity', 'plan_price_monthly_usd', 'Growth') },
    { label: 'Payload (free software)', p: 'payload', value: val('payload', 'plan_price_monthly', 'Payload CMS self-hosted') },
    { label: 'AEM', p: 'aem', value: null, naNote: 'quote only' },
    { label: 'Umbraco Cloud Starter', p: 'umbraco', value: null, naNote: 'EUR price only' },
    { label: 'Wagtail (free software)', p: 'wagtail', value: val('wagtail', 'plan_price_monthly', 'software licence') },
    { label: 'Ghost(Pro) Starter', p: 'ghost', value: val('ghost', yearly, 'Ghost(Pro) Starter') },
  ];
  return {
    type: 'slotbars', id: 'cost-entry-plans', width: 900,
    title: 'Entry price per month',
    desc: 'Cheapest paid plan of each CMS, or 0 for free software, in US dollars per month on the snapshot date, billed yearly where the vendor offers it (Sanity Growth is per seat and billed monthly). Free software still needs hosting and development, so 0 is not a total cost. Squarespace and Umbraco Cloud publish euro prices, which are not converted; Contentful pricing could not be verified and AEM is quote only (all n/a). Webflow Basic has no CMS.',
    xLabel: 'USD per month, excluding hosting, apps and development', yLabel: 'CMS and plan', valueFormat: (v) => (v === 0 ? '0 (free software)' : `USD ${roundTo(v, 2)}`), legend: groupLegend(),
    items: items.map((i) => ({ label: i.label, slot: groupSlot(i.p), value: i.value, naNote: i.naNote })),
    footer: footer('vendor pricing pages (Webflow, Wix, WordPress.com, Ghost, Strapi, Sanity, Craft CMS)', 'cost', 'The total cost of ownership depends on hosting, extensions and developer time; the scenario inputs are in cost.csv.'),
  };
};

const costHosting = (data) => {
  const cats = [['Static website', 'Static website (50 GB files, 500 GB egress)'], ['Simple dynamic site', 'Simple dynamic site (2 vCPU VM, small PostgreSQL, 200 GB egress)']];
  const providers = ['AWS', 'Azure', 'Google Cloud'];
  return {
    type: 'groupedbar', id: 'cost-hosting', width: 860,
    title: 'Hosting cost assumptions per month',
    desc: 'Monthly cost in US dollars of two hosting profiles on AWS, Azure and Google Cloud, taken from the cloud providers comparison page: a static website of 50 GB files and 500 GB egress per month, and a simple dynamic site on a 2 vCPU 8 GiB virtual machine with a small managed PostgreSQL database, 100 GB of uploads and backups and 200 GB of egress. A self-hosted CMS adds this cost to its licence and development cost; hosted builders include it in the plan price.',
    xLabel: 'Hosting profile', yLabel: 'Cost (USD per month)', categories: cats.map((c) => c[1]), valueFormat: (v) => `USD ${roundTo(v, 0)}`,
    series: providers.map((prov) => ({
      name: prov,
      values: cats.map(([prefix]) => latest(data.cost, { platform: 'all', metric: 'hosting_cost_monthly_usd', item: new RegExp(`^${prefix}.* - ${prov}$`) })),
    })),
    footer: footer('provider price lists, as compiled in cloud/comparing-cloud-providers.adoc (2026-10-26)', 'cost', 'Prices in USD; the sourced euro rate for total-cost scenarios is not available, so total cost of ownership is not charted.'),
  };
};

// ---------------------------------------------------------------- support windows

const GANTT_IDS = ['wordpress', 'drupal', 'joomla', 'typo3', 'umbraco', 'craft-cms'];
const PHASES = [
  { key: 'main', label: 'Standard support (supported release line)', opacity: 0.9 },
  { key: 'extended', label: 'Extended or paid support (ELTS, Drupal 7 vendor support)', opacity: 0.5 },
  { key: 'security', label: 'Security fixes only', opacity: 0.25 },
];
const PHASE_KEY = { standard: 'main', security: 'security', extended: 'extended', elts: 'extended' };

function ganttGroups(data) {
  return GANTT_IDS.map((id, index) => {
    const rows = [];
    const all = data['support-windows'].filter((x) => x.platform === id && x.start !== 'n/a');
    for (const r of all) {
      let row = rows.find((x) => x.label === r.line);
      if (!row) { row = { label: r.line, segments: [] }; rows.push(row); }
      let end = r.end;
      if (end === 'n/a') {
        // An open end stops where a later phase of the same line begins; otherwise no end date is announced.
        const next = all.filter((x) => x.line === r.line && x.start > r.start).map((x) => x.start).sort()[0];
        end = next ?? 'open';
      }
      row.segments.push({ start: r.start, end, phase: PHASE_KEY[r.phase] ?? 'main' });
    }
    return { title: `${SHORT[id]} release lines`, legend: SHORT[id], slot: index, rows };
  });
}

const ganttSupport = (data) => ({
  type: 'gantt', id: 'support-windows-gantt', width: 980, rowH: 15,
  title: 'Release lines and support windows',
  desc: 'Support windows of WordPress, Drupal, Joomla, TYPO3, Umbraco and Craft CMS release lines, 2019 to 2033, with the check date marked; colour identifies the CMS in this figure. Opacity shows the phase: standard support, security fixes only, and extended or paid support (TYPO3 ELTS, Drupal 7 vendor support). Drupal 7 (ended 2025-01-05) and Joomla 3 (ended 2023-08-17) are historical rows. WordPress supports only its latest release and backports security fixes to older ones as a courtesy, so those segments have no announced end (an arrow marks an open end). TYPO3 and Craft CMS publish multi-year plans; the future dates are plans, not guarantees.',
  xLabel: 'Year', from: '2019-01-01', to: '2033-01-01', today: SNAPSHOT, phases: PHASES,
  groups: ganttGroups(data),
  footer: footer('endoflife.date, WordPress, Drupal, Joomla, TYPO3, Umbraco lifecycle pages', 'support-windows', 'Planned end dates can change.'),
});

// ---------------------------------------------------------------- radar and scatter

const FOOT_SCORES = 'editorial scores with their basis and source ids in radar-scores.csv; popularity, growth, talent pool and ecosystem from W3Techs, HTTP Archive, GitHub and Stack Exchange; performance from the HTTP Archive Tech Report';

const radarSpec = (data, id, title, ids, intro, slotByPosition = false) => {
  const scores = computeScores(data);
  return {
    type: 'slotradar', id, title, max: 10, unit: 'score 0-10, higher is better',
    desc: `${intro} Scores from 0 to 10 on twelve axes for ${names(ids)}. Five axes (popularity, growth, talent pool, ecosystem and performance) are computed from the data of ${SNAPSHOT} and seven are editorial scores with a recorded basis; the rubric is in the data notes. Low cost, low maintenance effort and portability are oriented so that a larger area is always better. A gap in the outline means no data (n/a).`,
    axes: AXES.map(([, label]) => label),
    series: ids.map((p, i) => ({ name: SHORT[p], slot: slotByPosition ? i : CMS_SLOT[p], values: AXES.map(([k]) => scores[p]?.[k] ?? null) })),
    footer: footer(FOOT_SCORES, 'radar-scores', 'Scores summarise the evidence and are not a benchmark.'),
  };
};

const groupRadar = (group) => (d) => radarSpec(d, `radar-${group.id}`, `${group.short}: scores on twelve axes`, group.members, `${group.title}.`);
const radarDocumented = (d) => radarSpec(d, 'radar-wordpress-webflow', 'WordPress against Webflow: scores on twelve axes', ['wordpress', 'webflow'], 'The two CMSs documented on this site.', true);
const radarMainstream = (d) => {
  const scores = computeScores(d);
  const ids = GROUPS.map((g) => leaderOf(g, scores));
  return radarSpec(d, 'radar-mainstream', 'Mainstream picks: scores on twelve axes', ids, 'The CMS with the highest computed popularity in each group.', true);
};

const axisLabel = (key) => AXES.find(([k]) => k === key)[1];
const isComputed = (key) => ['popularity', 'growth', 'talent', 'ecosystem', 'performance'].includes(key);

function scatter(id, xAxis, yAxis, title, desc) {
  return (data) => {
    const scores = computeScores(data);
    const series = GROUPS.map((g) => ({
      name: g.short,
      points: g.members.map((p) => ({ x: scores[p][xAxis], y: scores[p][yAxis], label: SHORT[p], weight: scores[p].popularity ?? 0 })),
    }));
    return {
      type: 'scatter', id, width: 900, height: 560, title, desc,
      xLabel: `${axisLabel(xAxis)} score 0-10 (${isComputed(xAxis) ? 'computed' : 'editorial'})`, yLabel: `${axisLabel(yAxis)} score 0-10 (${isComputed(yAxis) ? 'computed' : 'editorial'})`,
      xExtent: [0, 11.5], yExtent: [0, 10], series,
      footer: footer(FOOT_SCORES, 'radar-scores', 'A CMS missing either score is not plotted.'),
    };
  };
}

/** Chart builders: (data) => spec. The image file is cms-comparison-<id>.svg. */
export const CHART_BUILDERS = [
  w3History, w3Now,
  ...GROUPS.map((g) => originsMobile(g)),
  (d) => githubBars(d, 'github_stars', 'github-stars', 'GitHub stars of the main repositories', 'Stars', 'Stars measure interest, not usage.'),
  (d) => githubBars(d, 'github_contributors', 'github-contributors', 'GitHub contributors of the main repositories', 'Contributors', 'Contributors include anonymous authors.'),
  packagistInstalls, npmDownloads,
  ...GROUPS.map((g) => soQuestions(g)),
  soUsage, hnShare,
  ...GROUPS.flatMap((g) => [cwvSeries(g, 'mobile'), cwvSeries(g, 'desktop')]),
  cwvNow, lighthouseNow, vitalsNow('mobile'), vitalsNow('desktop'), lighthouseHistory,
  cvesCoreTraditional, cvesCoreOther, cvesEcosystem, advisoriesTraditional, advisoriesOther, patchstackShare,
  costEntryPlans, costHosting, ganttSupport,
  ...GROUPS.map((g) => groupRadar(g)), radarDocumented, radarMainstream,
  scatter('scatter-popularity-growth', 'popularity', 'growth', 'Popularity against growth',
    'Computed popularity (x: log-scaled W3Techs share and HTTP Archive origins) against computed growth (y: change in HTTP Archive mobile origins over three years, 5 = unchanged, 10 = doubled), coloured by group. Upper right: established and rising; lower right: established and shrinking; upper left: small and rising. Popularity counts visible fingerprints (W3Techs and HTTP Archive), so headless CMSs such as Strapi and Payload that leave few fingerprints are underestimated; their GitHub and npm figures are in the community charts. A CMS with no HTTP Archive series is not plotted.'),
  scatter('scatter-performance-ease', 'ease_developers', 'performance', 'Performance against ease of use for developers',
    'Editorial ease of use for developers (x) against computed performance (y: Core Web Vitals pass rate and Lighthouse score from the HTTP Archive), coloured by group. A CMS with no performance series is not plotted.'),
  scatter('scatter-cost-features', 'cost', 'features', 'Cost against features',
    'Editorial low-cost score (x: higher means cheaper) against the feature-matrix score (y), coloured by group. Contentful and AEM have no cost score (n/a) and are not plotted.'),
];
