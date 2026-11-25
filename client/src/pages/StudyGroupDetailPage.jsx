import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import studyGroupService from '../services/studyGroupService';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';
import useAuth from '../hooks/useAuth';

const StudyGroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState(null);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const bottomRef = useRef(null);

  const load = () =>
    studyGroupService
      .list()
      .then((data) => setGroup(data.groups.find((g) => g._id === groupId)))
      .then(() => studyGroupService.listMessages(groupId))
      .then((data) => setMessages(data.messages))
      .catch(() => {
        toast.error('Join this group to view its messages');
        navigate('/study-groups');
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      const data = await studyGroupService.postMessage(groupId, body);
      setMessages((prev) => [...(prev || []), data.chatMessage]);
      setBody('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setPosting(false);
    }
  };

  const handleLeave = async () => {
    try {
      await studyGroupService.leave(groupId);
      navigate('/study-groups');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave group');
    }
  };

  if (!group || !messages) return <LoadingScreen label="Loading study group..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/study-groups" className="text-sm text-ink-3 hover:text-ink-1">&larr; All Study Groups</Link>

      <div className="card flex items-center justify-between p-5">
        <div>
          <h1 className="text-lg font-bold text-ink-1">{group.name}</h1>
          <p className="text-xs text-ink-3">{group.members.length} member{group.members.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={handleLeave} className="btn-secondary border-danger/40 text-xs text-danger">Leave Group</button>
      </div>

      <div className="card flex h-[55vh] flex-col p-4">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {!messages.length ? (
            <p className="p-4 text-center text-sm text-ink-3">No messages yet — say hello.</p>
          ) : (
            messages.map((m) => (
              <div key={m._id} className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${m.userId === user?.id ? 'ml-auto bg-brand-600/15' : 'bg-surface'}`}>
                {m.userId !== user?.id && <p className="text-[11px] font-semibold text-ink-3">{m.userName}</p>}
                <p className="text-sm text-ink-1">{m.body}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handlePost} className="mt-3 flex gap-2 border-t border-surface-border pt-3">
          <input
            className="input-field flex-1"
            placeholder="Message the group..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
          />
          <button type="submit" disabled={posting || !body.trim()} className="btn-primary">
            <Icon name="pen" className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyGroupDetailPage;
