import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_SERVER_ADDRESS } from '../../../constants';

export interface SettingsState {
  autoConnect: boolean;
  serverAddress: string;
}

const initialState: SettingsState = {
  autoConnect: false,
  serverAddress: DEFAULT_SERVER_ADDRESS,
};

export const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    changeAutoConnect: (state, action: PayloadAction<boolean>) => {
      state.autoConnect = action.payload;
    },
    changeServerAddress: (state, action: PayloadAction<string>) => {
      state.serverAddress = action.payload;
    },
  },
});

export const {
  changeAutoConnect,
  changeServerAddress,
} = settingsSlice.actions;

export default settingsSlice.reducer;
