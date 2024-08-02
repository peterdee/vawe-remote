import React, {
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';

const Player = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();
  const { connection } = useContext(SocketContext);

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
    </div>
  );
});

export default Player;
