import React, {
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';
import type * as types from '../../types';

const Player = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();
  const { connection } = useContext(SocketContext);

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
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
        Player
      </h2>
      <button
        onClick={() => navigate(routes.playlist)}
        type="button"
      >
        Go to Playlist
      </button>
      { currentTrack && (
        <>
          <div>
            Current track:
          </div>
          <div>
            { currentTrack.name }
          </div>
        </>
      ) }
    </div>
  );
});

export default Player;
