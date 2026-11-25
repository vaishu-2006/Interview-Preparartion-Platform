import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import practiceRoomService from '../services/practiceRoomService';
import Icon from '../components/icons/Icon';

// Real, user-hosted matchmaking board for the peer-to-peer WebRTC practice rooms — an honest
// alternative to a fabricated "AI group discussion" with fake participants. No audio/video ever
// touches the server; this page is only the discovery layer. Supports joining a room live right
// now, or booking a future slot together.
const PracticeRoomsPage = () => {
  const navigate = useNavigate();
  const [instant, setInstant] = useState(null);
  const [scheduled, setScheduled] = useState(null);
  const [myUpcoming, setMyUpcoming] = useState(null);
  const [topic, setTopic] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [hosting, setHosting] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  const refresh = () => {
    practiceRoomService.listOpenRooms().then((data) => {
      setInstant(data.instant);
      setScheduled(data.scheduled);
    });
    practiceRoomService.listMyUpcomingRooms().then((data) => setMyUpcoming(data.rooms));
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleHost = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setHosting(true);
    try {
      const data = await practiceRoomService.hostRoom(topic.trim(), scheduledFor || undefined);
      if (scheduledFor) {
        toast.success('Room scheduled — it will show up on the board for others to reserve.');
        setTopic('');
        setScheduledFor('');
        refresh();
      } else {
        navigate(`/practice-rooms/${data.room._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to host a room');
    } finally {
      setHosting(false);
    }
  };

  const handleJoin = async (roomId, isScheduled) => {
    setJoiningId(roomId);
    try {
      await practiceRoomService.joinRoom(roomId);
      if (isScheduled) {
        toast.success('Reserved! It will appear under "My Upcoming" — come back at the scheduled time.');
        refresh();
      } else {
        navigate(`/practice-rooms/${roomId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join room');
      refresh();
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Peer Practice Rooms</h1>
        <p className="mt-1 text-ink-3">
          Live 1:1 video practice with another student — real people, real webcam and mic, no AI standing in for a
          partner. Join a room right now, or book a slot for later.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-ink-1">Host a Room</h2>
        <form onSubmit={handleHost} className="mt-3 space-y-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to practice? e.g. HR round, DSA whiteboarding, System design"
            className="input-field"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              className="input-field flex-1"
            />
            <button type="submit" disabled={hosting || !topic.trim()} className="btn-primary shrink-0 px-5 text-sm">
              {hosting ? 'Creating...' : scheduledFor ? 'Schedule Room' : 'Host Now'}
            </button>
          </div>
          <p className="text-xs text-ink-3">Leave the date/time empty to open the room immediately — set one to book a future slot instead.</p>
        </form>
      </div>

      {myUpcoming?.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink-1">My Upcoming</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myUpcoming.map((room) => (
              <button
                key={room._id}
                onClick={() => navigate(`/practice-rooms/${room._id}`)}
                className="card flex items-center justify-between gap-3 p-5 text-left transition hover:border-brand-500/40"
              >
                <div>
                  <p className="font-medium text-ink-1">{room.topic}</p>
                  <p className="text-xs text-ink-3">
                    {new Date(room.scheduledFor).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    {room.status === 'reserved' ? ' · both spots filled' : ' · waiting for a partner'}
                  </p>
                </div>
                <Icon name="calendar" className="h-5 w-5 shrink-0 text-brand-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {scheduled?.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink-1">Starting Soon</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {scheduled.map((room) => (
              <div key={room._id} className="card flex items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                    <Icon name="calendar" className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-ink-1">{room.topic}</p>
                    <p className="text-xs text-ink-3">
                      Hosted by {room.hostName} &middot;{' '}
                      {new Date(room.scheduledFor).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleJoin(room._id, true)} disabled={joiningId === room._id} className="btn-secondary shrink-0 text-sm">
                  {joiningId === room._id ? 'Reserving...' : 'Reserve Spot'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">Open Now</h2>
        {!instant ? (
          <p className="text-sm text-ink-3">Loading...</p>
        ) : !instant.length ? (
          <div className="card p-6 text-sm text-ink-3">No one is hosting a room right now — be the first.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {instant.map((room) => (
              <div key={room._id} className="card flex items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
                    <Icon name="camera" className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium text-ink-1">{room.topic}</p>
                    <p className="text-xs text-ink-3">Hosted by {room.hostName}</p>
                  </div>
                </div>
                <button onClick={() => handleJoin(room._id, false)} disabled={joiningId === room._id} className="btn-secondary shrink-0 text-sm">
                  {joiningId === room._id ? 'Joining...' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeRoomsPage;
