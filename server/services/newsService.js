// Live current-affairs feed for UPSC — real news API integration, gated behind whichever
// provider key is configured (same "no fabrication" discipline as the AI features: no key
// configured means an honest "not live" response, never invented headlines). Same
// fallback-chain shape as aiService's multi-provider setup: try each configured provider in
// order until one succeeds.
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

const mapArticle = (a) => ({
  title: a.title,
  description: a.description,
  url: a.url,
  source: a.source?.name || 'Unknown',
  publishedAt: a.publishedAt,
});

// NewsAPI's free tier no longer returns results from /v2/top-headlines?country=in (confirmed
// empty in practice, a known free-tier restriction) — /v2/everything with a India-scoped query
// still works on the same free key, so that's used instead.
const fetchFromNewsApi = async () => {
  const url = `https://newsapi.org/v2/everything?q=India&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWSAPI_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`NewsAPI request failed (${res.status})`);
  const data = await res.json();
  return (data.articles || []).map(mapArticle);
};

const fetchFromGNews = async () => {
  const url = `https://gnews.io/api/v4/top-headlines?country=in&max=20&apikey=${GNEWS_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`GNews request failed (${res.status})`);
  const data = await res.json();
  return (data.articles || []).map(mapArticle);
};

// NewsData.io uses different field names (link/pubDate/source_id instead of url/publishedAt/
// source.name) — normalized to the same shape as the other two providers via mapArticle.
const fetchFromNewsData = async () => {
  const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=in&language=en&category=top`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`NewsData request failed (${res.status})`);
  const data = await res.json();
  if (data.status !== 'success') throw new Error(`NewsData returned status "${data.status}"`);
  return (data.results || []).slice(0, 20).map((a) =>
    mapArticle({ title: a.title, description: a.description, url: a.link, source: { name: a.source_id }, publishedAt: a.pubDate })
  );
};

// NewsData.io first — it genuinely supports India-scoped, category-filtered results on its
// free tier; NewsAPI's free tier only works via a broader keyword search (see above), so it's
// the fallback rather than the default.
const PROVIDERS = [
  { name: 'newsdata', enabled: () => Boolean(NEWSDATA_API_KEY), fetchArticles: fetchFromNewsData },
  { name: 'newsapi', enabled: () => Boolean(NEWSAPI_KEY), fetchArticles: fetchFromNewsApi },
  { name: 'gnews', enabled: () => Boolean(GNEWS_API_KEY), fetchArticles: fetchFromGNews },
];

const isLive = () => PROVIDERS.some((p) => p.enabled());

// A shared in-memory cache, not per-user — free-tier news APIs have tight daily rate limits
// (NewsAPI/GNews: 100 req/day; NewsData.io: 200 req/day on the free tier), so every user
// pulling from the same 30-minute-old cache instead of triggering their own fetch matters.
const CACHE_TTL_MS = 30 * 60 * 1000;
let cache = { articles: null, provider: null, fetchedAt: 0 };

const getLiveCurrentAffairs = async () => {
  if (!isLive()) {
    return {
      live: false,
      articles: [],
      message:
        'A live current-affairs feed needs a news API key configured on this deployment (NEWSAPI_KEY, GNEWS_API_KEY, or NEWSDATA_API_KEY). Use the curated sources below in the meantime.',
    };
  }

  const now = Date.now();
  if (cache.articles && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { live: true, articles: cache.articles, provider: cache.provider, cached: true };
  }

  let lastError;
  for (const provider of PROVIDERS) {
    if (!provider.enabled()) continue;
    try {
      // eslint-disable-next-line no-await-in-loop
      const articles = await provider.fetchArticles();
      cache = { articles, provider: provider.name, fetchedAt: now };
      return { live: true, articles, provider: provider.name, cached: false };
    } catch (err) {
      console.error(`News provider "${provider.name}" failed, trying next:`, err.message);
      lastError = err;
    }
  }

  console.error('All configured news providers failed:', lastError?.message);
  if (cache.articles) {
    return { live: true, articles: cache.articles, provider: cache.provider, cached: true, stale: true };
  }
  return { live: false, articles: [], message: 'Could not reach the news provider right now — try again shortly.' };
};

module.exports = { isLive, getLiveCurrentAffairs };
