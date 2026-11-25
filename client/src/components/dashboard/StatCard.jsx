import Icon from '../icons/Icon';

const StatCard = ({ label, value, icon }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
      <Icon name={icon} className="h-5 w-5 text-brand-500" />
    </div>
    <div>
      <p className="text-2xl font-bold text-ink-1">{value}</p>
      <p className="text-sm text-ink-3">{label}</p>
    </div>
  </div>
);

export default StatCard;
