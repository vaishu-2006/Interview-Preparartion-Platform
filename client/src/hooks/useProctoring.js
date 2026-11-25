import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_VIOLATIONS = 3;
export const VIOLATION_LABELS = {
  tab_switch: 'Switching tabs or windows',
  copy: 'Copying question text',
  paste: 'Pasting content into your answer',
  right_click: 'Right-click / context menu',
  devtools_shortcut: 'Attempting to open developer tools',
  phone_detected: 'Mobile phone detected in webcam frame',
  looking_away: 'Looking away from the screen for too long',
  fullscreen_exit: 'Exiting fullscreen during the test',
};

const isDevToolsShortcut = (e) => {
  const key = e.key?.toLowerCase();
  if (key === 'f12') return true;
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) return true;
  if ((e.ctrlKey || e.metaKey) && key === 'u') return true;
  return false;
};

// Anti-cheat: flags tab switches (Page Visibility API), copy/paste, right-click,
// and devtools shortcuts; counts warnings; auto-submits once the limit is reached.
// Listeners run in the capture phase so they intercept before any child element
// (e.g. an embedded editor) can handle the event first.
const useProctoring = ({ enabled, currentIndexRef, onViolation, onAutoSubmit, captureEvidence }) => {
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState(null);
  const enabledRef = useRef(enabled);
  const autoSubmittedRef = useRef(false);
  // Source of truth for "have we hit the limit", read back synchronously in the same tick —
  // deriving this from the setViolationCount functional-updater instead (as before) raced
  // against the Promise.then() microtask below, since React doesn't guarantee the updater
  // runs before that microtask fires, so the 3rd warning could silently fail to auto-submit.
  const violationCountRef = useRef(0);
  // Only flags exiting fullscreen if the test actually entered it in the first place — a
  // browser/environment that blocks the fullscreen request shouldn't get a false violation
  // just because it was never fullscreen to begin with.
  const wasFullscreenRef = useRef(false);
  enabledRef.current = enabled;

  const flag = useCallback(
    (type) => {
      if (!enabledRef.current || autoSubmittedRef.current) return;
      setLastViolation(type);
      violationCountRef.current += 1;
      const next = violationCountRef.current;
      setViolationCount(next);
      const hitLimit = next >= MAX_VIOLATIONS;
      if (hitLimit) autoSubmittedRef.current = true;

      const evidence = captureEvidence?.();
      // onViolation is optional: contexts with no server-side violation persistence (Aptitude,
      // Coding, Mock Tests) auto-submit locally once the in-memory count above hits the max,
      // instead of waiting on a server round-trip to say so.
      Promise.resolve(onViolation?.({ type, questionIndex: currentIndexRef?.current, evidence }))
        .then((result) => {
          if (result?.shouldAutoSubmit || (!onViolation && hitLimit)) onAutoSubmit?.();
        })
        .catch(() => {
          if (!onViolation && hitLimit) onAutoSubmit?.();
        });
    },
    [onViolation, onAutoSubmit, currentIndexRef, captureEvidence]
  );

  useEffect(() => {
    // RulesGate requests fullscreen and awaits it BEFORE this component (and this effect) ever
    // mounts, so the "entered fullscreen" transition has already happened by the time this
    // listener attaches — relying on catching that transition left wasFullscreenRef stuck at
    // `false` forever, so exiting fullscreen (Esc, browser back, etc.) was silently never
    // flagged. Reading the actual current state here instead of waiting to observe the entry
    // event fixes that, regardless of mount ordering.
    wasFullscreenRef.current = Boolean(document.fullscreenElement);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flag('tab_switch');
    };
    const handleCopy = (e) => {
      e.preventDefault();
      flag('copy');
    };
    const handleCutOrPaste = (e) => {
      e.preventDefault();
      flag('paste');
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      flag('right_click');
    };
    const handleKeydown = (e) => {
      if (isDevToolsShortcut(e)) {
        e.preventDefault();
        flag('devtools_shortcut');
      }
    };
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        wasFullscreenRef.current = true;
        return;
      }
      if (wasFullscreenRef.current) {
        wasFullscreenRef.current = false;
        flag('fullscreen_exit');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('paste', handleCutOrPaste, true);
    document.addEventListener('cut', handleCutOrPaste, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('paste', handleCutOrPaste, true);
      document.removeEventListener('cut', handleCutOrPaste, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [flag]);

  return { violationCount, lastViolation, maxViolations: MAX_VIOLATIONS, labels: VIOLATION_LABELS, flag };
};

export default useProctoring;
