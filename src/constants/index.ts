import type * as types from '../types';

export const CURRENT_TARGET_TYPE: types.Target = 'remote';

export const DEFAULT_SERVER_ADDRESS = 'http://localhost:5077';

export const WS_EVENTS = {
  addTrack: 'ADD_TRACK',
  onTimeUpdate: 'ON_TIME_UPDATE',
  loadPlaylist: 'LOAD_PLAYLIST',
  removeTrack: 'REMOVE_TRACK',
  requestCurrentTrack: 'REQUEST_CURRENT_TRACK',
  requestPlaybackState: 'REQUEST_PLAYBACK_STATE',
  requestPlaylist: 'REQUEST_PLAYLIST',
  updatePlaybackState: 'UPDATE_PLAYBACK_STATE',
};
