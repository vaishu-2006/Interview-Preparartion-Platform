import { confidenceTier } from '../../utils/confidence';

// Renders nothing if there's no score yet (face-tracking never got a reading — camera denied,
// too short a test, etc.) rather than showing a misleading 0%.
const ConfidenceStat = ({ score }) => {
  if (score === null || score === undefined) return null;
  const tier = confidenceTier(score);
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm">
      <span className="text-ink-2">Confidence while attending</span>
      <span className={`font-semibold ${tier.className}`}>{score}% &middot; {tier.label}</span>
    </div>
  );
};

export default ConfidenceStat;
