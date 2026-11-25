import { useEffect, useState } from 'react';
import aptitudeService from '../../services/aptitudeService';
import Icon from '../icons/Icon';

// Fresh, on-demand AI-generated practice questions for a weak topic — explicitly not scored
// or persisted (no proctoring, no points, no attempt record). It's a quick way to drill a weak
// area right now, not a replacement for the curated, verified question banks.
const AiPracticeModal = ({ topic, onClose }) => {
  const [state, setState] = useState({ status: 'loading', questions: [], message: '' });
  const [revealed, setRevealed] = useState({});
  const [selected, setSelected] = useState({});

  useEffect(() => {
    aptitudeService
      .practiceMore(topic)
      .then((data) => {
        if (data.questions?.length) {
          setState({ status: 'ready', questions: data.questions, message: '' });
        } else {
          setState({ status: 'empty', questions: [], message: data.message || 'No practice questions available right now.' });
        }
      })
      .catch((err) => setState({ status: 'empty', questions: [], message: err.response?.data?.message || 'Failed to generate practice questions.' }));
  }, [topic]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-1">AI Practice — {topic}</h2>
            <p className="mt-0.5 text-xs text-ink-3">Fresh questions, not scored or saved — just for quick drilling.</p>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-ink-1" aria-label="Close">&times;</button>
        </div>

        {state.status === 'loading' && <p className="mt-6 text-sm text-ink-3">Generating questions...</p>}
        {state.status === 'empty' && <p className="mt-6 text-sm text-ink-3">{state.message}</p>}

        {state.status === 'ready' && (
          <div className="mt-5 space-y-5">
            {state.questions.map((q, idx) => (
              <div key={idx} className="rounded-xl border border-surface-border p-4">
                <p className="text-sm font-medium text-ink-1">{idx + 1}. {q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isRevealed = revealed[idx];
                    const isCorrectOpt = optIdx === q.correctOptionIndex;
                    const isSelectedOpt = selected[idx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setSelected((prev) => ({ ...prev, [idx]: optIdx }))}
                        disabled={isRevealed}
                        className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          isRevealed && isCorrectOpt
                            ? 'border-brand-500/50 bg-brand-600/10 text-brand-400'
                            : isRevealed && isSelectedOpt
                            ? 'border-danger/50 bg-danger/10 text-danger'
                            : isSelectedOpt
                            ? 'border-brand-500 bg-brand-600/10 text-brand-400'
                            : 'border-surface-border text-ink-2 hover:border-brand-500/40'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {!revealed[idx] ? (
                  <button
                    onClick={() => setRevealed((prev) => ({ ...prev, [idx]: true }))}
                    disabled={selected[idx] === undefined}
                    className="btn-secondary mt-3 text-xs"
                  >
                    Check Answer
                  </button>
                ) : (
                  q.explanation && (
                    <p className="mt-3 flex items-start gap-2 text-xs text-ink-3">
                      <Icon name="helpCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {q.explanation}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiPracticeModal;
