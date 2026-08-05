import { ref } from 'vue';

export const REPO = 'LotusInputMethod/fcitx5-lotus';
export const GITHUB_URL = 'https://github.com/LotusInputMethod/fcitx5-lotus';

const CACHE_KEYS = {
  stars: 'lotus_stars_cache',
  starsTime: 'lotus_stars_timestamp',
  version: 'lotus_latest_version_cache',
  versionUrl: 'lotus_latest_url_cache',
  versionTime: 'lotus_latest_version_timestamp',
  contributors: 'lotus_contributors_cache',
  contributorsTime: 'lotus_contributors_timestamp',
} as const;

const CACHE_TTL = 2 * 60 * 60 * 1000;

const getCached = (dataKey: string, timeKey: string) => {
  const data = localStorage.getItem(dataKey);
  const ts = localStorage.getItem(timeKey);
  return {
    data,
    fresh: !!(data && ts && Date.now() - parseInt(ts) < CACHE_TTL),
  };
};

const setCached = (dataKey: string, timeKey: string, data: string): void => {
  localStorage.setItem(dataKey, data);
  localStorage.setItem(timeKey, Date.now().toString());
};

export interface Contributor {
  id: number;
  name: string;
  role: string;
  avatar: string;
  githubUrl: string;
}

const starCount = ref<string>('0');
const contributorCount = ref<number>(0);
const latestVersion = ref<string>('');
const latestReleaseUrl = ref<string>('');
const contributors = ref<Contributor[]>([]);

const fetchGithubStars = async () => {
  const cached = getCached(CACHE_KEYS.stars, CACHE_KEYS.starsTime);
  if (cached.fresh && cached.data !== null) {
    starCount.value = cached.data;
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}`);
    if (!response.ok) throw new Error('GitHub API rate limit or error');

    const count = (await response.json()).stargazers_count.toLocaleString();

    starCount.value = count;
    setCached(CACHE_KEYS.stars, CACHE_KEYS.starsTime, count);
  } catch (error) {
    console.error('Lỗi khi lấy star từ GitHub:', error);
    if (cached.data) starCount.value = cached.data;
  }
};

const fetchLatestRelease = async () => {
  const v = getCached(CACHE_KEYS.version, CACHE_KEYS.versionTime);
  const u = getCached(CACHE_KEYS.versionUrl, CACHE_KEYS.versionTime);

  if (v.fresh && u.fresh && v.data !== null && u.data !== null) {
    latestVersion.value = v.data;
    latestReleaseUrl.value = u.data;
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
    );
    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();
    const version = data.tag_name;
    const url = data.html_url;

    if (version && url) {
      latestVersion.value = version;
      latestReleaseUrl.value = url;
      setCached(CACHE_KEYS.version, CACHE_KEYS.versionTime, version);
      setCached(CACHE_KEYS.versionUrl, CACHE_KEYS.versionTime, url);
    }
  } catch (error) {
    console.error('Lỗi khi lấy version từ GitHub:', error);
    if (v.data && u.data) {
      latestVersion.value = v.data;
      latestReleaseUrl.value = u.data;
    }
  }
};

const fetchContributors = async () => {
  const specialRoles: Record<number, string> = {
    57983253: 'Founder', // nhktmdzhg
  };

  const blacklist = ['thanhpy2009', 'loccun'];

  const cached = getCached(
    CACHE_KEYS.contributors,
    CACHE_KEYS.contributorsTime,
  );
  if (cached.fresh && cached.data !== null) {
    const parsed = JSON.parse(cached.data);
    const filtered = parsed.filter(
      (c: any) => !blacklist.includes(c.name) && !c.name.includes('[bot]'),
    );
    contributors.value = filtered;
    contributorCount.value = filtered.length;
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/contributors`,
    );
    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();
    const fetchedContributors: Contributor[] = data
      .filter(
        (item: any) =>
          !blacklist.includes(item.login) &&
          item.type !== 'Bot' &&
          !item.login.includes('[bot]'),
      )
      .map((item: any) => ({
        id: item.id,
        name: item.login,
        role: specialRoles[item.id] || 'Contributor',
        avatar: item.avatar_url,
        githubUrl: item.html_url,
      }));

    contributors.value = fetchedContributors;
    contributorCount.value = fetchedContributors.length;
    setCached(
      CACHE_KEYS.contributors,
      CACHE_KEYS.contributorsTime,
      JSON.stringify(fetchedContributors),
    );
  } catch (error) {
    console.error('Lỗi khi lấy contributor từ GitHub:', error);
    if (cached.data) {
      contributors.value = JSON.parse(cached.data);
      contributorCount.value = contributors.value.length;
    }
  }
};

export function useGitHubStats() {
  return {
    starCount,
    contributorCount,
    latestVersion,
    latestReleaseUrl,
    contributors,
    fetchGithubStars,
    fetchLatestRelease,
    fetchContributors,
  };
}
