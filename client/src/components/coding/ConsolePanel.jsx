const STATUS_STYLES = {
  Accepted: 'text-brand-500 bg-brand-600/10',
  'Wrong Answer': 'text-danger bg-danger/10',
  'Runtime Error': 'text-danger bg-danger/10',
  'Compilation Error': 'text-danger bg-danger/10',
  Ran: 'text-gold bg-gold/10',
};

const ConsolePanel = ({ result }) => {
  if (!result) {
    return (
      <div className="card flex h-40 items-center justify-center p-6 text-sm text-ink-3">
        Run or submit your code to see output here.
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[result.status] || 'text-ink-2 bg-surface'}`}>
          {result.status}
        </span>
        {result.passedTestCases !== undefined && (
          <span className="stat-figure text-xs text-ink-3">{result.passedTestCases}/{result.totalTestCases} test cases passed</span>
        )}
      </div>

      {result.results && (
        <div className="mt-3 space-y-2">
          {result.results.map((tc, idx) => (
            <div key={idx} className={`rounded-lg border p-3 text-xs ${tc.passed ? 'border-brand-500/30' : 'border-danger/30'}`}>
              <div className="flex items-center justify-between">
                <span className={tc.passed ? 'text-brand-400' : 'text-danger'}>
                  {tc.passed ? '✓ Passed' : '✕ Failed'} {tc.isHidden ? '(hidden)' : `#${idx + 1}`}
                </span>
              </div>
              {!tc.isHidden && tc.input !== undefined && (
                <div className="mt-2 space-y-1 font-mono text-ink-3">
                  <p>Input: {tc.input}</p>
                  <p>Expected: {tc.expectedOutput}</p>
                  <p>Got: {tc.actualOutput}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(result.stdout !== undefined || result.stderr) && (
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-surface p-3 font-mono text-xs text-ink-2">
          {result.stdout || ''}
          {result.stderr && <span className="text-danger">{'\n' + result.stderr}</span>}
          {result.compileOutput && <span className="text-danger">{'\n' + result.compileOutput}</span>}
        </pre>
      )}
    </div>
  );
};

export default ConsolePanel;
