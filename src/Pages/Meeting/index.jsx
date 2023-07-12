import React from "react";
import { useSocket } from "../../SocketProvider";
import { useNavigate } from "react-router-dom";

const Meeting = () => {
  //! State
  const { socket } = useSocket();
  const navigate = useNavigate();

  //! Function
  const handleJoin = () => {
    socket.emit("join-room", {
      roomId: "123",
      email: `luan${Math.random() * 200}@gmail.com`,
    });
  };
  const handleCreate = () => {};

  useEffect(() => {
    socket.on("joined-room", (roomId) => {
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
