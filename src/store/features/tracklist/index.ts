import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type * as types from '../../../types';

export interface TracklistState {
  currentTrack: types.Track | null;
  currentTrackElapsedTime: number;
  isMuted: boolean;
  isPlaying: boolean;
  queue: string[];
  tracks: types.Track[];
  volume: number;
}

const initialState: TracklistState = {
  currentTrack: null,
  currentTrackElapsedTime: 0,
  isMuted: false,
  isPlaying: false,
  queue: [],
  tracks: [],
  volume: 0,
};

export const tracklistSlice = createSlice({
  initialState,
  name: 'tracklist',
  reducers: {
    addTrack: (state, action: PayloadAction<types.Track>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    changeCurrentTrack: (state, action: PayloadAction<string>) => {
      const [track] = state.tracks.filter(
        (item: types.Track): boolean => item.id === action.payload,
      );
      state.currentTrack = track;
      state.currentTrackElapsedTime = 0;
    },
    changeCurrentTrackElapsedTime: (state, action: PayloadAction<number>) => {
      state.currentTrackElapsedTime = action.payload;
    },
    changeIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    changeIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    changeVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    clearTracklist: (state) => {
      state.currentTrack = initialState.currentTrack;
      state.currentTrackElapsedTime = 0;
      state.isPlaying = false;
      state.queue = initialState.queue;
      state.tracks = initialState.tracks;
    },
    loadPlaylist: (state, action: PayloadAction<types.Track[]>) => {
      state.tracks = action.payload;
    },
    removeIdFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((id: string): boolean => id !== action.payload);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      if (state.currentTrack && state.currentTrack.id === action.payload) {
        state.currentTrack = initialState.currentTrack;
        state.currentTrackElapsedTime = 0;
      }
      state.queue = state.queue.filter(
        (id: string): boolean => id !== action.payload, 
      );
      state.tracks = state.tracks.filter(
        (track: types.Track): boolean => track.id !== action.payload,
      );
    },
  },
});

export const {
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
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
