// frontend/src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import screenReducer from './slices/screenSlice';
import playerReducer from './slices/playerSlice';
import dungeonReducer from './slices/dungeonSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    player: playerReducer,
    dungeon: dungeonReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
