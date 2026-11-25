import { useCallback, useEffect, useRef, useState } from 'react';
import getSocket from '../services/socket';

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// Minimal 1:1 WebRTC video call over the app's own Socket.IO signaling relay — no third-party
// call service, no server-side recording or storage of audio/video. Whoever joins the room
// SECOND is the "initiator" (creates the offer); the first person's peer connection is already
// up and waiting for it.
const useWebRTCRoom = (roomCode) => {
  const [mediaError, setMediaError] = useState(null);
  const [peerJoined, setPeerJoined] = useState(false);
  const [roomFull, setRoomFull] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const socket = getSocket();

    const createPeerConnection = (isInitiator) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit('signal', { candidate: e.candidate });
      };
      pc.ontrack = (e) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        setPeerJoined(true);
      };

      if (isInitiator) {
        pc.onnegotiationneeded = async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('signal', { sdp: pc.localDescription });
          } catch {
            // ignored — a failed renegotiation just means no offer goes out this round
          }
        };
      }
    };

    const handleJoined = ({ isInitiator }) => createPeerConnection(isInitiator);
    const handleRoomFull = () => setRoomFull(true);
    const handlePeerJoined = () => setPeerJoined(true);
    const handlePeerLeft = () => {
      setPeerJoined(false);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };
    const handleSignal = async (payload) => {
      const pc = pcRef.current;
      if (!pc) return;
      if (payload.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        if (payload.sdp.type === 'offer') {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('signal', { sdp: pc.localDescription });
        }
      } else if (payload.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch {
          // ignored — a stray/late candidate isn't fatal to the call
        }
      }
    };

    socket.on('joined', handleJoined);
    socket.on('room-full', handleRoomFull);
    socket.on('peer-joined', handlePeerJoined);
    socket.on('peer-left', handlePeerLeft);
    socket.on('signal', handleSignal);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!isMounted) return;
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit('join-room', { roomCode });
      })
      .catch(() => setMediaError('Camera/microphone access is required for a practice room.'));

    return () => {
      isMounted = false;
      socket.off('joined', handleJoined);
      socket.off('room-full', handleRoomFull);
      socket.off('peer-joined', handlePeerJoined);
      socket.off('peer-left', handlePeerLeft);
      socket.off('signal', handleSignal);
      socket.emit('leave-room');
      pcRef.current?.close();
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomCode]);

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  }, []);

  const toggleCam = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  }, []);

  return { mediaError, peerJoined, roomFull, micOn, camOn, localVideoRef, remoteVideoRef, toggleMic, toggleCam };
};

export default useWebRTCRoom;
