export interface PlaybackStatePayload {
  currentTrackElapsedTime: number;
  isMuted: boolean;
  isPlaying: boolean;
  volume: number;
}

export type Target = 'remote' | 'server';

export interface SocketMessage<T = null> {
  payload: T;
  target: Target;
}

export interface Track {
  durationSeconds: number;
  id: string;
  isAccessible: boolean;
  name: string;
  path: string;
  withCover: boolean;
}
