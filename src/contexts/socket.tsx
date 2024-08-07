import React, {
  createContext,
  useEffect,
  useState,
} from 'react';
import type { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';

import {
  addTrack,
  changeCurrentTrack,
  changeCurrentTrackElapsedTime,
  changeIsMuted,
  changeIsPlaying,
  changeVolume,
  clearTracklist,
  loadPlaylist,
  removeIdFromQueue,
  removeTrack,
} from '../store/features/tracklist';
import type { AppDispatch } from '../store';
import { CLIENT_TYPE, WS_EVENTS } from '../constants';
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
        if (payload.target === CLIENT_TYPE) {
          dispatch(addTrack(payload.payload));
        }
      };

      const changeCurrentTrackHandler = (payload: types.SocketMessage<string>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(changeCurrentTrack(payload.payload));
        }
      };

      const changeCurrentTrackElapsedTimeHandler = (payload: types.SocketMessage<number>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(changeCurrentTrackElapsedTime(payload.payload));
        }
      };

      const changeIsMutedHandler = (payload: types.SocketMessage<boolean>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(changeIsMuted(payload.payload));
        }
      };

      const changeIsPlayingHandler = (payload: types.SocketMessage<boolean>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(changeIsPlaying(payload.payload));
        }
      };

      const changeVolumeHandler = (payload: types.SocketMessage<number>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(changeVolume(payload.payload));
        }
      };

      const clearTracklistHandler = (payload: types.SocketMessage) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(clearTracklist());
        }
      };

      const loadPlaylistHandler = (payload: types.SocketMessage<types.Track[]>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(loadPlaylist(payload.payload));
        }
      };

      const removeIdFromQueueHandler = (payload: types.SocketMessage<string>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(removeIdFromQueue(payload.payload));
        }
      };
    
      const removeTrackHandler = (payload: types.SocketMessage<string>) => {
        if (payload.target === CLIENT_TYPE) {
          dispatch(removeTrack(payload.payload));
        }
      };

      const requestTracklistHandler = (message: types.SocketMessage<types.Track[]>) => {
        console.log('received tracklist', message);
        dispatch(loadPlaylist(message.payload));
      };

      if (connection && connection.connected) {
        log('register event listeners');
        connection.on(WS_EVENTS.addTrack, addTrackHandler);
        connection.on(WS_EVENTS.changeCurrentTrack, changeCurrentTrackHandler);
        connection.on(
          WS_EVENTS.changeCurrentTrackElapsedTime,
          changeCurrentTrackElapsedTimeHandler,
        );
        connection.on(WS_EVENTS.changeIsMuted, changeIsMutedHandler);
        connection.on(WS_EVENTS.changeIsPlaying, changeIsPlayingHandler);
        connection.on(WS_EVENTS.changeVolume, changeVolumeHandler);
        connection.on(WS_EVENTS.clearTracklist, clearTracklistHandler);
        connection.on(WS_EVENTS.loadPlaylist, loadPlaylistHandler);
        connection.on(WS_EVENTS.removeIdFromQueue, removeIdFromQueueHandler);
        connection.on(WS_EVENTS.removeTrack, removeTrackHandler);
        connection.on(WS_EVENTS.requestTracklist, requestTracklistHandler);

        // connection.emit(
        //   WS_EVENTS.requestCurrentTrack,
        //   (error: Error, response: types.SocketMessage<string>) => {
        //     if (error) {
        //       // TODO: error handling
        //       log('socket error', WS_EVENTS.requestCurrentTrack, error);
        //     } else {
        //       dispatch(changeCurrentTrack(response.payload));
        //     }
        //   },
        // );

        connection.emit(
          WS_EVENTS.requestPlaybackState,
          {
            target: 'player',
          } as types.SocketMessage,
          // (error: Error, response: types.SocketMessage<types.PlaybackStatePayload>) => {
          //   if (error) {
          //     // TODO: error handling
          //     log('socket error', WS_EVENTS.requestPlaybackState, error);
          //   } else {
          //     dispatch(
          //       changeCurrentTrackElapsedTime(response.payload.currentTrackElapsedTime),
          //     );
          //     dispatch(changeIsMuted(response.payload.isMuted));
          //     dispatch(changeIsPlaying(response.payload.isPlaying));
          //     dispatch(changeVolume(response.payload.volume));
          //   }
          // },
        );

        connection.emit(
          WS_EVENTS.requestTracklist,
          {
            target: 'player'
          } as types.SocketMessage,
        );
      }

      return () => {
        if (connection && connection.connected) {
          log('remove event listeners');
          connection.off(WS_EVENTS.addTrack, addTrackHandler);
          connection.off(WS_EVENTS.changeCurrentTrack, changeCurrentTrackHandler);
          connection.off(
            WS_EVENTS.changeCurrentTrackElapsedTime,
            changeCurrentTrackElapsedTimeHandler,
          );
          connection.off(WS_EVENTS.changeIsMuted, changeIsMutedHandler);
          connection.off(WS_EVENTS.changeIsPlaying, changeIsPlayingHandler);
          connection.off(WS_EVENTS.changeVolume, changeVolumeHandler);
          connection.off(WS_EVENTS.clearTracklist, clearTracklistHandler);
          connection.off(WS_EVENTS.loadPlaylist, loadPlaylistHandler);
          connection.off(WS_EVENTS.removeIdFromQueue, removeIdFromQueueHandler);
          connection.off(WS_EVENTS.removeTrack, removeTrackHandler);
          connection.off(WS_EVENTS.requestTracklist, requestTracklistHandler);
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
