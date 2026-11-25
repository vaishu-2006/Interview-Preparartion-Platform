import Icon from '../icons/Icon';

const STAGES = [
  { key: 'resume_screening', label: 'Resume Screening', icon: 'document' },
  { key: 'online_assessment', label: 'Online Assessment', icon: 'calculator' },
  { key: 'technical_interview', label: 'Technical Interview', icon: 'laptop' },
  { key: 'hr_interview', label: 'HR Interview', icon: 'chat' },
  { key: 'final_evaluation', label: 'Final Evaluation', icon: 'checkCircle' },
  { key: 'result', label: 'Result', icon: 'trophy' },
];

const StageStepper = ({ currentStage }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="card overflow-x-auto p-5">
      <div className="flex min-w-[720px] items-center">
        {STAGES.map((stage, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'locked';
          return (
            <div key={stage.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    state === 'done'
                      ? 'border-brand-500 bg-brand-600/15 text-brand-400'
                      : state === 'active'
                      ? 'border-brand-500 bg-brand-600 text-white'
                      : 'border-surface-border bg-surface text-ink-3'
                  }`}
                >
                  <Icon name={state === 'done' ? 'checkCircle' : stage.icon} className="h-[18px] w-[18px]" />
                </div>
                <span
                  className={`w-24 text-xs font-medium leading-tight ${
                    state === 'locked' ? 'text-ink-3' : state === 'active' ? 'text-ink-1' : 'text-ink-2'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 ${i < currentIndex ? 'bg-brand-500' : 'bg-surface-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageStepper;
