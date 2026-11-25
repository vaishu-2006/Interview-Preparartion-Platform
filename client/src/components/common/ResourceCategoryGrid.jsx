import Icon from '../icons/Icon';

// Shared card-grid renderer for curated external-resource categories — used by Study
// Materials and the UPSC Previous Papers / Current Affairs pages so the layout stays
// consistent without duplicating the markup.
// bookmarkedHrefs/onToggleBookmark are optional — pages that don't pass them render the plain
// link list unchanged.
const ResourceCategoryGrid = ({ categories, bookmarkedHrefs, onToggleBookmark }) => (
  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
    {categories.map((category) => (
      <div key={category.title} className="card p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
            <Icon name={category.icon} className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink-1">{category.title}</h2>
            <p className="mt-0.5 text-sm text-ink-3">{category.description}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          {category.links.map((link) => {
            const isBookmarked = bookmarkedHrefs?.has(link.href);
            return (
              <li key={link.href} className="flex items-start gap-2">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-1 items-start justify-between gap-3 rounded-lg border border-surface-border px-3.5 py-2.5 transition hover:border-brand-500/40 hover:bg-surface"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-1 group-hover:text-brand-400">{link.label}</p>
                    <p className="mt-0.5 text-xs text-ink-3">{link.desc}</p>
                  </div>
                  <span className="mt-0.5 shrink-0 text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-brand-400">
                    &rarr;
                  </span>
                </a>
                {onToggleBookmark && (
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(link, category.title)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
                      isBookmarked
                        ? 'border-gold/40 bg-gold/10 text-gold'
                        : 'border-surface-border text-ink-3 hover:text-gold'
                    }`}
                  >
                    <Icon name="bookmark" className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

export default ResourceCategoryGrid;
