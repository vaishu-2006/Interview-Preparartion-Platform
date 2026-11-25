import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import companyTagService from '../../services/companyTagService';

const ROUND_TYPES = ['OA', 'Tech-1', 'Tech-2', 'HR', 'Other'];

// Crowd-sourced "I was asked this at X" tags — real user reports aggregated by company AND
// round type, never a claim this platform verified which companies actually ask this problem.
const CompanyTagChips = ({ slug }) => {
  const [tags, setTags] = useState(null);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const [roundType, setRoundType] = useState('OA');

  useEffect(() => {
    companyTagService.list(slug).then((data) => setTags(data.tags));
  }, [slug]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setAdding(true);
    try {
      const data = await companyTagService.add(slug, value, roundType);
      setTags(data.tags);
      setValue('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add tag');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-ink-3">Reported at:</span>
      {tags?.map((t) => (
        <span key={`${t.company}-${t.roundType}`} className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] text-ink-2">
          {t.company} <span className="text-ink-3">&middot; {t.roundType}</span> {t.count > 1 ? `(${t.count})` : ''}
        </span>
      ))}
      {!tags?.length && tags !== null && <span className="text-[11px] text-ink-3">No reports yet</span>}
      <form onSubmit={handleAdd} className="flex items-center gap-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="+ Add company"
          className="w-28 rounded-full border border-surface-border bg-transparent px-2.5 py-0.5 text-[11px] text-ink-1 outline-none focus:border-brand-500/50"
        />
        <select
          value={roundType}
          onChange={(e) => setRoundType(e.target.value)}
          className="rounded-full border border-surface-border bg-transparent px-2 py-0.5 text-[11px] text-ink-1 outline-none focus:border-brand-500/50"
        >
          {ROUND_TYPES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button type="submit" disabled={adding || !value.trim()} className="text-[11px] font-medium text-brand-400 hover:underline">
          Add
        </button>
      </form>
    </div>
  );
};

export default CompanyTagChips;
