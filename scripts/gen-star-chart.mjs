import { writeFileSync, mkdirSync } from 'fs';

const repo = 'LotusInputMethod/fcitx5-lotus';
const token = process.env.STAR_TOKEN;

if (!repo || !token) {
  throw new Error('Missing GITHUB_REPOSITORY or STAR_TOKEN');
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
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.length === 0) break;
  for (const s of data) stars.push(new Date(s.starred_at).getTime());
  if (data.length < 100) break;
  page++;
}

stars.sort((a, b) => a - b);

const byDay = new Map();
stars.forEach((t, i) => {
  byDay.set(new Date(t).toISOString().slice(0, 10), i + 1);
});
const points = [...byDay.entries()].map(([day, count]) => ({
  day,
  count,
}));

const W = 800,
  H = 400,
  PAD = 50;
const maxCount = Math.max(...points.map((p) => p.count), 1);
const n = points.length;
const xy = points.map((p, i) => {
  const x = PAD + (i / Math.max(n - 1, 1)) * (W - 2 * PAD);
  const y = H - PAD - (p.count / maxCount) * (H - 2 * PAD);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="sans-serif">
  <rect width="${W}" height="${H}" fill="#0d1117" rx="8"/>
  <text x="${W / 2}" y="32" fill="#e6edf3" font-size="18" text-anchor="middle" font-weight="bold">
    ${repo} — Star History (${maxCount} ⭐)
  </text>
  <line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" stroke="#30363d"/>
  <line x1="${PAD}" y1="${PAD}" x2="${PAD}" y2="${H - PAD}" stroke="#30363d"/>
  <text x="${PAD - 8}" y="${PAD + 5}" fill="#8b949e" font-size="12" text-anchor="end">${maxCount}</text>
  <text x="${PAD - 8}" y="${H - PAD + 5}" fill="#8b949e" font-size="12" text-anchor="end">0</text>
  <text x="${PAD}" y="${H - PAD + 22}" fill="#8b949e" font-size="12">${points[0]?.day ?? ''}</text>
  <text x="${W - PAD}" y="${H - PAD + 22}" fill="#8b949e" font-size="12" text-anchor="end">${points[n - 1]?.day ?? ''}</text>
  <polyline points="${xy.join(' ')}" fill="none" stroke="#f0b429" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`;

mkdirSync('public', { recursive: true });
writeFileSync('public/starcharts.svg', svg);
console.log(
  `Generated public/starcharts.svg with ${maxCount} stars, ${n} points`,
);
