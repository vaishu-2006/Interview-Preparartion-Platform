import ConfidenceStat from '../proctoring/ConfidenceStat';

const tierForPercent = (percent) => {
  if (percent >= 80) return 'strong';
  if (percent >= 50) return 'moderate';
  return 'weak';
};

// Builds a fuller post-test report (not just a one-line verdict): a headline, a narrative
// paragraph grounded in real numbers from this attempt, and a short "what to do next" list.
// Groups by per-question `category` when present (mixed-topic tests like the UPSC GS mock);
// otherwise the whole attempt is one topic (categoryLabel).
const buildReport = (result, categoryLabel) => {
  const review = result.review || [];
  const correct = review.filter((i) => i.isCorrect).length;
  const skipped = review.filter((i) => i.selectedOptionIndex === -1 || i.selectedOptionIndex === undefined).length;
  const incorrect = review.length - correct - skipped;
  const percent = result.totalQuestions ? Math.round((result.score / result.totalQuestions) * 100) : 0;
  const hasPerItemCategory = review.some((item) => item.category);

  const suggestions = [];
  let headline;
  let narrative;
  let breakdown = [];

  if (hasPerItemCategory) {
    const byCategory = {};
    review.forEach((item) => {
      const cat = item.category || 'Uncategorized';
      if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
      byCategory[cat].total += 1;
      if (item.isCorrect) byCategory[cat].correct += 1;
    });
    breakdown = Object.entries(byCategory)
      .map(([category, { correct: c, total }]) => ({ category, correct: c, total, percent: total ? Math.round((c / total) * 100) : 0 }))
      .sort((a, b) => a.percent - b.percent);
    const weakest = breakdown[0];
    const strongest = breakdown[breakdown.length - 1];
    headline = weakest ? `Weakest area: ${weakest.category} (${weakest.correct}/${weakest.total} correct)` : 'No clear weak area detected.';
    narrative =
      `You scored ${percent}% overall across ${breakdown.length} categories. ` +
      (weakest ? `${weakest.category} was your lowest-scoring area at ${weakest.percent}%` : '') +
      (strongest && strongest !== weakest ? `, while ${strongest.category} was your strongest at ${strongest.percent}%.` : '.');
    if (weakest) suggestions.push(`Prioritize revising ${weakest.category} — it had the most missed questions this attempt.`);
    suggestions.push('Review every incorrect answer below along with its explanation before retaking the test.');
  } else {
    const label = categoryLabel || 'this topic';
    const tier = tierForPercent(percent);
    if (tier === 'strong') {
      headline = `Strong performance in ${label}.`;
      narrative =
        `You answered ${correct} out of ${review.length} questions correctly (${percent}%)` +
        (skipped ? `, with ${skipped} left unanswered` : '') +
        `. This is a solid result — no major skill gap detected.`;
      suggestions.push('Keep this category in your regular practice rotation to stay sharp.');
    } else if (tier === 'moderate') {
      headline = `Moderate skill gap in ${label}.`;
      narrative =
        `You answered ${correct} out of ${review.length} questions correctly (${percent}%), with ${incorrect} incorrect` +
        (skipped ? ` and ${skipped} skipped` : '') +
        `. There's a real but fixable gap here.`;
      suggestions.push(`Work through the ${incorrect} incorrect question${incorrect === 1 ? '' : 's'} below and their explanations.`);
      suggestions.push(`Retake the ${label} quiz once you've reviewed them to confirm the gap is closed.`);
    } else {
      headline = `Significant skill gap in ${label}.`;
      narrative =
        `You answered only ${correct} out of ${review.length} questions correctly (${percent}%). This needs focused ` +
        `revision before it shows up in a real test or interview.`;
      suggestions.push("Go through every explanation below carefully — don't just retake blind.");
      suggestions.push(`Consider revisiting ${label} fundamentals from Study Materials before your next attempt.`);
    }
  }

  if (skipped > 0 && !hasPerItemCategory) {
    suggestions.push(
      `${skipped} question${skipped === 1 ? ' was' : 's were'} left unanswered — budget your time so you attempt every question next time.`
    );
  }
  if (result.confidenceScore !== null && result.confidenceScore !== undefined && result.confidenceScore < 45) {
    suggestions.push(
      'Your on-camera confidence was low during this attempt — practicing under timed, proctored conditions like this one will help it build up.'
    );
  }

  return { headline, narrative, suggestions, breakdown, correct, incorrect, skipped };
};

const AptitudeResults = ({ result, onRetry, onBack, categoryLabel }) => {
  const percent = result.totalQuestions ? Math.round((result.score / result.totalQuestions) * 100) : 0;
  const report = buildReport(result, categoryLabel);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card p-8 text-center">
        <p className="text-sm text-ink-3">Your Score</p>
        <p className="stat-figure mt-1 text-5xl font-bold text-brand-500">{percent}%</p>
        <p className="mt-2 text-ink-2">{result.score} out of {result.totalQuestions} correct</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
            <p className="stat-figure text-lg font-semibold text-brand-500">{report.correct}</p>
            <p className="text-xs text-ink-3">Correct</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
            <p className="stat-figure text-lg font-semibold text-danger">{report.incorrect}</p>
            <p className="text-xs text-ink-3">Incorrect</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
            <p className="stat-figure text-lg font-semibold text-gold">{report.skipped}</p>
            <p className="text-xs text-ink-3">Skipped</p>
          </div>
        </div>

        <ConfidenceStat score={result.confidenceScore} />

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onBack} className="btn-secondary">Back to Categories</button>
          <button onClick={onRetry} className="btn-primary">Retry</button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-base font-semibold text-ink-1">Detailed Report</h3>
        <p className="mt-3 font-medium text-ink-1">{report.headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{report.narrative}</p>

        {report.suggestions.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">What To Do Next</h4>
            <ul className="mt-2.5 space-y-2">
              {report.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.breakdown.length > 0 && (
          <div className="mt-5 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Category Breakdown</h4>
            {report.breakdown.map((b) => (
              <div key={b.category}>
                <div className="flex items-center justify-between text-xs text-ink-3">
                  <span>{b.category}</span>
                  <span className="font-mono text-ink-1">{b.correct}/{b.total} &middot; {b.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-card">
                  <div
                    className={`h-full transition-all ${b.percent >= 60 ? 'bg-brand-600' : b.percent >= 40 ? 'bg-gold' : 'bg-danger'}`}
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {result.review.map((item, idx) => (
          <div key={idx} className={`card p-5 ${item.isCorrect ? '' : 'border-danger/30'}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-ink-1">{idx + 1}. {item.question}</p>
              <span className={`shrink-0 text-lg ${item.isCorrect ? 'text-brand-500' : 'text-danger'}`}>
                {item.isCorrect ? '✓' : '✕'}
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              {item.options?.map((opt, optIdx) => {
                const isCorrectOpt = optIdx === item.correctOptionIndex;
                const isSelectedOpt = optIdx === item.selectedOptionIndex;
                return (
                  <div
                    key={optIdx}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isCorrectOpt
                        ? 'border-brand-500/50 bg-brand-600/10 text-brand-400'
                        : isSelectedOpt
                        ? 'border-danger/50 bg-danger/10 text-danger'
                        : 'border-surface-border text-ink-3'
                    }`}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
            {item.explanation && <p className="mt-3 text-sm text-ink-3">{item.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AptitudeResults;
