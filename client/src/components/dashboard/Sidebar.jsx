import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import Icon from '../icons/Icon';

// Each course gets its own nav — BE/BCA are placement-prep focused, UPSC has no
// coding/placement-drive/jobs and instead surfaces its own exam-prep sub-features
// (reference: the course-color-coded infographic panels).
const SIDEBAR_BY_COURSE = {
  BE: [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/resume', label: 'Resume', icon: 'document' },
    { to: '/ats-checker', label: 'ATS Checker', icon: 'shieldCheck' },
    { to: '/subject-prep', label: 'Subject Prep', icon: 'graduationCap' },
    { to: '/practice', label: 'Aptitude', icon: 'notes' },
    { to: '/coding', label: 'Coding', icon: 'code' },
    { to: '/contest', label: 'Weekend Contest', icon: 'trophy' },
    { to: '/mock-tests', label: 'Mock Tests', icon: 'flask' },
    { to: '/placement-drive', label: 'Placement Drive', icon: 'target' },
    { to: '/mock-interview', label: 'Mock Interview', icon: 'mic' },
    { to: '/practice-rooms', label: 'Peer Practice Rooms', icon: 'camera' },
    { to: '/jobs', label: 'Jobs', icon: 'briefcase' },
    { to: '/referrals', label: 'Referral Board', icon: 'user' },
    { to: '/career-roadmap', label: 'Career Roadmap', icon: 'trendingUp' },
    { to: '/study-groups', label: 'Study Groups', icon: 'chat' },
    { to: '/performance', label: 'Performance', icon: 'chart' },
    { to: '/study-materials', label: 'Study Materials', icon: 'book' },
    { to: '/flashcards', label: 'Flashcards', icon: 'layers' },
  ],
  BCA: [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/resume', label: 'Resume', icon: 'document' },
    { to: '/ats-checker', label: 'ATS Checker', icon: 'shieldCheck' },
    { to: '/subject-prep', label: 'Programming & Web Dev', icon: 'globe' },
    { to: '/practice', label: 'Aptitude', icon: 'notes' },
    { to: '/coding', label: 'Coding', icon: 'code' },
    { to: '/contest', label: 'Weekend Contest', icon: 'trophy' },
    { to: '/mock-tests', label: 'Mock Tests', icon: 'flask' },
    { to: '/placement-drive', label: 'Placement Drive', icon: 'target' },
    { to: '/mock-interview', label: 'Mock Interview', icon: 'mic' },
    { to: '/practice-rooms', label: 'Peer Practice Rooms', icon: 'camera' },
    { to: '/jobs', label: 'Jobs', icon: 'briefcase' },
    { to: '/referrals', label: 'Referral Board', icon: 'user' },
    { to: '/career-roadmap', label: 'Career Roadmap', icon: 'trendingUp' },
    { to: '/study-groups', label: 'Study Groups', icon: 'chat' },
    { to: '/performance', label: 'Performance', icon: 'chart' },
    { to: '/study-materials', label: 'Study Materials', icon: 'book' },
    { to: '/flashcards', label: 'Flashcards', icon: 'layers' },
  ],
  UPSC: [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/study-materials', label: 'Study Materials', icon: 'book' },
    { to: '/flashcards', label: 'Flashcards', icon: 'layers' },
    { to: '/upsc/previous-papers', label: 'Previous Papers', icon: 'archive' },
    { to: '/upsc/current-affairs', label: 'Current Affairs', icon: 'newspaper' },
    { to: '/upsc/mock-tests', label: 'Mock Tests', icon: 'flask' },
    { to: '/upsc/answer-writing', label: 'Answer Writing', icon: 'pen' },
    { to: '/upsc/study-planner', label: 'Study Planner', icon: 'calendar' },
    { to: '/upsc/doubt-solver', label: 'AI Doubt Solver', icon: 'helpCircle' },
    { to: '/practice-rooms', label: 'Peer Practice Rooms', icon: 'camera' },
    { to: '/career-roadmap', label: 'Career Roadmap', icon: 'trendingUp' },
    { to: '/study-groups', label: 'Study Groups', icon: 'chat' },
    { to: '/performance', label: 'Performance', icon: 'chart' },
  ],
};

const DEFAULT_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home' },
  { to: '/resume', label: 'Resume', icon: 'document' },
  { to: '/study-materials', label: 'Study Materials', icon: 'book' },
  { to: '/performance', label: 'Performance', icon: 'chart' },
];

const ACCOUNT_LINKS = [
  { to: '/profile', label: 'Profile', icon: 'user' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const course = useSelector((state) => state.dashboard.data?.course);
  const role = useSelector((state) => state.auth.user?.role);
  const isStaff = role === 'faculty' || role === 'admin';
  const links = [
    ...(SIDEBAR_BY_COURSE[course] || DEFAULT_LINKS),
    ...(isStaff ? [{ to: '/admin', label: role === 'admin' ? 'Admin Panel' : 'Faculty Panel', icon: 'shieldCheck' }] : []),
    ...ACCOUNT_LINKS,
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-surface-border bg-surface-light transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-surface-border px-6">
          <span className="text-lg font-bold text-ink-1">
            Placement<span className="text-brand-500">Prep</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400'
                    : 'text-ink-2 hover:bg-surface-card hover:text-ink-1'
                }`
              }
            >
              <Icon name={link.icon} className="h-[18px] w-[18px] shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-border p-3">
          <button
            onClick={() => dispatch(logout())}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-surface-card hover:text-danger"
          >
            <Icon name="logout" className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
