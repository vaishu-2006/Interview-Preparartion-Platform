import { useEffect, useState } from 'react';
import ResourceCategoryGrid from '../../components/common/ResourceCategoryGrid';
import useBookmarks from '../../hooks/useBookmarks';
import upscService from '../../services/upscService';
import Icon from '../../components/icons/Icon';

// Curated links to real, free daily/weekly/monthly sources — kept as the reliable baseline
// regardless of whether a live feed is configured on this deployment.
const CATEGORIES = [
  {
    title: 'Daily Current Affairs',
    description: 'Free daily news digests written for exam relevance.',
    icon: 'newspaper',
    links: [
      { label: 'PIB — Press Information Bureau', href: 'https://pib.gov.in/', desc: 'Official government press releases, the most reliable primary source.' },
      { label: 'The Hindu', href: 'https://www.thehindu.com/', desc: 'Widely recommended for UPSC-relevant national and international news.' },
      { label: 'Insights on India — Daily News Analysis', href: 'https://www.insightsonindia.com/current-affairs/', desc: 'Daily current affairs curated specifically for UPSC.' },
    ],
  },
  {
    title: 'Weekly & Monthly Compilations',
    description: 'Consolidated current affairs for efficient revision.',
    icon: 'archive',
    links: [
      { label: 'Vision IAS — Monthly Current Affairs', href: 'https://www.visionias.in/current-affairs', desc: 'Monthly compiled magazine format.' },
      { label: 'Yojana Magazine', href: 'https://yojana.gov.in/', desc: 'Official monthly government publication on policy themes.' },
    ],
  },
  {
    title: 'Government & Policy Sources',
    description: 'Primary sources for schemes, budget, and economic survey.',
    icon: 'landmark',
    links: [
      { label: 'India Budget', href: 'https://www.indiabudget.gov.in/', desc: 'Official Union Budget documents and Economic Survey.' },
      { label: 'MyGov India', href: 'https://www.mygov.in/', desc: 'Government schemes and citizen-facing policy updates.' },
    ],
  },
];

const PROVIDER_LABELS = { newsapi: 'NewsAPI', gnews: 'GNews' };

const LiveFeed = () => {
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    upscService.getLiveCurrentAffairs().then(setFeed);
  }, []);

  if (!feed) return <div className="card p-6 text-sm text-ink-3">Checking for a live feed...</div>;

  if (!feed.live) {
    return (
      <div className="card flex items-start gap-2.5 p-5 text-sm text-ink-3">
        <Icon name="warning" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        {feed.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-1">Live Feed</h2>
        <span className="text-xs text-ink-3">
          via {PROVIDER_LABELS[feed.provider] || feed.provider}
          {feed.cached && !feed.stale ? ' · cached (refreshes every 30 min)' : ''}
          {feed.stale ? ' · showing last known results, provider unreachable right now' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {feed.articles.map((a, i) => (
          <a
            key={i}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="card block p-4 transition hover:border-brand-500/40"
          >
            <p className="text-sm font-medium text-ink-1">{a.title}</p>
            {a.description && <p className="mt-1.5 line-clamp-2 text-xs text-ink-3">{a.description}</p>}
            <p className="mt-2 text-[11px] text-ink-3">
              {a.source} {a.publishedAt ? `· ${new Date(a.publishedAt).toLocaleDateString()}` : ''}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

const CurrentAffairsPage = () => {
  const { bookmarkedHrefs, toggle } = useBookmarks();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Current Affairs</h1>
        <p className="mt-1 text-ink-3">A live feed when configured on this deployment, plus curated free sources you can always rely on.</p>
      </div>
      <LiveFeed />
      <ResourceCategoryGrid categories={CATEGORIES} bookmarkedHrefs={bookmarkedHrefs} onToggleBookmark={toggle} />
    </div>
  );
};

export default CurrentAffairsPage;
