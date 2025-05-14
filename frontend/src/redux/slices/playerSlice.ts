// frontend/src/redux/slices/playerSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Stats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  luck: number;
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  description?: string;
}

interface PlayerState {
  stats: Stats;
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    accessories: Item[];
  };
  inventory: Item[];
  gold: number;
  exp: number;
  level: number;
  moves: string[];
  upgrades: string[];
}

const initialState: PlayerState = {
  stats: {
    hp: 100,
    maxHp: 100,
    atk: 10,
    def: 5,
    spd: 3,
    luck: 2,
  },
  equipment: {
    weapon: null,
    armor: null,
    accessories: [],
  },
  inventory: [],
  gold: 0,
  exp: 0,
  level: 1,
  moves: [],
  upgrades: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateStats(state, action: PayloadAction<Partial<Stats>>) {
      state.stats = { ...state.stats, ...action.payload };
    },
    gainGold(state, action: PayloadAction<number>) {
      state.gold += action.payload;
    },
    addItemToInventory(state, action: PayloadAction<Item>) {
      state.inventory.push(action.payload);
    },
    equipItem(state, action: PayloadAction<Item>) {
      const item = action.payload;
      if (item.type === 'weapon') state.equipment.weapon = item;
      else if (item.type === 'armor') state.equipment.armor = item;
      else if (item.type === 'accessory') state.equipment.accessories.push(item);
    },
    addUpgrade(state, action: PayloadAction<string>) {
      state.upgrades.push(action.payload);
    },
    resetPlayer() {
      return initialState;
    },
  },
});

export const {
  updateStats,
  gainGold,
  addItemToInventory,
  equipItem,
  addUpgrade,
  resetPlayer,
} = playerSlice.actions;
export default playerSlice.reducer;
