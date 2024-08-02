import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import type { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';

import {
  addTrack,
  removeTrack,
} from '../store/features/tracklist';
import type { AppDispatch } from '../store';
import { CURRENT_TARGET_TYPE, WS_EVENTS } from '../constants';
import log from '../utilities/logger';
import type * as types from '../types';

interface SocketContextData {
  connection: Socket | null;
  storeConnection: ((value: Socket) => void) | null;
}

const defaultContextValue: SocketContextData = {
  connection: null,
  storeConnection: null,
};

export const SocketContext = createContext(defaultContextValue);

const SocketProvider = (props: React.PropsWithChildren): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [connection, setConnection] = useState<Socket | null>(null);

  const storeConnection = (newConnection: Socket) => {
    setConnection(newConnection);
  };

  useEffect(
    () => {
      const addTrackHandler = (payload: types.SocketMessage<types.Track>) => {
        if (payload.target === CURRENT_TARGET_TYPE) {
          dispatch(addTrack(payload.payload));
        }
      };
    
      const removeTrackHandler = (payload: types.SocketMessage<string>) => {
        if (payload.target === CURRENT_TARGET_TYPE) {
          dispatch(removeTrack(payload.payload));
        }
      };

      if (connection && connection.connected) {
        log('register event listeners');
        connection.on(WS_EVENTS.addTrack, addTrackHandler);
        connection.on(WS_EVENTS.removeTrack, removeTrackHandler);
      }

      return () => {
        if (connection && connection.connected) {
          log('remove event listeners');
          connection.off(WS_EVENTS.addTrack, addTrackHandler);
          connection.off(WS_EVENTS.removeTrack, removeTrackHandler);
        }
      }
    },
    [
      connection,
      dispatch,
    ],
  );

  return (
    <SocketContext.Provider value={{ connection, storeConnection }}>
      { props.children }
    </SocketContext.Provider>
  );
};

export default SocketProvider;
