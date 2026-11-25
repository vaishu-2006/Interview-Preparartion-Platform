import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import discussionService from '../../services/discussionService';

// Flat, unthreaded doubt/discussion board scoped to one coding problem — not a full forum,
// just a place to ask "why does my approach fail on X" and see what others posted.
const DiscussionBoard = ({ slug }) => {
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const [comments, setComments] = useState(null);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setComments(null);
    discussionService.list(slug).then((data) => setComments(data.comments));
  }, [slug]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const data = await discussionService.create(slug, body);
      setComments((prev) => [data.comment, ...(prev || [])]);
      setBody('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
    try {
      await discussionService.remove(id);
    } catch {
      discussionService.list(slug).then((data) => setComments(data.comments));
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-ink-1">Discussion</h3>
      <p className="mt-1 text-xs text-ink-3">Stuck, or found an edge case? Ask or share here — visible to everyone on this problem.</p>

      <form onSubmit={handlePost} className="mt-4 flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Ask a question or share a tip..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
        />
        <button type="submit" disabled={posting || !body.trim()} className="btn-primary text-sm">
          {posting ? 'Posting...' : 'Post'}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {comments === null ? (
          <p className="text-sm text-ink-3">Loading discussion...</p>
        ) : !comments.length ? (
          <p className="text-sm text-ink-3">No comments yet — be the first to ask or share something.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="rounded-lg border border-surface-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ink-1">{c.userName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-3">{new Date(c.createdAt).toLocaleDateString()}</span>
                  {c.userId === currentUserId && (
                    <button onClick={() => handleDelete(c._id)} className="text-ink-3 hover:text-danger" aria-label="Delete comment">
                      &times;
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-ink-2">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionBoard;
