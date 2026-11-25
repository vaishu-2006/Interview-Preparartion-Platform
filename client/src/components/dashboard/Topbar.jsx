import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-surface px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-2 hover:bg-surface-light hover:text-ink-1 lg:hidden"
        aria-label="Toggle menu"
      >
        &#9776;
      </button>

      <div className="hidden text-sm text-ink-2 lg:block">
        Welcome back, <span className="text-ink-1">{user?.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link to="/profile" className="flex items-center gap-2">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-ink-1">
              {initials || 'U'}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
