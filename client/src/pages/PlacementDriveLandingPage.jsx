import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import placementDriveService from '../services/placementDriveService';
import dashboardService from '../services/dashboardService';
import LoadingScreen from '../components/common/LoadingScreen';
import FormInput from '../components/common/FormInput';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const PlacementDriveLandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeDrive, setActiveDrive] = useState(null);
  const [profileCourse, setProfileCourse] = useState(null);
  const [form, setForm] = useState({ course: 'BE', branch: '', jobRole: '', difficulty: 'Medium' });
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([placementDriveService.getActiveDrive(), dashboardService.getDashboard()])
      .then(([driveData, dashboardData]) => {
        setActiveDrive(driveData.drive);
        setProfileCourse(dashboardData.course);
        if (['BE', 'BCA'].includes(dashboardData.course)) {
          setForm((prev) => ({ ...prev, course: dashboardData.course, branch: dashboardData.branch || '' }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!form.jobRole.trim()) {
      toast.error('Job role is required');
      return;
    }
    setStarting(true);
    try {
      const data = await placementDriveService.startDrive(form);
      navigate(`/placement-drive/${data.drive._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start drive');
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <LoadingScreen label="Loading Placement Drive..." />;

  if (activeDrive) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-ink-1">Placement Drive</h1>
        <div className="card mt-6 p-6">
          <p className="text-sm text-ink-3">You have a drive already in progress.</p>
          <h2 className="mt-1 text-lg font-semibold text-ink-1">{activeDrive.jobRole} &middot; {activeDrive.course}</h2>
          <p className="mt-1 text-sm text-ink-2">
            Current stage: <span className="font-medium text-brand-400">{activeDrive.currentStage.replace(/_/g, ' ')}</span>
          </p>
          <button onClick={() => navigate(`/placement-drive/${activeDrive._id}`)} className="btn-primary mt-5 w-full">
            Resume Drive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-ink-1">Placement Drive</h1>
      <p className="mt-1 text-ink-3">
        A full simulated placement pipeline: Resume Screening &rarr; Online Assessment &rarr; Technical Interview &rarr; HR Interview
        &rarr; Final Evaluation &rarr; Result.
      </p>

      {profileCourse === 'UPSC' && (
        <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
          This flow is built for BE/BCA placement pipelines. You can still try it, but the content won't be UPSC-specific.
        </div>
      )}

      <form onSubmit={handleStart} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label-text">Course</label>
          <div className="flex gap-2">
            {['BE', 'BCA'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, course: c }))}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.course === c ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <FormInput
          id="jobRole"
          name="jobRole"
          label="Job Role"
          placeholder="e.g. Software Engineer"
          value={form.jobRole}
          onChange={(e) => setForm((prev) => ({ ...prev, jobRole: e.target.value }))}
        />

        <FormInput
          id="branch"
          name="branch"
          label="Branch (optional)"
          placeholder="e.g. Computer Science"
          value={form.branch}
          onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))}
        />

        <div>
          <label className="label-text">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, difficulty: d }))}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.difficulty === d ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={starting} className="btn-primary w-full">
          {starting ? 'Starting...' : 'Start Placement Drive'}
        </button>
      </form>
    </div>
  );
};

export default PlacementDriveLandingPage;
