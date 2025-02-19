import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'common-styles/styles.css';

import { persistor, store } from './store';
import router from './router';
import SocketProvider from './contexts/socket';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div className="f d-col wrap">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </div>,
);
