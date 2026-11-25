import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingScreen from '../components/common/LoadingScreen';
import StageStepper from '../components/placement-drive/StageStepper';
import ResumeScreeningStage from '../components/placement-drive/ResumeScreeningStage';
import OnlineAssessmentStage from '../components/placement-drive/OnlineAssessmentStage';
import InterviewStage from '../components/placement-drive/InterviewStage';
import FinalEvaluationStage from '../components/placement-drive/FinalEvaluationStage';
import ResultStage from '../components/placement-drive/ResultStage';
import placementDriveService from '../services/placementDriveService';

const PlacementDrivePage = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    placementDriveService
      .getDrive(driveId)
      .then((data) => setDrive(data.drive))
      .catch(() => setError(true));
  }, [driveId]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-ink-2">This placement drive could not be loaded.</p>
        <Link to="/placement-drive" className="btn-secondary mt-4 inline-flex">Back to Placement Drive</Link>
      </div>
    );
  }

  if (!drive) return <LoadingScreen label="Loading your drive..." />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">{drive.jobRole}</h1>
        <p className="mt-1 text-ink-3">{drive.course}{drive.branch ? ` · ${drive.branch}` : ''} &middot; {drive.difficulty}</p>
      </div>

      <StageStepper currentStage={drive.currentStage} />

      {drive.currentStage === 'resume_screening' && <ResumeScreeningStage drive={drive} onAdvance={setDrive} />}
      {drive.currentStage === 'online_assessment' && <OnlineAssessmentStage drive={drive} onAdvance={setDrive} />}
      {drive.currentStage === 'technical_interview' && (
        <InterviewStage drive={drive} stageKey="technical_interview" label="Technical Interview" onAdvance={setDrive} />
      )}
      {drive.currentStage === 'hr_interview' && (
        <InterviewStage drive={drive} stageKey="hr_interview" label="HR Interview" onAdvance={setDrive} />
      )}
      {drive.currentStage === 'final_evaluation' && <FinalEvaluationStage drive={drive} onAdvance={setDrive} />}
      {drive.currentStage === 'result' && <ResultStage drive={drive} />}
    </div>
  );
};

export default PlacementDrivePage;
