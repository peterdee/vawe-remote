export type Target = 'remote' | 'server';

export interface SocketMessage<T> {
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
