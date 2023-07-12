import React, { useState, useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import ReactAudioPlayer from "react-audio-player";

const socket = io("http://localhost:5000"); // Replace with your backend server URL

const MeetingApp = () => {
  const [recording, setRecording] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState([]);
  const [audioChunks, setAudioChunks] = useState([]); // Audio chunks received from the backend

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  const peer = useMemo(() => {
    return new Peer();
  }, []); // Create a new Peer instance

  useEffect(() => {
    // Setup Socket.IO event listeners
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Event listener for receiving meeting notes from the backend
    socket.on("meetingNotes", (notes) => {
      console.log("getting notes: ", notes);
      // Mocking received notes (replace this with actual backend data)
      setMeetingNotes((prev) => {
        return [...prev, notes];
      });
    });

    // Event listener for PeerJS connections
    peer.on("open", (peerId) => {
      console.log("PeerJS: My peer ID is " + peerId);
      // Here, you can send the peerId to the backend to identify the participant
    });

    // Event listener for incoming PeerJS calls (audio streams)
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with our audio stream
          call.on("stream", (remoteStream) => {
            // Handle the incoming audio stream from the remote participant
            // You can use this stream to play audio on the frontend or process it further
          });
        })
        .catch((error) => console.error("Error accessing microphone:", error));
    });

    return () => {
      peer.destroy(); // Clean up PeerJS instance on component unmount
    };
  }, [peer]);

  const startRecording = () => {
    socket.emit("startMeeting", "meeting started");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream);

        console.log(mediaRecorderRef.current);

        mediaRecorderRef.current.ondataavailable = (event) => {
          console.log("event", event);
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          // Send audio chunks to the backend
          console.log("time", new Date().valueOf());
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioChunks((prev) => [...prev, audioBlob]);
          console.log("audioBlob", audioBlob);
          socket.emit("audioChunk", audioBlob);

          // Clear chunks for the next recording
          chunksRef.current = [];
        };

        mediaRecorderRef.current.start();

        // Set up the interval to send audio chunks every 5 seconds
        intervalRef.current = setInterval(() => {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }, 5000);

        // Call other participants using PeerJS
        callOtherParticipants(stream);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const callOtherParticipants = (stream) => {
    // Function to call other participants and send our audio stream
    // Get the list of participant Peer IDs from the backend (not shown in this example)
    const participantIds = []; // Replace this with the actual list of participant Peer IDs
    participantIds.forEach((participantId) => {
      const call = peer.call(participantId, stream); // Call each participant with our audio stream
      call.on("stream", (remoteStream) => {
        // Handle the incoming audio stream from each remote participant (optional)
      });
    });
  };

  const stopRecording = () => {
    socket.emit("endMeeting", "meeting ended");
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Clear the interval when recording stops
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      <h1>Meeting App</h1>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>

      <h2>Meeting Notes:</h2>
      <ul>
        {meetingNotes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>

      {audioChunks.map((elm, index) => {
        return (
          <ReactAudioPlayer
            src={URL.createObjectURL(elm)}
            controls
            key={index}
          />
        );
      })}
    </div>
  );
};

export default MeetingApp;
