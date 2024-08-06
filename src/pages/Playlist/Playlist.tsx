import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';
import type * as types from '../../types';
import './styles.css';

const Playlist = React.memo((): React.JSX.Element => {
  const { connection } = useContext(SocketContext);
  const navigate = useNavigate();

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const tracklist = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  useEffect(
    () => {
      if (!(connection && connection.connected)) {
        navigate(routes.main);
      }
    },
    [
      connection,
      navigate,
    ],
  );

  return (
    <div>
      <h2>
        Playlist
      </h2>
      <button
        onClick={() => navigate(routes.player)}
        type="button"
      >
        Go to Player
      </button>
      { tracklist.length === 0 && (
        <div className="f">
          Playlist is empty
        </div>
      ) }
      { tracklist.length > 0 && tracklist.map((track: types.Track): React.JSX.Element => (
        <div
          className={`f ${currentTrack && currentTrack.id === track.id
            ? 'highlight'
            : ''}`}
          key={track.id}
        >
          { track.name }
        </div>
      )) }
    </div>
  );
});

export default Playlist;
