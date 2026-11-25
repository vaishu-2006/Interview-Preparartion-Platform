import Icon from '../icons/Icon';

// A lightweight animated stand-in for a live interviewer — no photorealistic avatar video
// service, just a pulse animation synced to the speech-synthesis "speaking" state.
const InterviewerAvatar = ({ speaking }) => (
  <div className="card flex flex-col items-center justify-center gap-3 p-6">
    <div className="relative flex h-20 w-20 items-center justify-center">
      {speaking && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />
          <span className="absolute inset-0 animate-pulse rounded-full bg-brand-500/20" />
        </>
      )}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-500 bg-brand-600/15">
        <Icon name="user" className="h-9 w-9 text-brand-500" />
      </div>
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-ink-1">AI Interviewer</p>
      <p className="text-xs text-ink-3">{speaking ? 'Speaking...' : 'Listening'}</p>
    </div>
  </div>
);

export default InterviewerAvatar;
