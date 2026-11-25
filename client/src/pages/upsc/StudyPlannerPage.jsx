import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import studyPlannerService from '../../services/studyPlannerService';
import bookmarkService from '../../services/bookmarkService';
import Icon from '../../components/icons/Icon';

const StudyPlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', dueDate: '', notes: '' });
  const [adding, setAdding] = useState(false);

  const load = () =>
    Promise.all([studyPlannerService.list(), bookmarkService.list()]).then(([taskData, bookmarkData]) => {
      setTasks(taskData.tasks);
      setBookmarks(bookmarkData.bookmarks);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Give the task a title');
      return;
    }
    setAdding(true);
    try {
      await studyPlannerService.create(form);
      setForm({ title: '', dueDate: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleDone = async (task) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, done: !t.done } : t)));
    try {
      await studyPlannerService.update(task._id, { done: !task.done });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      load();
    }
  };

  const handleDeleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await studyPlannerService.remove(id);
    } catch {
      load();
    }
  };

  const handleRemoveBookmark = async (id) => {
    setBookmarks((prev) => prev.filter((b) => b._id !== id));
    try {
      await bookmarkService.remove(id);
    } catch {
      load();
    }
  };

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Study Planner</h1>
        <p className="mt-1 text-ink-3">Your personal revision to-do list, plus every resource link you've bookmarked across the platform.</p>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Add a Task</h2>
        <div className="card p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              className="input-field sm:col-span-2"
              placeholder="e.g. Revise Polity — Fundamental Rights"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
            <button type="submit" disabled={adding} className="btn-primary">
              {adding ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Your Tasks</h2>
        {loading ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : !tasks.length ? (
          <p className="text-sm text-ink-3">No tasks yet — add your first revision goal above.</p>
        ) : (
          <div className="space-y-2">
            {[...pending, ...done].map((task) => (
              <div key={task._id} className="card flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleDone(task)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      task.done ? 'border-brand-500 bg-brand-600 text-white' : 'border-surface-border text-transparent'
                    }`}
                    aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
                  >
                    <Icon name="checkCircle" className="h-4 w-4" />
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${task.done ? 'text-ink-3 line-through' : 'text-ink-1'}`}>{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-ink-3">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDeleteTask(task._id)} className="text-ink-3 hover:text-danger" aria-label="Delete task">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Bookmarked Resources</h2>
        {!bookmarks.length ? (
          <p className="text-sm text-ink-3">
            No bookmarks yet — save links from Study Materials, Previous Papers, or Current Affairs and they'll show up here.
          </p>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <div key={b._id} className="card flex items-center justify-between gap-3 p-4">
                <div>
                  <a href={b.href} target="_blank" rel="noreferrer" className="text-sm font-medium text-ink-1 hover:text-brand-400">
                    {b.label}
                  </a>
                  {b.category && <p className="mt-0.5 text-xs text-ink-3">{b.category}</p>}
                </div>
                <button onClick={() => handleRemoveBookmark(b._id)} className="text-ink-3 hover:text-danger" aria-label="Remove bookmark">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlannerPage;
