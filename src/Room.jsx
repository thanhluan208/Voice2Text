import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import { useNavigate, useParams } from "react-router-dom";
import {cloneDeep} from 'lodash';

const Room = () => {
  const { socket } = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const listenToUserJoin = useCallback(() => {
    socket.on("user-connected", (email) => {
      setUsers((prev) => {
        const nextPrev = cloneDeep(prev)
        nextPrev.push(email);
        return nextPrev;
      });
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
