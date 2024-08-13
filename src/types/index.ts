export interface PlaybackStatePayload {
  isMuted: boolean;
  isPlaying: boolean;
  volume: number;
}

export type Target = 'player' | 'remote' | 'server';

export interface SocketMessage<T = null> {
  payload: T;
  target: Target;
}

export interface SocketResponse<T = null> {
  error?: Error;
  event: string;
  payload?: T;
}

export interface Track {
  durationSeconds: number;
  id: string;
  isAccessible: boolean;
  name: string;
  path: string;
  withCover: boolean;
}
