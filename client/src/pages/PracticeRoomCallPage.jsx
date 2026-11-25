import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import practiceRoomService from '../services/practiceRoomService';
import useWebRTCRoom from '../hooks/useWebRTCRoom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';

// A small, honest set of shared discussion prompts — not scored, not AI-generated, just a
// structure for two real people to use during the call. Shuffled client-side only.
const PROMPTS = [
  'Walk each other through a project you\'re proud of, then ask one follow-up question about it.',
  'Take turns explaining a DSA topic (e.g. recursion, hashing, graphs) as if teaching a beginner.',
  'One of you plays interviewer for 5 minutes with a behavioral question, then swap roles.',
  'Whiteboard a system design problem together, e.g. "design a URL shortener".',
  'Practice a 60-second self-introduction on each other, then give one piece of feedback.',
  'Discuss a recent tech topic or current affair and its practical implications.',
  'Take turns giving a mock HR answer to "why should we hire you?" and critique each other.',
  'Pick a coding problem from the platform and talk through your approach out loud before writing any code.',
];

const PracticeRoomCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(undefined); // undefined = loading, null = not found
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    practiceRoomService
      .getRoom(roomId)
      .then((data) => setRoom(data.room))
      .catch(() => setRoom(null));
  }, [roomId]);

  const { mediaError, peerJoined, roomFull, micOn, camOn, localVideoRef, remoteVideoRef, toggleMic, toggleCam } = useWebRTCRoom(
    room?.roomCode
  );

  const isHost = room && user && String(room.hostId) === String(user.id);

  const handleLeave = async () => {
    try {
      if (isHost) await practiceRoomService.closeRoom(roomId);
    } catch {
      // ignore — leaving shouldn't be blocked by a failed close call
    } finally {
      navigate('/practice-rooms');
    }
  };

  if (room === undefined) return <LoadingScreen label="Loading room..." />;
  if (!room) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-ink-2">This room no longer exists.</p>
        <button onClick={() => navigate('/practice-rooms')} className="btn-secondary mt-4">Back to Practice Rooms</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={handleLeave} className="text-sm text-ink-3 hover:text-ink-1">&larr; Leave Room</button>
          <h1 className="mt-2 text-xl font-bold text-ink-1">{room.topic}</h1>
          <p className="text-sm text-ink-3">
            Hosted by {room.hostName}
            {room.scheduledFor ? ` · scheduled for ${new Date(room.scheduledFor).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}` : ''}
          </p>
        </div>
        <button onClick={handleLeave} className="btn-secondary border-danger/40 text-danger text-sm">Leave</button>
      </div>

      {roomFull ? (
        <div className="card p-8 text-center text-sm text-danger">This room already has two people in it.</div>
      ) : mediaError ? (
        <div className="card p-8 text-center text-sm text-danger">{mediaError}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card relative overflow-hidden p-0">
              <video ref={localVideoRef} autoPlay muted playsInline className="aspect-video w-full bg-surface object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">You</span>
            </div>
            <div className="card relative overflow-hidden p-0">
              {peerJoined ? (
                <video ref={remoteVideoRef} autoPlay playsInline className="aspect-video w-full bg-surface object-cover" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-surface text-sm text-ink-3">
                  Waiting for the other person to join...
                </div>
              )}
              {peerJoined && <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">Peer</span>}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={toggleMic} className={`btn-secondary text-sm ${!micOn ? 'border-danger/40 text-danger' : ''}`}>
              <Icon name="mic" className="mr-1.5 inline h-4 w-4" /> {micOn ? 'Mute' : 'Unmute'}
            </button>
            <button onClick={toggleCam} className={`btn-secondary text-sm ${!camOn ? 'border-danger/40 text-danger' : ''}`}>
              <Icon name="camera" className="mr-1.5 inline h-4 w-4" /> {camOn ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-1">Discussion Prompt</h3>
              <button onClick={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)} className="btn-secondary text-xs">
                Next Prompt
              </button>
            </div>
            <p className="mt-3 text-sm text-ink-2">{PROMPTS[promptIndex]}</p>
            <p className="mt-3 text-xs text-ink-3">Just a shared starting point — not scored or recorded, use it however's useful.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PracticeRoomCallPage;
