import Peer from "peerjs";
import React, { useEffect, useMemo } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = React.createContext({
  socket: Socket,
  peer: Peer,
  peerId: "",
});

export const useSocket = () => {
  return React.useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  //! State
  const [peerId, setPeerId] = React.useState("");

  const socket = useMemo(() => {
    return io("http://localhost:3001");
  }, []);

  const peer = useMemo(() => {
    return new Peer();
  }, []);

  //! Function
  useEffect(() => {
    peer.on("open", (id) => {
      console.log("peerid:", id);
      setPeerId(id);
    });
  }, [peer]);

  //! Render
  const value = useMemo(() => {
    return {
      socket,
      peer,
      peerId,
    };
  }, [socket, peer, peerId]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
