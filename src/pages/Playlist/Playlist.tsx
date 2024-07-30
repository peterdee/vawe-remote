import React from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../router';

const Playlist = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();

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
