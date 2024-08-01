import { createContext, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface SocketContextData {
  connection: Socket | null;
  storeConnection: ((value: Socket) => void) | null;
}

const defaultContextValue: SocketContextData = {
  connection: null,
  storeConnection: null,
}

export const SocketContext = createContext(defaultContextValue);

export const SocketProvider = (props: React.PropsWithChildren) => {
  const [connection, setConnection] = useState<Socket | null>(null);

  const storeConnection = (newConnection: Socket) => {
    setConnection(newConnection);
  };

  return (
    <SocketContext.Provider value={{ connection, storeConnection } as SocketContextData}>
      { props.children }
    </SocketContext.Provider>
  );
};
