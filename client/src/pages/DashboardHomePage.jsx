import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { fetchDashboard } from '../redux/slices/dashboardSlice';
import adminService from '../services/adminService';
import StatCard from '../components/dashboard/StatCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';

// BE/BCA are placement-prep focused; UPSC has no coding/aptitude/interview in that sense,
// so it gets its own set of quick actions and progress breakdown entirely.
const QUICK_ACTIONS_BY_COURSE = {
  BE: [
    { to: '/resume', icon: 'document', title: 'Resume Builder', desc: 'Build, export, and ATS-score your resume' },
    { to: '/coding', icon: 'code', title: 'Coding Practice', desc: 'Solve DSA problems' },
    { to: '/contest', icon: 'trophy', title: 'Weekend Contest', desc: "This weekend's 5-problem set and leaderboard" },
    { to: '/placement-drive', icon: 'target', title: 'Placement Drive', desc: 'Run the full gated interview pipeline' },
    { to: '/mock-interview', icon: 'mic', title: 'Mock Interview', desc: 'Practice with AI interviews' },
    { to: '/performance', icon: 'chart', title: 'Performance History', desc: 'Track your progress' },
  ],
  BCA: [
    { to: '/resume', icon: 'document', title: 'Resume Builder', desc: 'Build, export, and ATS-score your resume' },
    { to: '/coding', icon: 'code', title: 'Coding Practice', desc: 'Solve DSA problems' },
    { to: '/contest', icon: 'trophy', title: 'Weekend Contest', desc: "This weekend's 5-problem set and leaderboard" },
    { to: '/placement-drive', icon: 'target', title: 'Placement Drive', desc: 'Run the full gated interview pipeline' },
    { to: '/mock-interview', icon: 'mic', title: 'Mock Interview', desc: 'Practice with AI interviews' },
    { to: '/performance', icon: 'chart', title: 'Performance History', desc: 'Track your progress' },
  ],
  UPSC: [
    { to: '/upsc/previous-papers', icon: 'archive', title: 'Previous Papers', desc: 'Prelims, Mains and Interview papers' },
    { to: '/upsc/mock-tests', icon: 'flask', title: 'Mock Tests', desc: 'Prelims/Mains-style test series' },
    { to: '/upsc/answer-writing', icon: 'pen', title: 'Answer Writing', desc: 'Get AI feedback on Mains-style answers' },
    { to: '/upsc/current-affairs', icon: 'newspaper', title: 'Current Affairs', desc: 'Daily and weekly updates' },
    { to: '/upsc/study-planner', icon: 'calendar', title: 'Study Planner', desc: 'Track revision tasks and bookmarked resources' },
    { to: '/upsc/doubt-solver', icon: 'helpCircle', title: 'AI Doubt Solver', desc: 'Ask anything, get an explanation' },
  ],
};
const DEFAULT_QUICK_ACTIONS = QUICK_ACTIONS_BY_COURSE.BE;

const MODULE_PROGRESS_FIELDS_BY_COURSE = {
  UPSC: [
    { key: 'mockTests', label: 'Mock Tests' },
    { key: 'answerWriting', label: 'Answer Writing' },
  ],
};
const DEFAULT_MODULE_PROGRESS_FIELDS = [
  { key: 'coding', label: 'Coding' },
  { key: 'aptitude', label: 'Aptitude' },
  { key: 'resume', label: 'Resume' },
  { key: 'interview', label: 'Mock Interviews' },
];

const DashboardHomePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { data, status } = useSelector((state) => state.dashboard);
  const [assignments, setAssignments] = useState(null);
  const [activeEvents, setActiveEvents] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    adminService.listMyAssignments().then((data2) => setAssignments(data2.assignments)).catch(() => setAssignments([]));
    adminService.listActiveEvents().then((data2) => setActiveEvents(data2.events)).catch(() => setActiveEvents([]));
  }, []);

  if (status === 'loading' || status === 'idle') {
    return <LoadingScreen label="Loading your dashboard..." />;
  }

  const quickActions = QUICK_ACTIONS_BY_COURSE[data?.course] || DEFAULT_QUICK_ACTIONS;
  const progressFields = MODULE_PROGRESS_FIELDS_BY_COURSE[data?.course] || DEFAULT_MODULE_PROGRESS_FIELDS;

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-ink-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-1 text-ink-2">
          {data?.course
            ? `Preparing for ${data.course}${data.branch ? ` · ${data.branch}` : ''}`
            : 'Complete your path selection to get personalized content.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Preparation Progress" value={`${data?.currentProgress ?? 0}%`} icon="trendingUp" />
        <StatCard label="Selected Path" value={data?.course || '—'} icon="target" />
        <StatCard label="Points" value={data?.points ?? 0} icon="trophy" />
        <StatCard label="Recent Activities" value={data?.recentActivities?.length ?? 0} icon="clock" />
      </div>

      {data?.moduleProgress && (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink-1">Preparation Breakdown</h2>
          <div className="space-y-4">
            {progressFields.map((f) => (
              <div key={f.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-2">{f.label}</span>
                  <span className="stat-figure text-ink-3">{data.moduleProgress[f.key] ?? 0}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-card">
                  <div className="h-full bg-brand-600 transition-all" style={{ width: `${data.moduleProgress[f.key] ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {((assignments && assignments.length > 0) || (activeEvents && activeEvents.length > 0)) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {assignments && assignments.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-1">
                <Icon name="target" className="h-4 w-4 text-brand-500" />
                Assigned by Faculty
              </h2>
              <div className="space-y-2.5">
                {assignments.map((a) => (
                  <Link
                    key={a._id}
                    to={`/coding/${a.problemId.slug}`}
                    className="flex items-center justify-between rounded-lg border border-surface-border px-3.5 py-2.5 text-sm transition hover:border-brand-500/40"
                  >
                    <span className="text-ink-1">{a.problemId.title}</span>
                    {a.dueDate && <span className="text-xs text-ink-3">Due {new Date(a.dueDate).toLocaleDateString()}</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {activeEvents && activeEvents.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-1">
                <Icon name="trophy" className="h-4 w-4 text-gold" />
                Active Events
              </h2>
              <div className="space-y-2.5">
                {activeEvents.map((ev) => (
                  <div key={ev._id} className="rounded-lg border border-surface-border px-3.5 py-2.5">
                    <p className="text-sm text-ink-1">{ev.title}</p>
                    {ev.description && <p className="mt-0.5 text-xs text-ink-3">{ev.description}</p>}
                    <p className="mt-1 text-xs text-ink-3">
                      Ends {new Date(ev.endsAt).toLocaleDateString()}{ev.bonusPoints ? ` · up to ${ev.bonusPoints} bonus points` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.to} {...action} />
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Recent Activity</h2>
        {data?.recentActivities?.length ? (
          <ul className="space-y-3">
            {data.recentActivities.map((activity, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm">
                <span className="text-ink-2">{activity.label}</span>
                <span className="text-ink-3">{new Date(activity.occurredAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-3">No activity yet. Start practicing to see your history here.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHomePage;
