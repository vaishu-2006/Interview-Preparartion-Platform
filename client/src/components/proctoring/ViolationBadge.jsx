import Icon from '../icons/Icon';

const ViolationBadge = ({ count, max }) => {
  if (!count) return null;
  return (
    <span
      title="Proctoring warnings"
      className="flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-xs font-medium text-danger"
    >
      <Icon name="warning" className="h-3.5 w-3.5" />
      {count}/{max} warnings
    </span>
  );
};

export default ViolationBadge;
