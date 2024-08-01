import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'common-styles/styles.css';

import router from './router';
import { SocketProvider } from './contexts/socket';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="f d-col wrap">
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </div>
  </React.StrictMode>,
);
