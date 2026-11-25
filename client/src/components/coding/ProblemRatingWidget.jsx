import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import codingService from '../../services/codingService';
import Icon from '../icons/Icon';

const PERCEPTIONS = ['Too Easy', 'Just Right', 'Too Hard'];

// Real community signal, separate from the problem's own fixed difficulty tag — helps students
// spot which problems are actually worth their time, or whether "Medium" felt harder than tagged.
const ProblemRatingWidget = ({ slug }) => {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    codingService.getRatings(slug).then(setData);
  }, [slug]);

  const submit = async (qualityRating, difficultyPerception) => {
    setSaving(true);
    try {
      const next = await codingService.rateProblem(slug, {
        qualityRating: qualityRating ?? data?.myRating?.qualityRating ?? 5,
        difficultyPerception: difficultyPerception ?? data?.myRating?.difficultyPerception ?? 'Just Right',
      });
      setData(next);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;
  const { summary, myRating } = data;

  return (
    <div className="mt-4 rounded-xl border border-surface-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {summary.avgQuality ? (
            <>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} name="checkCircle" className={`h-3.5 w-3.5 ${n <= Math.round(summary.avgQuality) ? 'text-gold' : 'text-surface-border'}`} />
                ))}
              </div>
              <span className="stat-figure text-xs text-ink-2">{summary.avgQuality} ({summary.ratingCount} rating{summary.ratingCount === 1 ? '' : 's'})</span>
            </>
          ) : (
            <span className="text-xs text-ink-3">No community ratings yet — be the first.</span>
          )}
        </div>
        {summary.ratingCount > 0 && (
          <span className="text-[11px] text-ink-3">
            {PERCEPTIONS.map((p) => `${p}: ${summary.difficultyBreakdown[p]}`).join(' · ')}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-ink-3">Rate quality:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              disabled={saving}
              onClick={() => submit(n, undefined)}
              aria-label={`${n} star`}
              className="disabled:opacity-50"
            >
              <Icon name="checkCircle" className={`h-4 w-4 ${myRating && n <= myRating.qualityRating ? 'text-gold' : 'text-ink-3 hover:text-gold'}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {PERCEPTIONS.map((p) => (
            <button
              key={p}
              disabled={saving}
              onClick={() => submit(undefined, p)}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition disabled:opacity-50 ${
                myRating?.difficultyPerception === p ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemRatingWidget;
