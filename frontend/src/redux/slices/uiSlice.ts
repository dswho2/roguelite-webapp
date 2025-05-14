// frontend/src/redux/slices/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    isInventoryOpen: boolean;
    isStatsOpen: boolean;
    isPauseMenuOpen: boolean;
    activeModal: 'levelUp' | 'confirmExit' | null;
    messageLog: string[];
    selectedDungeon: string | null;
}

const initialState: UIState = {
  isInventoryOpen: false,
  isStatsOpen: false,
  isPauseMenuOpen: false,
  activeModal: null,
  messageLog: [],
  selectedDungeon: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleInventory(state) {
      state.isInventoryOpen = !state.isInventoryOpen;
    },
    toggleStats(state) {
      state.isStatsOpen = !state.isStatsOpen;
    },
    togglePauseMenu(state) {
      state.isPauseMenuOpen = !state.isPauseMenuOpen;
    },
    setActiveModal(state, action: PayloadAction<UIState['activeModal']>) {
      state.activeModal = action.payload;
    },
    logMessage(state, action: PayloadAction<string>) {
      state.messageLog.push(action.payload);
    },
    selectDungeon(state, action: PayloadAction<string>) {
      state.selectedDungeon = action.payload;
    },
  },
});

export const {
  toggleInventory,
  toggleStats,
  togglePauseMenu,
  setActiveModal,
  logMessage,
  selectDungeon,
} = uiSlice.actions;
export default uiSlice.reducer;