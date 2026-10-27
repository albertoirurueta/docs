// Chart builders for the e-commerce platforms comparison page. Each builder takes the parsed CSV data ({ name: rows })
// and returns a chart spec for ./renderers.mjs. Platforms keep one palette slot (colour, dash, marker) in every figure.
// Missing (n/a) values are never plotted as zero.
import { toNumber } from '../language-charts/data-utils.mjs';
import { AXES, computeScores, PLATFORMS, PLATFORM_NAMES, PLATFORM_SLOT } from './scores.mjs';
import { decimalYear, yearMonthLabel } from './renderers.mjs';

export { decimalYear, yearMonthLabel };
export const SNAPSHOT = '2026-10-27';
const pct = (v) => `${roundTo(v, 1)}%`;
const roundTo = (v, d) => Number(v.toFixed(d));
const int = (v) => Math.round(v).toLocaleString('en-US');
const NAME = PLATFORM_NAMES;
const SHORT = { shopify: 'Shopify', prestashop: 'PrestaShop', magento: 'Magento', woocommerce: 'WooCommerce', wordpress: 'WordPress' };

const pick = (rows, f) => rows.filter((r) => Object.entries(f).every(([k, v]) => (v instanceof RegExp ? v.test(r[k]) : r[k] === v)));
const latest = (rows, f) => {
  const m = pick(rows, f).filter((r) => toNumber(r.value) !== null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return m.length ? toNumber(m.at(-1).value) : null;
};
const latestDate = (rows, f) => {
  const m = pick(rows, f).filter((r) => toNumber(r.value) !== null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return m.length ? m.at(-1).date : 'n/a';
};
const footer = (sources, file, extra = '') => `Source: ${sources}; retrieved ${SNAPSHOT}. ${extra}${extra ? ' ' : ''}Raw data: scripts/ecommerce-comparison-charts/data/${file}.csv. See the Bibliography for the sources.`;
const platformLegend = PLATFORMS.map((p) => ({ name: SHORT[p], slot: PLATFORM_SLOT[p] }));

/** Decimal year of a quarter label such as 2026-Q3. */
export function quarterYear(q) {
  const m = String(q).match(/^(\d{4})-Q([1-4])$/);
  return m ? Number(m[1]) + (Number(m[2]) - 1) / 4 : null;
}

// ---------------------------------------------------------------- performance (HTTP Archive)

function cwvSeries(data, dev) {
  return {
    type: 'slotline', id: `cwv-${dev}`, width: 900,
    title: `Core Web Vitals pass rate, ${dev}`,
    desc: `Share of origins passing all Core Web Vitals on ${dev} devices for each platform, monthly from 2020-01 to ${latestDate(data.performance, { platform: 'shopify', metric: `cwv_pass_${dev}` })}, from the HTTP Archive Tech Report. A dashed vertical line marks March 2024, when INP replaced FID in the definition, so the series is not strictly comparable across it. Shopify is highest, WooCommerce lowest. This is origin-level field data, not a controlled benchmark.`,
    xLabel: 'Month (year)', yLabel: `Origins passing Core Web Vitals, ${dev} (%)`, yInclude: [0, 100], yFormat: (v) => `${v}%`,
    vlines: [{ x: decimalYear('2024-03'), label: '2024-03 INP replaces FID' }],
    series: PLATFORMS.map((p) => ({
      name: SHORT[p], slot: PLATFORM_SLOT[p],
      points: pick(data.performance, { platform: p, metric: `cwv_pass_${dev}` }).map((r) => ({ x: decimalYear(r.date), y: toNumber(r.value) })),
    })),
    footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/cwv)', 'performance', 'Survivor bias may flatter the shrinking PrestaShop and Magento populations.'),
  };
}

function groupedNow(data, id, title, desc, metricPrefix, catLabels, scale, fmtFn, yLabel, srcName, file, extra = '') {
  return {
    type: 'groupedbar', id, title, desc, width: 860,
    xLabel: 'Device class', yLabel, categories: catLabels, valueFormat: fmtFn,
    series: PLATFORMS.map((p) => ({
      name: SHORT[p],
      values: ['mobile', 'desktop'].map((d) => { const v = latest(data.performance, { platform: p, metric: `${metricPrefix}_${d}` }); return v === null ? null : roundTo(v * scale, 1); }),
    })),
    footer: footer(srcName, file, extra),
  };
}

const cwvNow = (d) => groupedNow(d, 'cwv-now', 'Core Web Vitals pass rate now',
  `Share of origins passing all Core Web Vitals in ${latestDate(d.performance, { platform: 'shopify', metric: 'cwv_pass_mobile' })}, mobile and desktop, for Shopify, PrestaShop, Magento and WooCommerce (HTTP Archive Tech Report). Shopify leads with about three quarters of origins passing; WooCommerce trails with about two fifths.`,
  'cwv_pass', ['Mobile', 'Desktop'], 1, pct, 'Origins passing Core Web Vitals (%)', 'HTTP Archive Tech Report (cdn.httparchive.org/v1/cwv)', 'performance');

const lighthouseNow = (d) => groupedNow(d, 'lighthouse-now', 'Median Lighthouse performance score now',
  `Median Lighthouse performance score (0 to 100) of origins detected for each platform in ${latestDate(d.performance, { platform: 'shopify', metric: 'lighthouse_performance_mobile' })}, mobile and desktop (HTTP Archive Tech Report). Lab scores come from a throttled test profile and are lower than real-user experience on fast devices.`,
  'lighthouse_performance', ['Mobile', 'Desktop'], 100, (v) => String(roundTo(v, 1)), 'Median Lighthouse performance score (0-100)', 'HTTP Archive Tech Report (cdn.httparchive.org/v1/lighthouse)', 'performance', 'Lab data, median over origins.');

function webAlmanacVitals(data, dev) {
  const cats = [['lcp', 'Good LCP'], ['inp', 'Good INP'], ['cls', 'Good CLS'], ['cwv', 'Good CWV (all three)']];
  return {
    type: 'groupedbar', id: `webalmanac-vitals-${dev}`, width: 860,
    title: `Web Almanac 2025 vitals, ${dev}`,
    desc: `Share of ${dev} origins with a good Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift and all three together, per platform, from the Web Almanac 2025 e-commerce chapter. INP is good for almost every platform on desktop; LCP separates the platforms most, with Shopify at the top.`,
    xLabel: 'Core Web Vital', yLabel: `Origins with a good value, ${dev} (%)`, categories: cats.map((c) => c[1]), valueFormat: (v) => `${v}%`,
    series: PLATFORMS.map((p) => ({ name: SHORT[p], values: cats.map(([k]) => latest(data.performance, { platform: p, metric: `webalmanac_good_${k}_${dev}` })) })),
    footer: footer('HTTP Archive Web Almanac 2025, Ecommerce chapter, CWV tables (2025 crawl)', 'performance', 'Values are rounded to whole percent in the source.'),
  };
}

// ---------------------------------------------------------------- popularity

function adoption(data, dev) {
  return {
    type: 'slotline', id: `adoption-${dev}`, width: 900,
    title: `Origins using each platform, ${dev}`,
    desc: `Number of origins in the HTTP Archive crawl detected as using each platform on ${dev}, monthly from 2020-01 to ${latestDate(data.popularity, { platform: 'shopify', metric: `httparchive_origins_${dev}` })}. WooCommerce and Shopify are an order of magnitude ahead of PrestaShop and Magento. Origins are websites visited in the Chrome UX Report, not live stores.`,
    xLabel: 'Month (year)', yLabel: `Origins detected, ${dev} (count)`,
    series: PLATFORMS.map((p) => ({ name: SHORT[p], slot: PLATFORM_SLOT[p], points: pick(data.popularity, { platform: p, metric: `httparchive_origins_${dev}` }).map((r) => ({ x: decimalYear(r.date), y: toNumber(r.value) })) })),
    footer: footer('HTTP Archive Tech Report (cdn.httparchive.org/v1/adoption)', 'popularity', 'Counts origins in the crawl, not stores.'),
  };
}

const liveStores = (data) => ({
  type: 'slotline', id: 'live-stores', width: 900,
  title: 'Live stores per quarter',
  desc: `Active (live) stores detected by Store Leads at the end of each quarter, 2019-Q1 to 2026-Q4 to date. WooCommerce and Shopify have millions of stores; PrestaShop peaked near 220,000 in 2022-Q3 and Magento near 164,000 in 2022-Q4 and both have declined since. The last point of each series is the current quarter to date.`,
  xLabel: 'Quarter (year)', yLabel: 'Active stores detected (count)',
  series: PLATFORMS.map((p) => ({ name: SHORT[p], slot: PLATFORM_SLOT[p], points: pick(data.popularity, { platform: p, metric: 'storeleads_live_stores' }).map((r) => ({ x: quarterYear(r.date), y: toNumber(r.value) })) })),
  footer: footer('Store Leads reports (storeleads.app/reports)', 'popularity', 'Detected stores, not official counts.'),
});

const liveStoresNow = (data) => ({
  type: 'slotbars', id: 'live-stores-now', width: 860,
  title: 'Live stores now',
  desc: `Active stores detected by Store Leads in the current quarter to date (${latestDate(data.popularity, { platform: 'shopify', metric: 'storeleads_live_stores' })}): WooCommerce about 4.3 million, Shopify about 3.2 million, PrestaShop about 145,000 and Magento about 102,000.`,
  xLabel: 'Active stores detected (count)', yLabel: 'Platform', valueFormat: int, legend: platformLegend,
  items: PLATFORMS.map((p) => ({ label: SHORT[p], slot: PLATFORM_SLOT[p], value: latest(data.popularity, { platform: p, metric: 'storeleads_live_stores' }) })).sort((a, b) => (b.value ?? -1) - (a.value ?? -1)),
  footer: footer('Store Leads reports (storeleads.app/reports)', 'popularity', 'The quarter is partial.'),
});

const w3Share = (data) => {
  const cats = [['w3techs_share_all_sites', 'Share of all websites'], ['w3techs_share_known_cms', 'Share of sites with a known CMS'], ['w3techs_share_ecommerce_systems', 'Share of e-commerce systems']];
  return {
    type: 'groupedbar', id: 'w3techs-share', width: 860,
    title: 'W3Techs market share',
    desc: 'Share of all websites, of websites whose content management system is known and of e-commerce systems for each platform on 2026-10-27 (W3Techs). WooCommerce holds 47.4% of e-commerce systems and Shopify 32.4%. W3Techs labels Magento as Adobe Commerce and counts WooCommerce inside WordPress.',
    xLabel: 'Population the share is taken from', yLabel: 'Share (%)', categories: cats.map((c) => c[1]), valueFormat: pct,
    series: PLATFORMS.map((p) => ({ name: SHORT[p], values: cats.map(([m]) => latest(data.popularity, { platform: p, metric: m })) })),
    footer: footer('W3Techs (w3techs.com/technologies/details/cm-<system>)', 'popularity', 'Daily-updated survey of the top 10 million sites.'),
  };
};

const w3History = (data) => ({
  type: 'slotline', id: 'w3techs-history', width: 860,
  title: 'W3Techs yearly share of all websites',
  desc: 'Yearly share of all websites using Shopify and WordPress (the platform under WooCommerce) from 2015 to 2026-10-27 according to W3Techs. W3Techs publishes yearly history only for systems above 1% of all sites, so PrestaShop, Magento and WooCommerce have no yearly series (n/a); their current values are in the W3Techs market share figure.',
  xLabel: 'Year (1 January; last point 2026-10-27)', yLabel: 'Share of all websites (%)', yFormat: (v) => `${v}%`,
  series: ['shopify', 'wordpress'].map((p) => ({
    name: p === 'shopify' ? 'Shopify' : 'WordPress (context for WooCommerce)', slot: PLATFORM_SLOT[p],
    points: pick(data.popularity, { platform: p, metric: 'w3techs_share_all_sites_yearly' }).map((r) => ({ x: decimalYear(r.date), y: toNumber(r.value) })),
  })),
  footer: footer('W3Techs historical yearly trends (w3techs.com/technologies/history_overview/content_management/all/y)', 'popularity'),
});

function soYear(data) {
  const years = [];
  for (let y = 2014; y <= 2025; y++) years.push(String(y));
  const tags = { shopify: ['shopify'], prestashop: ['prestashop'], magento: ['magento', 'magento2'], woocommerce: ['woocommerce'] };
  return {
    type: 'slotline', id: 'stackoverflow-year', width: 860,
    title: 'Stack Overflow questions per year',
    desc: 'Questions asked each year on Stack Overflow with the tag shopify, prestashop, magento plus magento2 (summed) and woocommerce, 2014 to 2025. All tags peaked between 2015 and 2020 and fall steeply from 2023, mirroring the decline of the whole site, so the trend says little about platform popularity. The partial year 2026 is omitted.',
    xLabel: 'Year asked', yLabel: 'Questions asked (count)',
    series: PLATFORMS.map((p) => ({
      name: p === 'magento' ? 'Magento (magento + magento2 tags)' : `${SHORT[p]} (tag ${tags[p][0]})`, slot: PLATFORM_SLOT[p],
      points: years.map((y) => ({ x: Number(y), y: tags[p].reduce((a, t) => a + (toNumber(pick(data.popularity, { platform: p, metric: 'stackexchange_questions_year', item: `stackoverflow: tag ${t}`, date: y })[0]?.value) ?? 0), 0) })),
    })),
    footer: footer('Stack Exchange API (api.stackexchange.com)', 'popularity', 'Questions tagged with both magento and magento2 count twice.'),
  };
}

function seSites(data) {
  const years = [];
  for (let y = 2014; y <= 2025; y++) years.push(String(y));
  const s = (label, slot, platform, item) => ({ name: label, slot, points: years.map((y) => ({ x: Number(y), y: toNumber(pick(data.popularity, { platform, metric: 'stackexchange_questions_year', item, date: y })[0]?.value) })) });
  return {
    type: 'slotline', id: 'stackexchange-sites', width: 860,
    title: 'Questions on dedicated Stack Exchange sites',
    desc: 'Questions asked per year on magento.stackexchange.com (all questions), on wordpress.stackexchange.com tagged woocommerce, and on wordpress.stackexchange.com overall as context, 2014 to 2025. All three decline, and the dedicated Magento site peaked in 2016 with about 18,000 questions.',
    xLabel: 'Year asked', yLabel: 'Questions asked (count)',
    series: [s('magento.stackexchange.com (all questions)', PLATFORM_SLOT.magento, 'magento', 'magento.stackexchange: all questions'),
      s('wordpress.stackexchange.com, tag woocommerce', PLATFORM_SLOT.woocommerce, 'woocommerce', 'wordpress: tag woocommerce'),
      s('wordpress.stackexchange.com (all, context)', PLATFORM_SLOT.wordpress, 'woocommerce', 'wordpress: all questions')],
    footer: footer('Stack Exchange API (api.stackexchange.com)', 'popularity'),
  };
}

function npmDownloads(data) {
  const ser = (platform, item, name, variant) => {
    const rows = pick(data.popularity, { platform, metric: 'npm_downloads_year', item }).filter((r) => toNumber(r.value) !== null).sort((a, b) => a.date.localeCompare(b.date));
    while (rows.length && toNumber(rows[0].value) === 0) rows.shift();
    return { name, slot: PLATFORM_SLOT[platform], variant, points: rows.map((r) => ({ x: Number(r.date), y: toNumber(r.value) })) };
  };
  return {
    type: 'slotline', id: 'npm-downloads', width: 860,
    title: 'npm downloads per year',
    desc: 'Yearly npm downloads of @shopify/cli and @shopify/hydrogen and of the @woocommerce/components, @woocommerce/data and @woocommerce/settings packages, 2020 to 2026 year to date (up to 2026-10-26). Shopify CLI grew from about 0.3 million downloads in 2022 to 15.7 million in 2026 to date. Counts include CI and mirror traffic. PrestaShop and Magento ship through Composer, so they have no npm series.',
    xLabel: 'Year (2026 is year to date)', yLabel: 'Downloads per year (npm, includes CI)',
    series: [ser('shopify', '@shopify/cli', '@shopify/cli', 0), ser('shopify', '@shopify/hydrogen', '@shopify/hydrogen', 1),
      ser('woocommerce', '@woocommerce/components', '@woocommerce/components', 0), ser('woocommerce', '@woocommerce/data', '@woocommerce/data', 2), ser('woocommerce', '@woocommerce/settings', '@woocommerce/settings', 3)],
    footer: footer('npm downloads API (api.npmjs.org)', 'popularity', 'Not comparable with Composer or WordPress.org counts.'),
  };
}

const wporgDownloads = (data) => ({
  type: 'slotline', id: 'wporg-downloads', width: 860,
  title: 'WooCommerce downloads per week on WordPress.org',
  desc: 'Weekly downloads of the WooCommerce plugin from WordPress.org for the complete Monday-to-Sunday weeks of the last 180 days (the API returns no longer window), from early May to late October 2026. Downloads include automatic updates of existing installs, so peaks follow release days. Active installs are only published as the rounded band 7,000,000+.',
  xLabel: 'Week start (year-month)', yLabel: 'Downloads per week (WordPress.org)', xFormat: yearMonthLabel,
  series: [{ name: 'WooCommerce', slot: PLATFORM_SLOT.woocommerce, points: pick(data.popularity, { platform: 'woocommerce', metric: 'wporg_downloads_week' }).map((r) => ({ x: decimalYear(r.date), y: toNumber(r.value) })) }],
  footer: footer('WordPress.org plugin stats API (api.wordpress.org/stats/plugin/1.0/downloads.php)', 'popularity', 'Only about 180 days are available.'),
});

function githubBars(data, metric, id, title, unit, desc) {
  const repos = [['shopify', 'Shopify/cli'], ['shopify', 'Shopify/hydrogen'], ['shopify', 'Shopify/dawn'], ['prestashop', 'PrestaShop/PrestaShop'], ['magento', 'magento/magento2'], ['magento', 'mage-os/mageos-magento2'], ['woocommerce', 'woocommerce/woocommerce']];
  return {
    type: 'slotbars', id, title, desc, width: 860,
    xLabel: `${unit} (count)`, yLabel: 'GitHub repository', valueFormat: int, legend: platformLegend,
    items: repos.map(([p, repo]) => ({ label: repo === 'mage-os/mageos-magento2' ? `${repo} (Mage-OS fork)` : repo, slot: PLATFORM_SLOT[p], value: latest(data.popularity, { platform: p, metric, item: repo }) })),
    footer: footer('GitHub REST API (api.github.com)', 'popularity', metric === 'github_contributors' ? 'Contributors include anonymous authors (anon=1); Mage-OS inherits the Magento history.' : 'Stars measure interest, not usage.'),
  };
}

// ---------------------------------------------------------------- security

function cveSeries(data, id, title, desc, defs, footerExtra) {
  const years = [];
  for (let y = 2015; y <= 2026; y++) years.push(String(y));
  return {
    type: 'slotline', id, width: 860, title, desc,
    xLabel: 'Year published (2026 to 2026-10-27, NVD lags)', yLabel: 'CVEs published (NVD, count)',
    series: defs.map(([p, item, name, variant]) => ({ name, slot: PLATFORM_SLOT[p], variant, points: years.map((y) => ({ x: Number(y), y: toNumber(pick(data.security, { platform: p, metric: 'nvd_cves_year', item, date: y })[0]?.value) })) })),
    footer: footer('NVD CVE API 2.0 (services.nvd.nist.gov)', 'security', footerExtra),
  };
}

const cvesCore = (d) => cveSeries(d, 'cves-core', 'CVEs per year, platform core',
  'CVEs published per year in the NVD for the core of each self-hosted platform: PrestaShop core, Magento Open Source plus Adobe Commerce, and the WooCommerce plugin. Magento had a 2019 batch of 137 and 63 in 2024; PrestaShop peaked at 32 in 2020; WooCommerce core never exceeds 4 a year. Shopify is a SaaS platform: it fixes its platform without CVEs, so it has no core series and is not comparable.',
  [['prestashop', 'core:prestashop_core_cpe', 'PrestaShop core', 0], ['magento', 'core:magento_union', 'Magento + Adobe Commerce', 0], ['woocommerce', 'core:woocommerce_core_cpe', 'WooCommerce core', 0]],
  'CVE counts measure disclosure, not real risk.');

const cvesEcosystem = (d) => cveSeries(d, 'cves-ecosystem', 'CVEs per year, ecosystem and keyword search',
  'CVEs published per year in the NVD that mention each platform: keyword search for PrestaShop, Magento and WooCommerce (modules, extensions and plugins) and the open-source libraries of Shopify (vendor CPE). The WooCommerce keyword series grows from 87 in 2022 to 893 in 2026 to date, driven by WordPress CNAs issuing CVEs in bulk. Shopify counts cover only its open-source libraries and CLI, not the SaaS platform.',
  [['shopify', 'ecosystem:shopify_vendor_cpe', 'Shopify open-source libraries', 1], ['prestashop', 'ecosystem:keyword_prestashop', 'PrestaShop keyword (modules)', 1], ['magento', 'ecosystem:keyword_magento', 'Magento keyword (extensions)', 1], ['woocommerce', 'ecosystem:keyword_woocommerce', 'WooCommerce keyword (plugins)', 1]],
  'Keyword searches also match unrelated mentions; Shopify has no CVEs for the SaaS platform.');

function advisories(data) {
  const years = [];
  for (let y = 2019; y <= 2026; y++) years.push(String(y));
  const s = (name, slot, variant, metric, item) => ({ name, slot, variant, points: years.map((y) => ({ x: Number(y), y: toNumber(pick(data.security, { metric, item, date: y })[0]?.value) })) });
  return {
    type: 'slotline', id: 'advisories-year', width: 860,
    title: 'Security advisories per year',
    desc: 'Security advisories published per year: PrestaShop core (GitHub repository advisories), PrestaShop modules (Friends-of-Presta advisory posts, 141 in 2023) and Adobe Commerce security bulletins (APSB, between 4 and 7 a year). The three series count different things: a bulletin bundles many CVEs, a Friends-of-Presta post covers one module.',
    xLabel: 'Year published (2026 to 2026-10-27)', yLabel: 'Advisories or bulletins published (count)',
    series: [s('PrestaShop core (GitHub advisories)', PLATFORM_SLOT.prestashop, 0, 'advisories_year', 'core:ghsa_repo_prestashop'),
      s('PrestaShop modules (Friends-of-Presta)', PLATFORM_SLOT.prestashop, 1, 'advisories_year', 'ecosystem:friendsofpresta_advisories'),
      s('Adobe Commerce bulletins (APSB)', PLATFORM_SLOT.magento, 0, 'apsb_bulletins_year', 'core:apsb_adobe_commerce')],
    footer: footer('GitHub REST API, Friends-of-Presta repository, Adobe HelpX security bulletins', 'security', 'Not comparable between series.'),
  };
}

// ---------------------------------------------------------------- cost

const costMonthly = (data) => {
  const price = (name) => latest(data.cost, { platform: 'shopify', metric: 'plan_price_monthly', item: name });
  const free = (p, item) => latest(data.cost, { platform: p, metric: 'plan_price_monthly', item });
  return {
    type: 'slotbars', id: 'cost-monthly', width: 860,
    title: 'Entry platform cost per month',
    desc: 'Platform subscription or licence per month, billed monthly, in euro: Shopify Basic 32, Grow 92, Advanced 384 and Plus from 2,100; PrestaShop, Magento Open Source and WooCommerce are free software (0) but need hosting, extensions and development whose cost varies too much to chart; Adobe Commerce is quote-based (n/a). Card fees are charted separately.',
    xLabel: 'Platform fee (EUR per month, billed monthly, excluding hosting and apps)', yLabel: 'Plan', valueFormat: (v) => (v === 0 ? '0 (free software)' : `EUR ${int(v)}`), legend: platformLegend,
    items: [
      { label: 'Shopify Basic', slot: 0, value: price('Basic') }, { label: 'Shopify Grow', slot: 0, value: price('Grow') }, { label: 'Shopify Advanced', slot: 0, value: price('Advanced') }, { label: 'Shopify Plus (from)', slot: 0, value: price('Plus') },
      { label: 'PrestaShop', slot: 1, value: free('prestashop', 'PrestaShop software') }, { label: 'Magento Open Source', slot: 2, value: free('magento', 'Magento Open Source') },
      { label: 'Adobe Commerce', slot: 2, value: free('magento', 'Adobe Commerce'), naNote: 'quote-based' }, { label: 'WooCommerce', slot: 3, value: free('woocommerce', 'WooCommerce plugin') },
    ],
    footer: footer('Shopify pricing page (EUR), WordPress.org, PrestaShop project, Adobe Commerce product page', 'cost', 'Hosting, themes, extensions and development are not included for the open-source options.'),
  };
};

const costCards = (data) => {
  const sh = (n) => latest(data.cost, { platform: 'shopify', metric: 'card_rate_percent', item: n });
  return {
    type: 'slotbars', id: 'cost-card-rates', width: 860,
    title: 'Card payment rate per transaction',
    desc: 'Percentage part of the online card rate (a fixed fee of 0.30 per transaction is added): Shopify Payments 2.1% on Basic down to 1.3% on Plus, WooPayments 2.9% for US cards and 1.5% for European cards (with 0.25 fixed). PrestaShop and Magento have no built-in processor; the rate depends on the gateway chosen (n/a).',
    xLabel: 'Card rate (% of transaction, plus a fixed fee)', yLabel: 'Platform and plan', valueFormat: pct, legend: platformLegend,
    items: [
      { label: 'Shopify Basic', slot: 0, value: sh('Basic') }, { label: 'Shopify Grow', slot: 0, value: sh('Grow') }, { label: 'Shopify Advanced', slot: 0, value: sh('Advanced') }, { label: 'Shopify Plus', slot: 0, value: sh('Plus') },
      { label: 'PrestaShop', slot: 1, value: null, naNote: 'depends on gateway' }, { label: 'Magento', slot: 2, value: null, naNote: 'depends on gateway' },
      { label: 'WooPayments (US cards)', slot: 3, value: latest(data.cost, { platform: 'woocommerce', metric: 'woopayments_card_rate_percent', item: 'United States cards' }) },
      { label: 'WooPayments (Europe cards)', slot: 3, value: latest(data.cost, { platform: 'woocommerce', metric: 'woopayments_card_rate_percent', item: 'Europe cards (example: Austria)' }) },
    ],
    footer: footer('Shopify pricing page (EUR), WooPayments fees page', 'cost', 'Third-party gateways add their own fees; Shopify also charges 0.2% to 2% on third-party gateways.'),
  };
};

// ---------------------------------------------------------------- release and support timelines

const MAIN = ['standard', 'maintained', 'stable', 'release'];
function ganttGroups(data, platforms) {
  return platforms.map(({ platform, title, legend, filter }) => {
    const rows = [];
    for (const r of data['support-windows'].filter((x) => x.platform === platform && (!filter || filter(x)))) {
      let row = rows.find((x) => x.label === r.line);
      if (!row) { row = { label: r.line, segments: [] }; rows.push(row); }
      row.segments.push({ start: r.start, end: r.end, phase: MAIN.includes(r.phase) ? 'main' : r.phase });
    }
    return { title, legend, slot: PLATFORM_SLOT[platform], rows };
  });
}
const PHASES = [{ key: 'main', label: 'Supported release line', opacity: 0.9 }, { key: 'extended', label: 'Extended support', opacity: 0.5 }, { key: 'security', label: 'Security fixes only', opacity: 0.25 }];

const ganttSupport = (data) => ({
  type: 'gantt', id: 'release-support-gantt', width: 960, rowH: 18,
  title: 'Release lines and support windows',
  desc: 'Timeline of PrestaShop minor releases (8.0 to 9.2, each maintained until the next minor shipped, with 8.2 in extended support until 10.0.0 and no end date), Magento 2.4.5 to 2.4.9 (three years of standard support, then extended and security-only phases) and Shopify API versions 2025-01 to 2026-10 (supported at least 12 months). PrestaShop publishes no end-of-life dates, so its end dates are inferred from the release lifecycle policy; an arrow marks an open end.',
  xLabel: 'Year', from: '2022-01-01', to: '2030-01-01', today: SNAPSHOT, phases: PHASES,
  groups: ganttGroups(data, [
    { platform: 'prestashop', title: 'PrestaShop minor releases', legend: 'PrestaShop' },
    { platform: 'magento', title: 'Magento / Adobe Commerce 2.4.x', legend: 'Magento' },
    { platform: 'shopify', title: 'Shopify API versions (minimum 12 months)', legend: 'Shopify' },
  ]),
  footer: footer('Adobe Commerce lifecycle policy, PrestaShop release lifecycle (devdocs), Shopify API versioning, GitHub releases', 'support-windows', 'PrestaShop end dates are inferred from policy, not announced.'),
});

const ganttWoo = (data) => ({
  type: 'gantt', id: 'woocommerce-release-gantt', width: 960, rowH: 15,
  title: 'WooCommerce releases since 2024',
  desc: 'Release timeline of every WooCommerce minor release line from 8.5 (January 2024) to 11.2 (October 2026): about one every five weeks, each line current until the next one ships. Security fixes are backported to the last 21 major versions only when the CVSS score is 9 or higher, so a store on an older line may get no patch for a lower-severity issue.',
  xLabel: 'Year', from: '2024-01-01', to: '2027-01-01', today: SNAPSHOT, phases: [{ key: 'main', label: 'Current release line until the next one ships', opacity: 0.9 }],
  groups: ganttGroups(data, [{ platform: 'woocommerce', title: 'WooCommerce minor releases', legend: 'WooCommerce' }]),
  footer: footer('GitHub releases API (api.github.com/repos/woocommerce/woocommerce/releases), WooCommerce developer docs', 'support-windows', 'Start is the first non-pre-release of a line.'),
});

// ---------------------------------------------------------------- radar

const radarSpec = (data, id, title, platforms) => {
  const scores = computeScores(data);
  return {
    type: 'slotradar', id, title, max: 10, unit: 'score 0-10, higher is better',
    desc: `Scores from 0 to 10 on ten axes for ${platforms.map((p) => NAME[p]).join(', ')}. Eight axes are editorial scores with a recorded basis and two (performance and ecosystem) are computed from the data of ${SNAPSHOT}; the rubric is in the data notes. Low maintenance effort and low cost are inverted so that a larger area is always better.`,
    axes: AXES.map(([, label]) => label),
    series: platforms.map((p) => ({ name: NAME[p], slot: PLATFORM_SLOT[p], values: AXES.map(([k]) => scores[p]?.[k] ?? null) })),
    footer: footer('editorial scores with their basis in radar-scores.csv; performance from the HTTP Archive Tech Report; ecosystem from Store Leads, Stack Exchange and GitHub', 'radar-scores', 'Scores summarise the evidence and are not a benchmark.'),
  };
};

/** Chart builders: (data) => spec. The image file is ecommerce-comparison-<id>.svg. */
export const CHART_BUILDERS = [
  (d) => cwvSeries(d, 'mobile'), (d) => cwvSeries(d, 'desktop'), cwvNow, lighthouseNow,
  (d) => webAlmanacVitals(d, 'mobile'), (d) => webAlmanacVitals(d, 'desktop'),
  (d) => adoption(d, 'mobile'), (d) => adoption(d, 'desktop'), liveStores, liveStoresNow, w3Share, w3History,
  soYear, seSites, npmDownloads, wporgDownloads,
  (d) => githubBars(d, 'github_stars', 'github-stars', 'GitHub stars of the main repositories', 'Stars', 'Stars of the main repository of each platform on 2026-10-27: magento/magento2 12,212, woocommerce/woocommerce 10,570, PrestaShop/PrestaShop 9,237, and for Shopify the CLI, Hydrogen and the Dawn theme (764, 2,159 and 3,104). Shopify itself is closed source, so its stars reflect only its open-source tools.'),
  (d) => githubBars(d, 'github_contributors', 'github-contributors', 'GitHub contributors of the main repositories', 'Contributors', 'Contributors (including anonymous authors) of the main repositories on 2026-10-27: magento/magento2 3,202, woocommerce/woocommerce 2,149, PrestaShop/PrestaShop 1,351, and for Shopify the CLI 353, Hydrogen 146 and Dawn 107. The Mage-OS fork inherits the Magento history.'),
  cvesCore, cvesEcosystem, advisories, costMonthly, costCards, ganttSupport, ganttWoo,
  (d) => radarSpec(d, 'radar-all', 'Scores on ten axes, four platforms', PLATFORMS),
  ...PLATFORMS.map((p) => (d) => radarSpec(d, `radar-${p}`, `${SHORT[p]} scores on ten axes`, [p])),
];
