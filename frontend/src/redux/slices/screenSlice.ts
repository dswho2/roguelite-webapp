// frontend/src/redux/slices/screenSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ScreenState =
  | 'title'
  | 'town'
  | 'dungeonSelect'
  | 'dungeon'
  | 'victory'
  | 'gameOver';

const initialState: { current: ScreenState } = {
  current: 'title',
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<ScreenState>) {
      state.current = action.payload;
    },
  },
});

export const { setScreen } = screenSlice.actions;
export default screenSlice.reducer;
