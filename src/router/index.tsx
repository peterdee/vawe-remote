import { createBrowserRouter } from 'react-router-dom';

import Main from '../pages/Main';
import Player from '../pages/Player';
import Playlist from '../pages/Playlist';

export const routes = {
  main: '/',
  player: '/player',
  playlist: '/playlist',
}

const router = createBrowserRouter([
  {
    element: <Main />,
    path: routes.main,
  },
  {
    element: <Player />,
    path: routes.player,
  },
  {
    element: <Playlist />,
    path: routes.playlist,
  },
]);

export default router;
