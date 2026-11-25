import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import profileService from '../services/profileService';
import achievementsService from '../services/achievementsService';
import { updateStoredUser } from '../redux/slices/authSlice';
import FormInput from '../components/common/FormInput';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    profileService.getProfile().then((data) => setForm(data.profile));
    achievementsService.get().then((data) => setAchievements(data.achievements)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'skills' ? value : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        githubUsername: form.githubUsername,
        profileImage: form.profileImage,
        college: form.college,
        year: form.year,
        targetRole: form.targetRole,
        targetCompany: form.targetCompany,
        skills:
          typeof form.skills === 'string'
            ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : form.skills,
      };
      const data = await profileService.updateProfile(payload);
      setForm(data.profile);
      dispatch(updateStoredUser({ name: data.profile.name, profileImage: data.profile.profileImage }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingScreen label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-1">Your Profile</h1>
      <p className="mt-1 text-ink-2">Keep your details up to date for a personalized experience.</p>

      {achievements && (
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-3">Level {achievements.level} &middot; {achievements.title}</p>
              <p className="stat-figure mt-0.5 text-2xl font-bold text-ink-1">{achievements.points} pts</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
              <Icon name="trophy" className="h-6 w-6 text-gold" />
            </div>
          </div>

          {achievements.nextLevelPoints !== null && (
            <>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-card">
                <div
                  className="h-full bg-brand-600 transition-all"
                  style={{ width: `${achievements.progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-3">
                {achievements.nextLevelPoints - achievements.points} points to Level {achievements.level + 1}
              </p>
            </>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-1">Badges</h3>
              <span className="text-xs text-ink-3">{achievements.unlockedCount}/{achievements.totalBadges} unlocked</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {achievements.badges.map((b) => (
                <div
                  key={b.id}
                  title={b.description}
                  className={`rounded-xl border p-3 text-center transition ${
                    b.unlocked ? 'border-brand-500/40 bg-brand-600/10' : 'border-surface-border opacity-45'
                  }`}
                >
                  <Icon name="trophy" className={`mx-auto h-5 w-5 ${b.unlocked ? 'text-gold' : 'text-ink-3'}`} />
                  <p className="mt-1.5 text-xs font-medium text-ink-1">{b.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-ink-3">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        <div className="flex items-center gap-4">
          {form.profileImage ? (
            <img src={form.profileImage} alt={form.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-ink-1">
              {form.name?.[0]?.toUpperCase()}
            </div>
          )}
          <FormInput
            id="profileImage"
            name="profileImage"
            label="Photo URL"
            placeholder="https://..."
            value={form.profileImage || ''}
            onChange={handleChange}
            className="flex-1"
          />
        </div>

        <FormInput id="name" name="name" label="Name" value={form.name || ''} onChange={handleChange} />
        <FormInput id="email" label="Email" value={form.email || ''} disabled className="opacity-60" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput id="college" name="college" label="College" value={form.college || ''} onChange={handleChange} />
          <FormInput id="year" name="year" label="Year" value={form.year || ''} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput id="course" label="Course" value={form.course || ''} disabled className="opacity-60" />
          <FormInput id="branch" label="Branch" value={form.branch || ''} disabled className="opacity-60" />
        </div>

        <FormInput
          id="skills"
          name="skills"
          label="Skills (comma separated)"
          value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput id="targetRole" name="targetRole" label="Target Role" value={form.targetRole || ''} onChange={handleChange} />
          <FormInput id="targetCompany" name="targetCompany" label="Target Company" value={form.targetCompany || ''} onChange={handleChange} />
        </div>

        <FormInput
          id="githubUsername"
          name="githubUsername"
          label="GitHub Username"
          value={form.githubUsername || ''}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
