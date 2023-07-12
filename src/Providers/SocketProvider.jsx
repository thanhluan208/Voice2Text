import Peer from "peerjs";
import React, { useCallback, useEffect, useMemo } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = React.createContext({
  socket: Socket,
  peer: Peer,
  peerId: "",
  connectedPeer: "",
  handleConnectPeer: () => {},
});

export const useSocket = () => {
  return React.useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  //! State
  const [peerId, setPeerId] = React.useState("");
  const [connectedPeer, setConnectedPeer] = React.useState();

  const socket = useMemo(() => {
    return io("http://localhost:3001");
  }, []);

  const peer = useMemo(() => {
    return new Peer();
  }, []);

  const handleConnectPeer = useCallback(
    (peerId) => {
      const conn = peer.connect(peerId);
      setConnectedPeer(conn);
    },
    [peer]
  );

  //! Function
  useEffect(() => {
    peer.on("open", (id) => {
      console.log("peerid:", id);
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      console.log("connect to", conn.peer);
      conn.on("data", (data) => {
        console.log("data", data);
      });

      conn.send("hello");
    });
  }, [peer]);

  //! Render
  const value = useMemo(() => {
    return {
      socket,
      peer,
      peerId,
      connectedPeer,
      handleConnectPeer,
    };
  }, [socket, peer, peerId, connectedPeer, handleConnectPeer]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
