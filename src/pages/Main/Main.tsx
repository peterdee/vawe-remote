import React from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../router';

const Main = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>
        Main
      </h2>
      <button
        onClick={() => navigate(routes.player)}
        type="button"
      >
        Go to Player
      </button>
      <button
        onClick={() => navigate(routes.playlist)}
        type="button"
      >
        Go to Playlist
      </button>
    </div>
  );
});

export default Main;
