import { mkdirSync, writeFileSync } from 'node:fs';

const repo = 'LotusInputMethod/fcitx5-lotus';
const token = process.env.STAR_TOKEN;

if (!token) {
  throw new Error('Missing STAR_TOKEN');
}

const stars = [];
let page = 1;

while (true) {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/stargazers?per_page=100&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.star+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  if (data.length === 0) break;

  for (const star of data) {
    if (star.starred_at) {
      stars.push(new Date(star.starred_at));
    }
  }

  if (data.length < 100) break;

  page += 1;
}

if (stars.length === 0) {
  throw new Error('No stargazer data returned');
}

stars.sort((a, b) => a - b);

const formatDate = (date) => date.toISOString().slice(0, 10);

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const firstDay = parseDate(formatDate(stars[0]));
const lastDay = parseDate(formatDate(new Date()));

const starsByDay = new Map();

for (const star of stars) {
  const day = formatDate(star);
  starsByDay.set(day, (starsByDay.get(day) ?? 0) + 1);
}

const points = [];
let count = 0;
let currentDay = firstDay;

while (currentDay <= lastDay) {
  const day = formatDate(currentDay);

  count += starsByDay.get(day) ?? 0;

  points.push({
    day,
    date: new Date(currentDay),
    count,
  });

  currentDay = addDays(currentDay, 1);
}

const W = 1200;
const H = 600;

const PAD_LEFT = 80;
const PAD_RIGHT = 40;
const PAD_TOP = 70;
const PAD_BOTTOM = 85;

const CHART_W = W - PAD_LEFT - PAD_RIGHT;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

const maxCount = Math.max(...points.map((point) => point.count), 1);
const maxDate = points[points.length - 1].date.getTime();
const minDate = points[0].date.getTime();
const dateRange = Math.max(maxDate - minDate, 1);

const getX = (point) => {
  const progress = (point.date.getTime() - minDate) / dateRange;
  return PAD_LEFT + progress * CHART_W;
};

const getY = (point) => {
  const progress = point.count / maxCount;
  return PAD_TOP + CHART_H - progress * CHART_H;
};

const linePoints = points
  .map((point) => `${getX(point).toFixed(2)},${getY(point).toFixed(2)}`)
  .join(' ');

const areaPoints = [
  `${PAD_LEFT},${PAD_TOP + CHART_H}`,
  ...points.map(
    (point) => `${getX(point).toFixed(2)},${getY(point).toFixed(2)}`,
  ),
  `${PAD_LEFT + CHART_W},${PAD_TOP + CHART_H}`,
].join(' ');

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const formatLabel = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const tickCount = 8;
const xTicks = Array.from({ length: tickCount }, (_, index) => {
  const progress = index / (tickCount - 1);
  const pointIndex = Math.round(progress * (points.length - 1));
  const point = points[pointIndex];

  return {
    x: getX(point),
    label: formatLabel(point.day),
  };
});

const yTickCount = 5;
const yTicks = Array.from({ length: yTickCount }, (_, index) => {
  const progress = index / (yTickCount - 1);
  const value = Math.round(maxCount * progress);
  const y = PAD_TOP + CHART_H - progress * CHART_H;

  return {
    value,
    y,
  };
});

const horizontalGrid = yTicks
  .map(
    (tick) => `
      <line
        x1="${PAD_LEFT}"
        y1="${tick.y.toFixed(2)}"
        x2="${PAD_LEFT + CHART_W}"
        y2="${tick.y.toFixed(2)}"
        stroke="#30363d"
        stroke-width="1"
      />
      <text
        x="${PAD_LEFT - 12}"
        y="${(tick.y + 5).toFixed(2)}"
        fill="#8b949e"
        font-size="13"
        text-anchor="end"
      >${tick.value}</text>
    `,
  )
  .join('');

const verticalTicks = xTicks
  .map(
    (tick) => `
      <line
        x1="${tick.x.toFixed(2)}"
        y1="${PAD_TOP}"
        x2="${tick.x.toFixed(2)}"
        y2="${PAD_TOP + CHART_H}"
        stroke="#21262d"
        stroke-width="1"
      />
      <text
        x="${tick.x.toFixed(2)}"
        y="${PAD_TOP + CHART_H + 28}"
        fill="#8b949e"
        font-size="13"
        text-anchor="middle"
      >${tick.label}</text>
    `,
  )
  .join('');

const svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${W} ${H}"
  role="img"
  aria-labelledby="title description"
  font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
>
  <title id="title">GitHub Star History for ${escapeXml(repo)}</title>
  <desc id="description">
    Star count increased to ${maxCount} from ${formatLabel(points[0].day)}
    to ${formatLabel(points[points.length - 1].day)}.
  </desc>

  <rect
    width="${W}"
    height="${H}"
    rx="12"
    fill="#0d1117"
  />

  <text
    x="${W / 2}"
    y="36"
    fill="#e6edf3"
    font-size="21"
    font-weight="600"
    text-anchor="middle"
  >${escapeXml(repo)} — Star History</text>

  <text
    x="${W / 2}"
    y="59"
    fill="#8b949e"
    font-size="13"
    text-anchor="middle"
  >${maxCount.toLocaleString()} stars</text>

  ${horizontalGrid}
  ${verticalTicks}

  <line
    x1="${PAD_LEFT}"
    y1="${PAD_TOP}"
    x2="${PAD_LEFT}"
    y2="${PAD_TOP + CHART_H}"
    stroke="#8b949e"
    stroke-width="1"
  />

  <line
    x1="${PAD_LEFT}"
    y1="${PAD_TOP + CHART_H}"
    x2="${PAD_LEFT + CHART_W}"
    y2="${PAD_TOP + CHART_H}"
    stroke="#8b949e"
    stroke-width="1"
  />

  <polygon
    points="${areaPoints}"
    fill="#f0b429"
    fill-opacity="0.12"
  />

  <polyline
    points="${linePoints}"
    fill="none"
    stroke="#f0b429"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <circle
    cx="${getX(points[points.length - 1]).toFixed(2)}"
    cy="${getY(points[points.length - 1]).toFixed(2)}"
    r="5"
    fill="#f0b429"
  />

  <text
    x="${getX(points[points.length - 1]) - 10}"
    y="${getY(points[points.length - 1]) - 14}"
    fill="#f0b429"
    font-size="14"
    font-weight="600"
    text-anchor="end"
  >${maxCount.toLocaleString()}</text>
</svg>
`.trim();

mkdirSync('public', { recursive: true });
writeFileSync('public/starcharts.svg', svg);

console.log(
  `Generated public/starcharts.svg with ${maxCount} stars across ${points.length} days`,
);
