import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';

const Playlist = React.memo((): React.JSX.Element => {
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
        Playlist
      </h2>
      <button
        onClick={() => navigate(routes.player)}
        type="button"
      >
        Go to Player
      </button>
    </div>
  );
});

export default Playlist;
