import React, { useEffect } from "react";
import { useSocket } from "../../Providers/SocketProvider";
import { useNavigate } from "react-router-dom";

const Meeting = () => {
  //! State
  const { socket, peerId } = useSocket();
  const navigate = useNavigate();

  //! Function
  const handleJoin = () => {

    socket.emit("join-room", {
      roomId: "692b5632-2942-427e-a676-d5464bb5641c",
      peerId,
    });
  };
  const handleCreate = () => {
    socket.emit("create-room", {
      peerId,
    });
  };

  useEffect(() => {
    socket.on("room-connected", (roominfo) => {
      const { roomId } = roominfo;
      navigate(`/room/${roomId}`);
    });
  }, [socket, navigate]);

  //! Render
  return (
    <div>
      <button onClick={handleCreate}>Create room</button>
      <button onClick={handleJoin}>Join room</button>
    </div>
  );
};

export default Meeting;
