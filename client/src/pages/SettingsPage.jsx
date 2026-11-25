import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { toggleTheme } from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';
import FormInput from '../components/common/FormInput';
import authService from '../services/authService';
import portfolioService from '../services/portfolioService';
import calendarService from '../services/calendarService';
import dataExportService from '../services/dataExportService';
import pushService from '../services/pushService';
import { enablePush, disablePush } from '../utils/push';
import { isPasswordStrong } from '../utils/validators';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [portfolio, setPortfolio] = useState(null);
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [exportingCalendar, setExportingCalendar] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [pushStatus, setPushStatus] = useState(null);
  const [pushSaving, setPushSaving] = useState(false);

  useEffect(() => {
    pushService.getStatus().then(setPushStatus);
  }, []);

  useEffect(() => {
    portfolioService.getMySettings().then(setPortfolio);
  }, []);

  const handleTogglePortfolio = async () => {
    setPortfolioSaving(true);
    try {
      const next = await portfolioService.setPublic(!portfolio.isPublic);
      setPortfolio(next);
      toast.success(next.isPublic ? 'Your portfolio is now public' : 'Your portfolio is now private');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update portfolio visibility');
    } finally {
      setPortfolioSaving(false);
    }
  };

  const handleCopyPortfolioLink = () => {
    const url = `${window.location.origin}/p/${portfolio.slug}`;
    navigator.clipboard?.writeText(url);
    toast.success('Link copied');
  };

  const handleExportCalendar = async () => {
    setExportingCalendar(true);
    try {
      await calendarService.downloadIcs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to export calendar');
    } finally {
      setExportingCalendar(false);
    }
  };

  const handleTogglePush = async () => {
    setPushSaving(true);
    try {
      if (pushStatus.subscribed) {
        await disablePush();
        toast.success('Push notifications turned off');
      } else {
        await enablePush();
        toast.success('Push notifications enabled — you\'ll get alerts even when the tab is closed');
      }
      const next = await pushService.getStatus();
      setPushStatus(next);
    } catch (err) {
      toast.error(err.message || 'Failed to update push notification settings');
    } finally {
      setPushSaving(false);
    }
  };

  const handleExportData = async () => {
    setExportingData(true);
    try {
      await dataExportService.downloadMyData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to export your data');
    } finally {
      setExportingData(false);
    }
  };

  const handlePasswordChange = (e) =>
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong(passwordForm.newPassword)) {
      toast.error('New password must be at least 8 characters with an uppercase letter and a number');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordSaving(true);
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authService.deleteAccount();
      toast.success('Account deleted');
      dispatch(logout());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Settings</h1>
        <p className="mt-1 text-ink-2">Manage your account preferences and security.</p>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Theme</h2>
        <p className="mt-1 text-sm text-ink-3">Switch between dark and light appearance.</p>
        <button onClick={() => dispatch(toggleTheme())} className="btn-secondary mt-4">
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Push Notifications</h2>
        <p className="mt-1 text-sm text-ink-3">
          Get real browser notifications — assignments, events, referrals — even when this tab isn't open.
        </p>
        {pushStatus && !pushStatus.configured ? (
          <p className="mt-4 text-xs text-ink-3">Push notifications aren't configured on this deployment yet.</p>
        ) : (
          pushStatus && (
            <button onClick={handleTogglePush} disabled={pushSaving} className="btn-secondary mt-4">
              {pushSaving ? 'Saving...' : pushStatus.subscribed ? 'Turn Off Push Notifications' : 'Enable Push Notifications'}
            </button>
          )
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Public Portfolio</h2>
        <p className="mt-1 text-sm text-ink-3">
          Share a read-only link to your level, badges, and real activity stats. Off by default — nothing is shared until you turn this on.
        </p>
        {portfolio && (
          <div className="mt-4 space-y-3">
            <button onClick={handleTogglePortfolio} disabled={portfolioSaving} className="btn-secondary">
              {portfolioSaving ? 'Saving...' : portfolio.isPublic ? 'Make Private' : 'Make Public'}
            </button>
            {portfolio.isPublic && portfolio.slug && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs">
                <span className="text-ink-2">{window.location.origin}/p/{portfolio.slug}</span>
                <button onClick={handleCopyPortfolioLink} className="font-medium text-brand-400 hover:underline">Copy Link</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Calendar Export</h2>
        <p className="mt-1 text-sm text-ink-3">
          Download a .ics file of your assignment due dates, platform events, and (for BE/BCA) Weekend Contest windows — import it into Google/Apple/Outlook Calendar.
        </p>
        <button onClick={handleExportCalendar} disabled={exportingCalendar} className="btn-secondary mt-4">
          {exportingCalendar ? 'Exporting...' : 'Download Calendar (.ics)'}
        </button>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Your Data</h2>
        <p className="mt-1 text-sm text-ink-3">
          Download a complete copy of your account and activity data — profile, attempts, submissions, applications,
          messages, and everything else tied to your account — as a single JSON file.
        </p>
        <button onClick={handleExportData} disabled={exportingData} className="btn-secondary mt-4">
          {exportingData ? 'Preparing export...' : 'Download All My Data'}
        </button>
      </div>

      <form onSubmit={handlePasswordSubmit} className="card space-y-4 p-6">
        <div>
          <h2 className="font-semibold text-ink-1">Security</h2>
          <p className="mt-1 text-sm text-ink-3">Update your password regularly to keep your account secure.</p>
        </div>
        <FormInput
          id="currentPassword"
          name="currentPassword"
          type="password"
          label="Current Password"
          value={passwordForm.currentPassword}
          onChange={handlePasswordChange}
        />
        <FormInput
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          value={passwordForm.newPassword}
          onChange={handlePasswordChange}
        />
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          value={passwordForm.confirmPassword}
          onChange={handlePasswordChange}
        />
        <button type="submit" disabled={passwordSaving} className="btn-primary">
          {passwordSaving ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="card space-y-4 border-danger/20 p-6">
        <div>
          <h2 className="font-semibold text-danger">Delete Account</h2>
          <p className="mt-1 text-sm text-ink-3">
            This permanently deletes your account and all associated data. This cannot be undone.
          </p>
        </div>
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-ink-1 transition hover:brightness-90 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="btn-secondary border-danger/40 text-danger">
            Delete My Account
          </button>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-ink-1">Account</h2>
        <button onClick={() => dispatch(logout())} className="btn-secondary mt-4">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
