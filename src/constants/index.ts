import type * as types from '../types';

export const CLIENT_TYPE: types.Target = 'remote';

export const DEFAULT_SERVER_ADDRESS = 'http://localhost:5077';

export const DEFAULT_TIMEOUT = 5000;

export const WS_EVENTS = {
  addTrack: 'ADD_TRACK',
  changeCurrentTrack: 'CHANGE_CURRENT_TRACK',
  changeCurrentTrackElapsedTime: 'CHANGE_CURRENT_TRACK_ELAPSED_TIME',
  changeIsMuted: 'CHANGE_IS_MUTED',
  changeIsPlaying: 'CHANGE_IS_PLAYING',
  changeVolume: 'CHANGE_VOLUME',
  clearTracklist: 'CLEAR_TRACKLIST',
  connectClient: 'connect',
  loadPlaylist: 'LOAD_PLAYLIST',
  removeIdFromQueue: 'REMOVE_ID_FROM_QUEUE',
  removeTrack: 'REMOVE_TRACK',
  requestCurrentTrack: 'REQUEST_CURRENT_TRACK',
  requestPlaybackState: 'REQUEST_PLAYBACK_STATE',
  requestTracklist: 'REQUEST_TRACKLIST',
};
