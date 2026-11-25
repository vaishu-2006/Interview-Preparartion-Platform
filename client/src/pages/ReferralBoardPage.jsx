import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import referralService from '../services/referralService';
import useAuth from '../hooks/useAuth';
import Icon from '../components/icons/Icon';

const EMPTY_FORM = { type: 'offering', company: '', role: '', message: '', contact: '' };

// A real board where students post their own genuine offers/requests — not a scraped or
// fabricated listings database. Contact info is whatever the poster chooses to share.
const ReferralBoardPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState('all'); // all | offering | seeking

  const load = () => referralService.list().then((data) => setPosts(data.posts));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await referralService.create(form);
      setForm(EMPTY_FORM);
      load();
      toast.success('Posted to the referral board');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await referralService.remove(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove post');
    }
  };

  const filtered = posts?.filter((p) => filter === 'all' || p.type === filter) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Referral Board</h1>
        <p className="mt-1 text-ink-3">
          Real posts from real students — offering a referral at your company, or looking for one. Share contact info only if
          you're comfortable with it being public.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-ink-1">Post to the Board</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="flex gap-2">
            {['offering', 'seeking'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
                  form.type === t ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {t === 'offering' ? 'I can refer' : 'Looking for a referral'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="input-field"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Role (optional)"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </div>
          <textarea
            className="input-field min-h-[80px] resize-y"
            placeholder="Message — a few lines about the opportunity or what you're looking for"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="Contact (optional — email, LinkedIn, etc.)"
            value={form.contact}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          />
          <button type="submit" disabled={posting} className="btn-primary">
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      <div className="flex gap-2">
        {['all', 'offering', 'seeking'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
              filter === f ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
            }`}
          >
            {f === 'all' ? 'All' : f === 'offering' ? 'Offering' : 'Seeking'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {!posts ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : !filtered.length ? (
          <p className="text-sm text-ink-3">No posts yet — be the first.</p>
        ) : (
          filtered.map((post) => (
            <div key={post._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${post.type === 'offering' ? 'bg-brand-600/15 text-brand-400' : 'bg-gold/15 text-gold'}`}>
                    {post.type === 'offering' ? 'Offering' : 'Seeking'}
                  </span>
                  <p className="font-medium text-ink-1">{post.company}{post.role ? ` — ${post.role}` : ''}</p>
                </div>
                {post.userId === user?.id && (
                  <button onClick={() => handleDelete(post._id)} className="text-ink-3 hover:text-danger" aria-label="Delete post">
                    &times;
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-2">{post.message}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-ink-3">
                <span className="flex items-center gap-1"><Icon name="user" className="h-3.5 w-3.5" /> {post.userName}</span>
                {post.contact && <span>&middot; {post.contact}</span>}
                <span>&middot; {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReferralBoardPage;
