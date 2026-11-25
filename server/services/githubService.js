const ApiError = require('../utils/ApiError');

const fetchPublicRepos = async (username) => {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'placement-prep-platform' } }
  );

  if (response.status === 404) {
    throw new ApiError(404, `No GitHub user found with username "${username}"`);
  }
  if (response.status === 403) {
    throw new ApiError(429, 'GitHub API rate limit exceeded. Please try again later.');
  }
  if (!response.ok) {
    throw new ApiError(502, 'Failed to fetch repositories from GitHub');
  }

  const repos = await response.json();
  return repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      owner: repo.owner?.login,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      updatedAt: repo.updated_at,
    }));
};

// Strips markdown noise (headers, badges, images, HTML, link/emphasis syntax) and returns
// the first substantial paragraph of plain text — used as a project description fallback
// when a repo has no GitHub "description" field set.
const extractReadmeSummary = (markdown, maxLength = 280) => {
  const lines = markdown.split('\n');
  const paragraph = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (paragraph.length) break; // first paragraph ended
      continue;
    }
    const isNoise =
      line.startsWith('#') || // headings
      line.startsWith('[![') || // badge shields
      line.startsWith('![') || // standalone images
      line.startsWith('<') || // raw HTML (banners, centered images, etc.)
      /^[-*_]{3,}$/.test(line); // horizontal rules
    if (isNoise) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(line);
  }

  if (!paragraph.length) return '';

  const plainText = paragraph
    .join(' ')
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, '')) // inline/blocks code -> plain
    .replace(/!\[[^\]]*]\([^)]*\)/g, '') // any remaining inline images
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1') // links -> link text
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic markers
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) return '';
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
};

const fetchReadmeSummary = async (owner, repoName) => {
  if (!owner || !repoName) return '';
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'placement-prep-platform' },
    });
    if (!response.ok) return '';
    const data = await response.json();
    if (!data.content) return '';
    const markdown = Buffer.from(data.content, data.encoding || 'base64').toString('utf-8');
    return extractReadmeSummary(markdown);
  } catch {
    return '';
  }
};

module.exports = { fetchPublicRepos, fetchReadmeSummary };
