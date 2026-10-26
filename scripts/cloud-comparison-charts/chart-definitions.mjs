// Chart builders for the "Comparing cloud providers" page. Each builder takes the parsed CSV data ({ name: rows }) and
// returns a spec for the renderers of scripts/language-charts/generate-charts.mjs and ./renderers.mjs. Missing (n/a)
// values are never plotted as zero, and every figure lists the providers in the fixed order of ./providers.mjs so a
// provider keeps its colour. Data that is not like for like is never joined: the Synergy and Canalys shares are separate
// figures, the Synergy series is broken where the note says so, each survey keeps its own panel or figure and the
// revenue chart uses one definition per provider.
import { toNumber } from '../language-charts/data-utils.mjs';
import { PROVIDERS, PROVIDER_COLORS, PROVIDER_IDS, providerId, providerIndex, providerName } from './providers.mjs';
import { AXES, computeScores } from './scores.mjs';
import { FIT_LEVELS, recommendationSpecRows } from './matrix.mjs';

/** Snapshot date: the `retrieved` date shared by the data files. */
export const snapshotOf = (data) => data['market-share'][0]?.retrieved ?? 'n/a';

/** Decimal year of a quarter label such as 2024-Q3 (start of the quarter): 2024.5. */
export function quarterYear(q) {
  const m = /^(\d{4})-Q([1-4])$/.exec(String(q));
  return m ? Number(m[1]) + (Number(m[2]) - 1) / 4 : null;
}

/** Decimal year for an ISO date: 2026-07-01 -> 2026.5. */
export function decimalYear(iso) {
  const [y, m = '01', d = '01'] = String(iso).split('-');
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}

/** Sorted unique source ids (the `source` column may hold several, separated by `;`). */
export function sourceIds(rows) {
  const ids = new Set();
  for (const r of rows) for (const s of String(r.source ?? '').split(';')) if (s.trim()) ids.add(s.trim());
  return [...ids].sort();
}

const footer = (data, rows, extra = '') => `Sources: ${sourceIds(rows).join(', ')}. Data as of ${snapshotOf(data)}${extra ? `. ${extra}` : ''}.`;

/** One series per provider, always in the fixed order; `points(rows)` builds the points of one provider. */
function providerSeries(rows, idOf, names, points) {
  return PROVIDER_IDS.map((id) => ({
    name: names[id] ?? providerName(id),
    points: points(rows.filter((r) => idOf(r) === id)).sort((a, b) => a.x - b.x),
  }));
}

// ---------------------------------------------------------------- market share

const MAIN_SYNERGY_SCOPE = 'cloud infrastructure services';

function marketShareSynergy(data) {
  const rows = data['market-share'].filter((r) => r.firm.startsWith('Synergy'));
  const series = providerSeries(rows, (r) => providerId(r.provider), {}, (own) => {
    const pts = [];
    for (const r of own.sort((a, b) => a.quarter.localeCompare(b.quarter))) {
      const x = quarterYear(r.quarter);
      const odd = !r.scope.startsWith(MAIN_SYNERGY_SCOPE); // another definition (public IaaS and PaaS only): stays isolated
      if (odd || /series break/i.test(r.note)) pts.push({ x: x - 0.01, y: null }); // never join across a break
      pts.push({ x, y: toNumber(r.share_pct) });
      if (odd) pts.push({ x: x + 0.01, y: null });
    }
    return pts;
  });
  return {
    type: 'line', id: 'market-share', width: 900, yZero: true,
    title: 'Cloud infrastructure market share (Synergy Research Group)',
    desc: `Worldwide share of cloud infrastructure services spend of AWS, Azure (Microsoft) and Google Cloud per quarter from 2018-Q3 to 2026-Q2, as published by Synergy Research Group (data as of ${snapshotOf(data)}). Gaps are quarters where a share was not published. The Microsoft line is broken at 2024-Q3, where Synergy reclassified part of Azure revenue as SaaS, so the values before and after the break are not comparable. The 2019-Q3 release used another scope (public IaaS and PaaS only), so it is drawn as isolated points.`,
    xLabel: 'Quarter (year)', yLabel: 'Share of worldwide spend (%)',
    footer: footer(data, rows, 'Gaps: share not published. Microsoft line broken at 2024-Q3 (Synergy reclassified part of Azure revenue as SaaS); 2019-Q3 uses another scope and is not joined. Canalys (Omdia) shares use another definition and are in a separate figure'),
    series,
  };
}

function marketShareCanalys(data) {
  const rows = data['market-share'].filter((r) => r.firm.startsWith('Canalys'));
  const quarters = [...new Set(rows.map((r) => r.quarter))].sort()
    .filter((q) => rows.some((r) => r.quarter === q && toNumber(r.share_pct) !== null));
  return {
    type: 'groupedbar', id: 'market-share-canalys', width: 860,
    title: 'Cloud infrastructure market share (Canalys, now part of Omdia)',
    desc: `Worldwide share of cloud infrastructure services spend of AWS, Azure and Google Cloud in the quarters where Canalys (Omdia) published a share per provider (data as of ${snapshotOf(data)}). A bar labelled n/a means the share was not published, not zero. The definition differs from Synergy Research Group, so the two sources are never combined.`,
    xLabel: 'Quarter', yLabel: 'Share of worldwide spend (%)', valueFormat: (v) => `${v}%`,
    footer: footer(data, rows, 'n/a: share not published. The Canalys (Omdia) definition differs from Synergy, so the series are not combined'),
    categories: quarters,
    series: PROVIDERS.map((p) => ({
      name: p.name,
      values: quarters.map((q) => rows.filter((r) => r.quarter === q && providerId(r.provider) === p.id).map((r) => toNumber(r.share_pct))[0] ?? null),
    })),
  };
}

// ---------------------------------------------------------------- revenue and growth

const REVENUE_NAMES = {
  aws: 'AWS (segment net sales)',
  azure: 'Microsoft Intelligent Cloud (broader than Azure)',
  'google-cloud': 'Google Cloud (segment, includes Workspace)',
};
const GROWTH_NAMES = {
  aws: 'AWS (segment net sales)',
  azure: 'Azure and other cloud services (reported)',
  'google-cloud': 'Google Cloud (segment, includes Workspace)',
};

function revenue(data) {
  // One definition per provider: Microsoft rows on the FY25-and-later segment definition only (comparable = yes).
  const rows = data.revenue.filter((r) => toNumber(r.revenue_usd_m) !== null && /^yes/.test(r.comparable));
  return {
    type: 'line', id: 'revenue', width: 900, yZero: true,
    title: 'Cloud segment revenue per quarter',
    desc: `Quarterly revenue in billions of US dollars of the AWS segment (Amazon), the Microsoft Intelligent Cloud segment (FY25 definition, broader than Azure alone) and the Google Cloud segment (includes Workspace), from 2022-Q1 to 2026-Q2 (data as of ${snapshotOf(data)}). The segments are not like for like, and Microsoft does not disclose Azure revenue in dollars, so Azure alone is not shown here.`,
    xLabel: 'Quarter (year)', yLabel: 'Segment revenue per quarter (USD billion)',
    footer: footer(data, rows, 'Segments are not like for like; Microsoft rows use the FY25-and-later definition only; Azure revenue in dollars is not disclosed'),
    series: providerSeries(rows, (r) => providerId(r.provider), REVENUE_NAMES, (own) => own.map((r) => ({
      x: quarterYear(r.quarter), y: toNumber(r.revenue_usd_m) / 1000,
    }))),
  };
}

function growth(data) {
  const rows = data.revenue.filter((r) => toNumber(r.yoy_growth_pct) !== null
    && (providerId(r.provider) !== 'azure' ? r.provider !== 'microsoft' : true));
  return {
    type: 'line', id: 'growth', width: 900, yZero: true,
    title: 'Year-over-year growth of cloud revenue',
    desc: `Year-over-year growth of quarterly revenue in percent: AWS segment net sales, Azure and other cloud services as reported by Microsoft (growth rate only, no dollar revenue) and the Google Cloud segment, up to 2026-Q2 (data as of ${snapshotOf(data)}). The three measures have different definitions and bases, so the lines show momentum, not size.`,
    xLabel: 'Quarter (year)', yLabel: 'Growth versus the same quarter a year earlier (%)',
    footer: footer(data, rows, 'Growth rates have different definitions: Azure is the reported rate of Azure and other cloud services, AWS and Google Cloud are computed from segment revenue'),
    series: providerSeries(rows, (r) => providerId(r.provider), GROWTH_NAMES, (own) => own.map((r) => ({
      x: quarterYear(r.quarter), y: toNumber(r.yoy_growth_pct),
    }))),
  };
}

// ---------------------------------------------------------------- adoption surveys

function stackOverflow(data, metric, id, population) {
  const rows = data.adoption.filter((r) => r.survey.startsWith('Stack Overflow') && r.metric === metric);
  return {
    type: 'line', id, width: 860, yZero: true,
    title: `Stack Overflow Developer Survey: cloud platform used (${population})`,
    desc: `Share of ${population} of the Stack Overflow Developer Survey who used each cloud platform, per survey year (data as of ${snapshotOf(data)}). Other surveys measure other populations and are shown in separate figures; they are never put on this axis.`,
    xLabel: 'Survey year', yLabel: `Used the platform (% of ${population})`,
    footer: footer(data, rows, 'Population: ' + population),
    series: providerSeries(rows, (r) => providerId(r.provider), {}, (own) => own.map((r) => ({ x: Number(r.year), y: toNumber(r.value_pct) }))),
  };
}

function otherSurveys(data) {
  const rows = data.adoption.filter((r) => !r.survey.startsWith('Stack Overflow'));
  const keys = [];
  for (const r of rows) {
    const k = `${r.survey}|${r.year}|${r.metric}`;
    if (!keys.includes(k)) keys.push(k);
  }
  const panels = keys.map((k) => {
    const own = rows.filter((r) => `${r.survey}|${r.year}|${r.metric}` === k);
    const [survey, year, metric] = k.split('|');
    return {
      title: `${survey} ${year}: ${metric}`,
      note: `Population: ${own[0].population === 'n/a' ? 'not stated' : own[0].population}.`,
      max: 100,
      items: PROVIDERS.map((p) => ({
        label: p.name, index: providerIndex(p.id),
        value: toNumber(own.find((r) => providerId(r.provider) === p.id)?.value_pct),
      })),
    };
  });
  return {
    type: 'panelbars', id: 'adoption-surveys', width: 860, legendNames: PROVIDERS.map((p) => p.name),
    title: 'Other adoption surveys, one panel per survey',
    desc: `Share of respondents using each cloud provider in the Flexera State of the Cloud, the JetBrains State of Developer Ecosystem and the CNCF Annual Survey (data as of ${snapshotOf(data)}). Each panel is a different survey, year, question and population, so panels are not comparable with each other. A value of n/a means the figure was not published or could not be retrieved, not zero.`,
    xLabel: 'Respondents using the provider (%), each panel is its own survey and population',
    footer: footer(data, rows, 'n/a: not published or not retrievable. Populations differ per panel'),
    panels,
  };
}

// ---------------------------------------------------------------- regions

// The Azure row that has an AZ count is the regions-list count (58), not an announced "60+"/"70+" count; the regions
// line keeps Azure on the announced basis, so this row is left out of it.
const isAzureRegionsListRow = (r) => providerId(r.provider) === 'azure' && toNumber(r.availability_zones) !== null;

function regions(data) {
  const rows = data['regions-over-time'].filter((r) => !isAzureRegionsListRow(r));
  return {
    type: 'line', id: 'regions', width: 860, yZero: true,
    title: 'Cloud regions over time',
    desc: `Number of regions of AWS, Azure and Google Cloud from archived infrastructure pages and announcements, 2014 to ${snapshotOf(data)}. Azure counts announced regions ("60+", "70+"), AWS and Google Cloud count launched regions, so Azure is not like for like; the 58 regions listed on Microsoft's regions page in 2026 are not drawn on this line. Gaps mean no figure was found for that year.`,
    xLabel: 'Date of the snapshot (year)', yLabel: 'Regions (count)',
    footer: footer(data, rows, 'Azure line counts announced regions ("60+", "70+" plotted as 60 and 70); gaps: no figure found'),
    series: providerSeries(rows, (r) => providerId(r.provider), {}, (own) => own.map((r) => ({ x: decimalYear(r.as_of), y: toNumber(r.regions) }))),
  };
}

function zones(data) {
  const rows = data['regions-over-time'];
  return {
    type: 'line', id: 'availability-zones', width: 860, yZero: true,
    title: 'Availability zones over time',
    desc: `Number of availability zones of AWS and Google Cloud from archived infrastructure pages, 2014 to ${snapshotOf(data)}, and the single Azure figure of 124 zones in 41 of 58 listed regions in ${snapshotOf(data)} (Azure published no earlier total). Zone definitions differ between providers. Gaps mean no figure was found for that year.`,
    xLabel: 'Date of the snapshot (year)', yLabel: 'Availability zones (count)',
    footer: footer(data, rows, 'Azure has one data point (2026); gaps: no figure found; a region with one zone counts as one'),
    series: providerSeries(rows, (r) => providerId(r.provider), {}, (own) => own.map((r) => ({ x: decimalYear(r.as_of), y: toNumber(r.availability_zones) }))),
  };
}

// ---------------------------------------------------------------- pricing

const trim = (n) => String(Math.round(n * 1e6) / 1e6);

function pricingBlocks(data) {
  const rows = data.pricing.filter((r) => r.region === 'us-east');
  const blocks = [...new Set(rows.map((r) => r.building_block))];
  const unitOf = (b) => rows.find((r) => r.building_block === b).unit;
  const price = (b, id) => toNumber(rows.find((r) => r.building_block === b && providerId(r.provider) === id)?.price_usd);
  const cheapest = (b) => Math.min(...PROVIDER_IDS.map((id) => price(b, id)).filter((v) => v !== null));
  return {
    type: 'groupedbar', id: 'pricing-blocks', width: 1100, plotHeight: 300,
    title: 'List price of the building blocks, cheapest provider = 100',
    desc: `On-demand list prices in the US East region of AWS, Azure and Google Cloud for twelve building blocks: virtual machine, object storage, egress, functions, Kubernetes control plane, managed PostgreSQL and LLM API tokens (data as of ${snapshotOf(data)}). Each group is indexed to the cheapest provider for that block (100), so a bar of 150 costs 50 percent more. Units differ per block and are in the labels; hover a bar for the dollar price. Equal bars mean equal list prices.`,
    xLabel: 'Building block (price unit), US East list prices', yLabel: 'Price index (cheapest = 100)',
    footer: footer(data, rows, 'Prices in USD, US East region, Linux and shared tenancy where relevant; instances differ in vCPU and memory, see the pricing data. Index = price / cheapest price x 100'),
    categories: blocks.map((b) => `${b} (${unitOf(b)})`),
    series: PROVIDERS.map((p) => ({
      name: p.name,
      values: blocks.map((b) => (price(b, p.id) === null ? null : Math.round((price(b, p.id) / cheapest(b)) * 100))),
      tips: blocks.map((b) => `${p.name}: ${price(b, p.id) === null ? 'n/a' : `${trim(price(b, p.id))} USD per ${unitOf(b)}`}`),
    })),
  };
}

const prettyArchitecture = (a) => ({
  'static-site': 'Static site', 'simple-dynamic-site': 'Simple dynamic site', microservices: 'Microservices', 'ai-service': 'AI service',
}[a] ?? a);

function referenceTotals(data) {
  const rows = data['reference-totals'];
  const priced = data.pricing.filter((r) => rows.some((t) => t.pricing_id === r.id)); // reference-totals.csv has no source column
  const archs = [...new Set(rows.map((r) => r.architecture))];
  const total = (a, id) => {
    const own = rows.filter((r) => r.architecture === a && r.line !== 'TOTAL' && providerId(r.provider) === id).map((r) => toNumber(r.line_usd));
    return own.length && own.every((v) => v !== null) ? own.reduce((x, y) => x + y, 0) : null;
  };
  return {
    type: 'groupedbar', id: 'reference-totals', width: 860, yZero: true,
    title: 'Monthly list-price total of four reference architectures',
    desc: `Monthly cost in US dollars of four example architectures (static site, simple dynamic site, microservices and an AI service) priced at list prices with the same sizing on AWS, Azure and Google Cloud (data as of ${snapshotOf(data)}). Totals are computed arithmetically from the list prices, exclude taxes, support, discounts and free tiers, and are not a quote.`,
    xLabel: 'Reference architecture', yLabel: 'Monthly cost at list price (USD)', valueFormat: (v) => `$${Math.round(v).toLocaleString('en-US')}`,
    footer: footer(data, priced, 'Computed from list prices, excluding discounts, free tiers, support and taxes'),
    categories: archs.map(prettyArchitecture),
    series: PROVIDERS.map((p) => ({
      name: p.name,
      values: archs.map((a) => total(a, p.id)),
      tips: archs.map((a) => `${p.name}: ${total(a, p.id) === null ? 'n/a' : `${total(a, p.id).toFixed(2)} USD per month`}`),
    })),
  };
}

// ---------------------------------------------------------------- radar

function radar(data) {
  const scores = computeScores(data);
  return {
    type: 'radar', id: 'radar', max: 10, unit: 'score 0-10, 10 = best of the three on every measure of the axis',
    title: 'Scores on six dimensions, three providers',
    desc: `Scores from 0 to 10 for AWS, Azure and Google Cloud on popularity, ecosystem breadth, ease of use, price competitiveness, regional coverage and AI offering (data as of ${snapshotOf(data)}). Four axes are computed from the data files and two (ease of use, AI offering) are editorial; 10 means best of the three on every measure of the axis, not a theoretical maximum. The rubric is in the data notes.`,
    axes: AXES.map(([, label]) => label),
    footer: `Computed axes: popularity (market-share, learning), ecosystem breadth (service-mapping, tooling), price competitiveness (reference-totals), regional coverage (regions-over-time, sovereign). Editorial axes: ease of use, AI offering. Data as of ${snapshotOf(data)}.`,
    series: PROVIDER_IDS.map((id) => ({ name: providerName(id), values: AXES.map(([key]) => scores[id]?.[key] ?? null) })),
  };
}

// ---------------------------------------------------------------- static matrices

const FIT_FILL = { best: '#b7e1b0', good: '#fff0a8', acceptable: '#fcd3a8', 'n/a': '#e8ebee' };
const PROVIDER_COL = (p) => ({ label: p.name, color: PROVIDER_COLORS[p.id] });

function continentOrder(rows) {
  const counts = new Map();
  for (const r of rows) counts.set(r.continent, (counts.get(r.continent) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c);
}

function regionFootprint(data) {
  const rows = data.footprint.filter((r) => r.partition === 'public' && r.status === 'available' && r.continent !== 'n/a');
  const continents = continentOrder(rows);
  const count = (c, id) => rows.filter((r) => r.continent === c && providerId(r.provider) === id).length;
  const max = Math.max(...continents.flatMap((c) => PROVIDER_IDS.map((id) => count(c, id))));
  const cell = (n, id, tip) => ({ text: String(n), fill: PROVIDER_COLORS[id], fillOpacity: n === 0 ? 0 : 0.12 + (0.45 * n) / max, tip });
  return {
    type: 'grid', id: 'region-footprint', cellW: 140, cellH: 32, labelW: 170,
    title: 'Generally available public regions by continent',
    desc: `Number of generally available public cloud regions of AWS, Azure and Google Cloud in each continent as of ${snapshotOf(data)}, from the provider region lists. A darker cell means more regions. Regions that are only announced or listed as coming soon, and the China, government and sovereign partitions, are not counted. One Google Cloud row without a continent is left out.`,
    footer: footer(data, rows, 'Counts public regions with status available; announced, coming soon, China, government and sovereign regions are excluded'),
    corner: 'Continent',
    columns: PROVIDERS.map(PROVIDER_COL),
    groups: [{
      rows: [
        ...continents.map((c) => ({
          label: c,
          cells: PROVIDER_IDS.map((id) => cell(count(c, id), id, `${providerName(id)}: ${count(c, id)} regions in ${c}`)),
        })),
        {
          label: 'Total',
          cells: PROVIDER_IDS.map((id) => {
            const n = continents.reduce((a, c) => a + count(c, id), 0);
            return { text: String(n), fill: '#d1d9e0', tip: `${providerName(id)}: ${n} regions` };
          }),
        },
      ],
    }],
  };
}

const AVAILABILITY_STATE = {
  available: { fill: '#b7e1b0', glyph: 'yes' },
  'not available': { fill: '#fcd3a8', glyph: 'no' },
};

function serviceAvailability(data) {
  const rows = data['service-availability'];
  const offerings = [...new Set(rows.map((r) => r.offering))];
  const regionsList = [...new Map(rows.map((r) => [r.region_label, r.region_code])).keys()];
  return {
    type: 'grid', id: 'service-availability', cellW: 96, cellH: 36, labelW: 330,
    title: 'Service and AI model availability in six regions',
    desc: `Whether three managed services (Kubernetes, serverless functions, PostgreSQL) and three groups of frontier AI models are available in six regions (US East, Frankfurt, Singapore, Tokyo, Sao Paulo and Sydney) of AWS, Azure and Google Cloud as of ${snapshotOf(data)}. A check mark on green means available, a cross on orange means not available, and a dash on grey means no data. Hover a cell for the region code and access mode.`,
    footer: footer(data, rows, 'Availability per region from the provider service-by-region pages; a model reachable through a cross-region or global endpoint is available'),
    corner: 'Service or model, provider offering',
    columns: regionsList.map((label) => ({ label })),
    legend: [
      { label: 'Available', fill: AVAILABILITY_STATE.available.fill, glyph: 'yes' },
      { label: 'Not available', fill: AVAILABILITY_STATE['not available'].fill, glyph: 'no' },
      { label: 'No data', fill: '#e8ebee', glyph: 'na' },
    ],
    groups: offerings.map((o) => ({
      title: o,
      rows: PROVIDER_IDS.map((id) => {
        const own = rows.filter((r) => r.offering === o && providerId(r.provider) === id);
        return {
          label: own[0]?.provider_service ?? providerName(id), color: PROVIDER_COLORS[id],
          cells: regionsList.map((label) => {
            const r = own.find((x) => x.region_label === label);
            const st = AVAILABILITY_STATE[r?.value] ?? { fill: '#e8ebee', glyph: 'na' };
            return { ...st, tip: r ? `${providerName(id)}, ${label} (${r.region_code}): ${r.value}, access: ${r.access_mode}` : `${providerName(id)}, ${label}: no data` };
          }),
        };
      }),
    })),
  };
}

function recommendationMatrix(data) {
  const matrix = recommendationSpecRows(data);
  const sourceRows = [...data['reference-totals'], ...data['service-availability'], ...data['regions-over-time']];
  return {
    type: 'grid', id: 'recommendation-matrix', cellW: 150, cellH: 44, labelW: 250,
    title: 'Which provider fits which workload',
    desc: `Fit of AWS, Azure and Google Cloud for eight kinds of workload, derived from the data of this comparison as of ${snapshotOf(data)}: list prices of the reference architectures, model availability, regional coverage, ecosystem breadth, ease of use and popularity. Best fit means within 5 percent of the best provider, good fit within 20 percent, otherwise acceptable. Several providers can share the best fit when they are close; the index is the value relative to the best provider (100). Hover a cell for the evidence.`,
    footer: footer(data, sourceRows, 'Fit = value relative to the best provider: best >= 95, good >= 80, otherwise acceptable. Ease of use is an editorial score; no provider is best for everything'),
    corner: 'Workload',
    columns: PROVIDERS.map(PROVIDER_COL),
    legend: FIT_LEVELS.map((l) => ({ label: `${l.label}`, fill: FIT_FILL[l.id] })),
    groups: [{
      rows: matrix.map((m) => ({
        label: m.label,
        cells: m.cells.map((c) => ({
          text: c.fit === 'n/a' ? 'n/a' : FIT_LEVELS.find((l) => l.id === c.fit).label,
          sub: c.index === null ? undefined : `index ${c.index}`,
          fill: FIT_FILL[c.fit], tip: c.tip,
        })),
      })),
    }],
  };
}

/** Chart builders: (data) => spec. The image file is cloud-comparison-<id>.svg. */
export const CHART_BUILDERS = [
  marketShareSynergy, marketShareCanalys, revenue, growth,
  (d) => stackOverflow(d, 'used (all respondents)', 'adoption-stackoverflow', 'all respondents'),
  (d) => stackOverflow(d, 'used (professional developers)', 'adoption-stackoverflow-professional', 'professional developers'),
  otherSurveys, regions, zones, pricingBlocks, referenceTotals, radar,
  regionFootprint, serviceAvailability, recommendationMatrix,
];
