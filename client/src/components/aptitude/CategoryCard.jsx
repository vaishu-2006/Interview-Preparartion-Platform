import Icon from '../icons/Icon';

const ICONS = { Numerical: 'calculator', Logical: 'cpu', Verbal: 'bookOpen', 'Non-Verbal': 'shapes' };

const CategoryCard = ({ category, performance, onClick }) => (
  <button onClick={onClick} className="card flex flex-col gap-3 p-6 text-left transition hover:border-brand-500/50">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
      <Icon name={ICONS[category] || 'helpCircle'} className="h-5 w-5 text-brand-500" />
    </div>
    <div>
      <h3 className="font-semibold text-ink-1">{category}</h3>
      <p className="mt-1 text-sm text-ink-3">
        {performance?.attempts ? `${performance.attempts} attempts · avg ${performance.averageScorePercent}%` : 'Not attempted yet'}
      </p>
    </div>
  </button>
);

export default CategoryCard;
