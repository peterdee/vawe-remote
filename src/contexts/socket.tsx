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
import { DEFAULT_TIMEOUT, WS_EVENTS } from '../constants';
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

      const changeCurrentTrackElapsedTimeHandler = (value: number) => {
        log('elapsed', value);
        dispatch(changeCurrentTrackElapsedTime(value));
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

        (async () => {
          try {
            const [currentTrackIdResponse]: [
              types.SocketResponse<string>,
            ] = await connection
              .timeout(DEFAULT_TIMEOUT)
              .emitWithAck(WS_EVENTS.requestCurrentTrack);
            const [playbackStateResponse]: [
              types.SocketResponse<types.PlaybackStatePayload>,
            ] = await connection
              .timeout(DEFAULT_TIMEOUT)
              .emitWithAck(WS_EVENTS.requestPlaybackState);
            const [tracklistResponse]: [
              types.SocketResponse<types.Track[]>,
            ] = await connection
              .timeout(DEFAULT_TIMEOUT)
              .emitWithAck(WS_EVENTS.requestTracklist);
            log(
              'received data',
              tracklistResponse,
              playbackStateResponse,
              currentTrackIdResponse,
            );
            if (currentTrackIdResponse.payload) {
              dispatch(changeCurrentTrack(currentTrackIdResponse.payload));
            }
            if (playbackStateResponse.payload) {
              dispatch(changeIsMuted(playbackStateResponse.payload.isMuted));
              dispatch(changeIsPlaying(playbackStateResponse.payload.isPlaying));
              dispatch(changeVolume(playbackStateResponse.payload.volume));
            }
            if (tracklistResponse.payload) {
              dispatch(loadPlaylist(tracklistResponse.payload));
            }
          } catch (error) {
            // TODO: error handling
            log('ack error', error);
          }
        })();
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
