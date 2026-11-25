const EXPRESSION_STYLES = {
  Confident: 'text-brand-400 bg-brand-600/15',
  Neutral: 'text-ink-2 bg-surface',
  Confused: 'text-gold bg-gold/15',
  Nervous: 'text-danger bg-danger/15',
};

const ConfidenceIndicator = ({ sample, faceStatus }) => {
  if (faceStatus === 'loading') {
    return <p className="text-xs text-ink-3">Starting facial analysis...</p>;
  }
  if (faceStatus === 'error') {
    return <p className="text-xs text-gold">Facial analysis unavailable — continuing without it.</p>;
  }
  if (faceStatus === 'no-face' || !sample) {
    return <p className="text-xs text-ink-3">No face detected — center yourself in the frame.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-3">Confidence</span>
        <span className="stat-figure text-xs font-semibold text-ink-1">{sample.confidenceScore}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${sample.confidenceScore}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-3">Eye Contact</span>
        <span className="stat-figure text-xs font-semibold text-ink-1">{sample.eyeContactScore}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
        <div className="h-full bg-gold transition-all" style={{ width: `${sample.eyeContactScore}%` }} />
      </div>
      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${EXPRESSION_STYLES[sample.expression]}`}>
        {sample.expression}
      </span>
    </div>
  );
};

export default ConfidenceIndicator;
