import React, { useEffect, useState } from "react";
import { useSocket } from "../../Providers/SocketProvider";
import { useNavigate } from "react-router-dom";

const Meeting = () => {
  //! State
  const { socket, peerId } = useSocket();
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  //! Function
  const handleJoin = () => {
    socket.emit("join-room", {
      roomId: value,
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
      <input
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
      />
    </div>
  );
};

export default Meeting;
