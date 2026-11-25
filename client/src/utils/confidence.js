// Shared helpers for the "how confidently were you attending" metric derived from
// ProctoringCameraWidget's face-tracking samples during a test.
export const averageConfidence = (values) => {
  const valid = values.filter((v) => v !== null && v !== undefined);
  if (!valid.length) return null;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
};

export const confidenceTier = (score) => {
  if (score >= 70) return { label: 'Confident', className: 'text-brand-500' };
  if (score >= 45) return { label: 'Moderate confidence', className: 'text-gold' };
  return { label: 'Low confidence', className: 'text-danger' };
};
