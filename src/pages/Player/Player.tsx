import React from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../router';

const Player = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();

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
