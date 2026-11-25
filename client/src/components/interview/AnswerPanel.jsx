import Icon from '../icons/Icon';

const AnswerPanel = ({ speech, answerText, setAnswerText }) => {
  const useVoiceValue = speech.listening ? speech.transcript : answerText;

  const handleToggleVoice = () => {
    if (speech.listening) {
      speech.stop();
      setAnswerText(speech.transcript);
    } else {
      speech.start();
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-1">Your Answer</h3>
        {speech.isSupported ? (
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              speech.listening ? 'bg-danger/15 text-danger' : 'bg-brand-600/15 text-brand-400'
            }`}
          >
            {speech.listening ? (
              'Pause Listening'
            ) : (
              <>
                <Icon name="mic" className="h-3.5 w-3.5" /> Resume Listening
              </>
            )}
          </button>
        ) : (
          <span className="text-xs text-ink-3">Voice input not supported in this browser — type your answer.</span>
        )}
      </div>

      {speech.error && <p className="mb-2 text-xs text-gold">{speech.error}</p>}

      <textarea
        className="input-field min-h-[140px] resize-y"
        placeholder="The AI starts listening automatically after each question — just speak your answer, or type here."
        value={speech.listening ? useVoiceValue : answerText}
        onChange={(e) => {
          setAnswerText(e.target.value);
          if (speech.listening) speech.setTranscript(e.target.value);
        }}
      />
    </div>
  );
};

export default AnswerPanel;
