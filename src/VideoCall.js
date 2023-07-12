import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your backend server URL

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    // Get access to the user's camera and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display the local video stream in the local video element
        localVideoRef.current.srcObject = stream;

        // Send the offer to the signaling server
        const peerConnection = new RTCPeerConnection();
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        peerConnection.createOffer().then((offer) => {
          peerConnection.setLocalDescription(offer);
          socket.emit('offer', { roomId, offer });
        });

        // Receive remote stream and display it in the remote video element
        peerConnection.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Handle incoming offers, answers, and ICE candidates
        socket.on('offer', (data) => {
          if (data.roomId === roomId) {
            peerConnection.setRemoteDescription(data.offer);
            peerConnection.createAnswer().then((answer) => {
              peerConnection.setLocalDescription(answer);
              socket.emit('answer', { roomId, answer });
            });
          }
        });

        socket.on('answer', (data) => {
          if (data.roomId === roomId) {
            peerConnection.setRemoteDescription(data.answer);
          }
        });

        socket.on('ice-candidate', (data) => {
          if (data.roomId === roomId) {
            peerConnection.addIceCandidate(data.candidate);
          }
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId(); // You can implement your own logic to generate a unique room ID
    socket.emit('create-room', newRoomId);
    setRoomId(newRoomId);
    setJoinedRoom(true);
  };

  const handleJoinRoom = () => {
    socket.emit('join-room', roomId);
    setJoinedRoom(true);
  };

  const generateRoomId = () => {
    // Generate a random room ID
    return Math.random().toString(36).substring(7);
  };

  return (
    <div>
      {!joinedRoom ? (
        <div>
          <h1>Create or Join a Room</h1>
          <button onClick={handleCreateRoom}>Create Room</button>
          <div>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <button onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Video Call</h1>
          <h2>Room id: {roomId}</h2>
          <video ref={localVideoRef} autoPlay playsInline muted />
          <video ref={remoteVideoRef} autoPlay playsInline />
        </div>
      )}
    </div>
  );
};

export default VideoCall;
