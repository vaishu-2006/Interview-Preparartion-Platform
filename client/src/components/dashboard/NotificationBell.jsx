import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import Icon from '../icons/Icon';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const rootRef = useRef(null);

  const load = () => notificationService.list().then((data) => {
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  });

  useEffect(() => {
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open && unreadCount > 0) {
      notificationService.markAllRead().then(() => setUnreadCount(0));
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button onClick={handleOpen} className="relative rounded-lg p-2 text-ink-2 hover:bg-surface-light hover:text-ink-1" aria-label="Notifications">
        <Icon name="bell" className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-surface-border bg-surface-light shadow-xl">
          <div className="border-b border-surface-border px-4 py-3">
            <p className="text-sm font-semibold text-ink-1">Notifications</p>
          </div>
          {!notifications.length ? (
            <p className="p-4 text-sm text-ink-3">No notifications yet.</p>
          ) : (
            <div className="divide-y divide-surface-border">
              {notifications.map((n) => {
                const Wrapper = n.link ? Link : 'div';
                const wrapperProps = n.link ? { to: n.link, onClick: () => setOpen(false) } : {};
                return (
                  <Wrapper key={n._id} {...wrapperProps} className={`block px-4 py-3 text-sm transition hover:bg-surface-card ${!n.read ? 'bg-brand-600/5' : ''}`}>
                    <p className="text-ink-2">{n.message}</p>
                    <p className="mt-1 text-[11px] text-ink-3">{new Date(n.createdAt).toLocaleString()}</p>
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
