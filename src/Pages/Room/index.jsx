import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../Providers/SocketProvider";

const Room = () => {
  const { socket, handleConnectPeer, connectedPeer, peerId } = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const [users] = useState([]);

  const listenToUserJoin = useCallback(() => {
    socket.on("user-connected", (connectedPeerId) => {
      console.log("connect to ", connectedPeerId);
      handleConnectPeer(connectedPeerId);
    });
  }, [socket, handleConnectPeer, peerId]);

  const handleClick = () => {
    console.log("connect", connectedPeer);
    connectedPeer.send("hello");
  };

  useEffect(() => {
    listenToUserJoin();
  }, [socket, listenToUserJoin]);

  useEffect(() => {
    const { id } = params;
    if (!id) {
      navigate("/");
    }
  }, [params, navigate]);

  return (
    <div>
      <h1> Room: {params?.id}</h1>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => {
          return <li key={user}>{user}</li>;
        })}
      </ul>
      <button onClick={handleClick}>click</button>
    </div>
  );
};

export default Room;
