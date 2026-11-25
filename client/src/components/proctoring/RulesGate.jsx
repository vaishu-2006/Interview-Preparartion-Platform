import { useState } from 'react';
import Icon from '../icons/Icon';

// Shown before every proctored flow (aptitude/coding/mock tests/subject quizzes/placement
// drive stages/mock interview). Each caller passes its own real rule list — this is the fix
// for "don't show the same proctoring list everywhere" — and only webcam-based flows show the
// camera/mic prompt. Requesting getUserMedia here (and immediately releasing the probe stream)
// puts the permission ask at the very start of every test, on top of the browser's own prompt,
// rather than silently in the background after the page has already loaded.
const RulesGate = ({ title, rules, requiresWebcam = false, onStart }) => {
  const [permissionState, setPermissionState] = useState(requiresWebcam ? 'idle' : 'granted');
  const [starting, setStarting] = useState(false);

  const requestPermission = async () => {
    setPermissionState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setPermissionState('granted');
    } catch {
      setPermissionState('denied');
    }
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      // Best-effort — some environments (embedded iframes, certain browsers) block fullscreen
      // outright. Not fatal: useProctoring only flags an *exit* from fullscreen, so if it never
      // engaged in the first place there's nothing to enforce, and the test still proceeds.
      try {
        await document.documentElement.requestFullscreen?.();
      } catch {
        // ignored — see comment above
      }
      // Callers already toast their own errors and don't rethrow, so this alone can't detect
      // failure — but it still needs to run so the button re-enables for a retry either way
      // (on success the caller normally navigates/switches views, unmounting this component).
      await onStart();
    } finally {
      setStarting(false);
    }
  };

  const canStart = !starting && permissionState !== 'requesting' && (!requiresWebcam || permissionState === 'granted');

  return (
    <div className="mx-auto max-w-xl">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
            <Icon name="shieldCheck" className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink-1">Rules & Regulations</h2>
            <p className="text-sm text-ink-3">{title}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2">
              <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {rule}
            </li>
          ))}
        </ul>

        {requiresWebcam && (
          <div className="mt-5 rounded-xl border border-surface-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm text-ink-2">
              <Icon name="camera" className="h-4 w-4 shrink-0" />
              This test requires camera and microphone access.
            </div>
            {permissionState === 'idle' && (
              <button onClick={requestPermission} className="btn-secondary mt-3 text-sm">
                Grant Camera & Microphone Access
              </button>
            )}
            {permissionState === 'requesting' && <p className="mt-2 text-xs text-ink-3">Requesting access...</p>}
            {permissionState === 'granted' && <p className="mt-2 text-xs text-brand-400">Access granted.</p>}
            {permissionState === 'denied' && (
              <div>
                <p className="mt-2 text-xs text-danger">Access denied — this test can't proceed without camera/mic.</p>
                <button onClick={requestPermission} className="btn-secondary mt-2 text-sm">
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        <p className="mt-5 text-xs text-ink-3">
          The test will open in fullscreen — exiting fullscreen counts as a warning, same as switching tabs.
        </p>

        <button onClick={handleStart} disabled={!canStart} className="btn-primary mt-3 w-full">
          {starting ? 'Starting...' : 'I Understand — Start Test'}
        </button>
      </div>
    </div>
  );
};

export default RulesGate;
