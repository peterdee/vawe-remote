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
import log from '../utilities/logger';
import type * as types from '../types';
import { WS_EVENTS } from '../constants';

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
  const [connection, setConnection] = useState<Socket | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  log('call SocketProvider');

  const storeConnection = (newConnection: Socket) => {
    setConnection(newConnection);
  };

  useEffect(
    () => {
      const addTrackHandler = (message: types.SocketMessage<types.Track>) => {
        dispatch(addTrack(message.payload));
      };

      const changeCurrentTrackHandler = (message: types.SocketMessage<string>) => {
        dispatch(changeCurrentTrack(message.payload));
      };

      const changeCurrentTrackElapsedTimeHandler = (message: types.SocketMessage<number>) => {
        dispatch(changeCurrentTrackElapsedTime(message.payload));
      };

      const changeIsMutedHandler = (message: types.SocketMessage<boolean>) => {
        dispatch(changeIsMuted(message.payload));
      };

      const changeIsPlayingHandler = (message: types.SocketMessage<boolean>) => {
        dispatch(changeIsPlaying(message.payload));
      };

      const changeVolumeHandler = (message: types.SocketMessage<number>) => {
        dispatch(changeVolume(message.payload));
      };

      const clearTracklistHandler = () => {
        dispatch(clearTracklist());
      };

      const loadPlaylistHandler = (message: types.SocketMessage<types.Track[]>) => {
        dispatch(loadPlaylist(message.payload));
      };

      const removeIdFromQueueHandler = (message: types.SocketMessage<string>) => {
        dispatch(removeIdFromQueue(message.payload));
      };
    
      const removeTrackHandler = (message: types.SocketMessage<string>) => {
        dispatch(removeTrack(message.payload));
      };

      const requestCurrentTrackHandler = (message: types.SocketMessage<string>) => {
        log('received current track', message);
        dispatch(changeCurrentTrack(message.payload));
      };

      const requestPlaybackStateHandler = (
        message: types.SocketMessage<types.PlaybackStatePayload>,
      ) => {
        log('received playback state', message);
        dispatch(
          changeCurrentTrackElapsedTime(message.payload.currentTrackElapsedTime),
        );
        dispatch(changeIsMuted(message.payload.isMuted));
        dispatch(changeIsPlaying(message.payload.isPlaying));
        dispatch(changeVolume(message.payload.volume));
      };

      const requestTracklistHandler = (message: types.SocketMessage<types.Track[]>) => {
        log('received tracklist', message);
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
        connection.on(WS_EVENTS.requestCurrentTrack, requestCurrentTrackHandler);
        connection.on(WS_EVENTS.requestPlaybackState, requestPlaybackStateHandler);
        connection.on(WS_EVENTS.requestTracklist, requestTracklistHandler);

        const message: types.SocketMessage = {
          payload: null,
          target: 'player',
        };
        connection.emit(WS_EVENTS.requestTracklist, message);
        // connection.emit(WS_EVENTS.requestCurrentTrack, message);
        connection.emit(WS_EVENTS.requestPlaybackState, message);
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
          connection.off(WS_EVENTS.requestCurrentTrack, requestCurrentTrackHandler);
          connection.off(WS_EVENTS.requestPlaybackState, requestPlaybackStateHandler);
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
