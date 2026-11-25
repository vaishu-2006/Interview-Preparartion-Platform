const LoadingScreen = ({ label = 'Loading...' }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-surface">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-border border-t-brand-500" />
    <p className="text-sm text-ink-2">{label}</p>
  </div>
);

export default LoadingScreen;
