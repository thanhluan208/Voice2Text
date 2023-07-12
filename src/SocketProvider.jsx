import React, { useMemo } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = React.createContext({
  socket: Socket,
});

export const useSocket = () => {
  return React.useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    return io("http://localhost:3001");
  }, []);


  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
