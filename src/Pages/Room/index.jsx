import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../Providers/SocketProvider";

const Room = () => {
  const { socket, peer } = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const [users] = useState([]);

  const listenToUserJoin = useCallback(() => {
    socket.on("user-connected", (info) => {
      console.log("info", info);
    });
  }, [socket]);

  console.log(users);

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
    </div>
  );
};

export default Room;
