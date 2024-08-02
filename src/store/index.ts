import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';

import settings from './features/settings';
import tracklist from './features/tracklist';

const rootReducer = combineReducers({
  settings: persistReducer(
    {
      key: 'settings',
      storage,
    },
    settings,
  ),
  tracklist: persistReducer(
    {
      key: 'tracklist',
      storage: storageSession,
    },
    tracklist,
  ),
});

export const store = configureStore({
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        REHYDRATE,
      ],
    },
  }),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
