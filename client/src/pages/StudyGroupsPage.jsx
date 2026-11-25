import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import studyGroupService from '../services/studyGroupService';
import useAuth from '../hooks/useAuth';
import Icon from '../components/icons/Icon';

const StudyGroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const load = () => studyGroupService.list().then((data) => setGroups(data.groups));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      await studyGroupService.create(form);
      setForm({ name: '', description: '' });
      load();
      toast.success('Study group created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await studyGroupService.join(groupId);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join group');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Study Groups</h1>
        <p className="mt-1 text-ink-3">Create or join a group to study together — real discussion threads, not a live call.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-ink-1">Start a New Group</h2>
        <form onSubmit={handleCreate} className="mt-4 flex flex-wrap gap-3">
          <input
            className="input-field flex-1"
            placeholder="Group name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="input-field flex-1"
            placeholder="What's this group about? (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!groups ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : !groups.length ? (
          <p className="text-sm text-ink-3">No study groups yet — start the first one above.</p>
        ) : (
          groups.map((g) => {
            const isMember = g.members.includes(user?.id);
            return (
              <div key={g._id} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
                    <Icon name="chat" className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-1">{g.name}</h3>
                    <p className="text-xs text-ink-3">{g.members.length} member{g.members.length === 1 ? '' : 's'}</p>
                  </div>
                </div>
                {g.description && <p className="mt-3 text-sm text-ink-2">{g.description}</p>}
                <div className="mt-4">
                  {isMember ? (
                    <Link to={`/study-groups/${g._id}`} className="btn-secondary text-sm">Open Group</Link>
                  ) : (
                    <button onClick={() => handleJoin(g._id)} className="btn-primary text-sm">Join Group</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudyGroupsPage;
