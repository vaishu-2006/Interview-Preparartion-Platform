import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';

const QuickActionCard = ({ to, icon, title, desc }) => (
  <Link to={to} className="card flex flex-col gap-3 p-6 transition hover:border-brand-500/60">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
      <Icon name={icon} className="h-5 w-5 text-brand-500" />
    </div>
    <div>
      <h3 className="font-semibold text-ink-1">{title}</h3>
      <p className="mt-1 text-sm text-ink-3">{desc}</p>
    </div>
  </Link>
);

export default QuickActionCard;
