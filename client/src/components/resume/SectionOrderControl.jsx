const LABELS = {
  education: 'Education',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  languages: 'Languages',
};

const SectionOrderControl = ({ order, onChange }) => {
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="card p-6">
      <h2 className="mb-3 text-lg font-semibold text-ink-1">Section Order</h2>
      <p className="mb-4 text-sm text-ink-3">Controls the order sections appear in your resume preview and PDF.</p>
      <div className="flex flex-wrap gap-2">
        {order.map((key, index) => (
          <div key={key} className="flex items-center gap-1 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm text-ink-2">
            <span>{LABELS[key] || key}</span>
            <button type="button" onClick={() => move(index, -1)} className="px-1 text-ink-3 hover:text-ink-1" aria-label="Move earlier">↑</button>
            <button type="button" onClick={() => move(index, 1)} className="px-1 text-ink-3 hover:text-ink-1" aria-label="Move later">↓</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionOrderControl;
