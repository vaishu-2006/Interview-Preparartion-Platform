const ChartCard = ({ title, children, empty }) => (
  <div className="card p-6">
    <h3 className="mb-4 text-sm font-semibold text-ink-1">{title}</h3>
    {empty ? (
      <div className="flex h-48 items-center justify-center text-sm text-ink-3">No data yet</div>
    ) : (
      <div className="h-48">{children}</div>
    )}
  </div>
);

export default ChartCard;
