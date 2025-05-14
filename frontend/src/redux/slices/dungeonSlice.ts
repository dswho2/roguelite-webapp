// frontend/src/redux/slices/dungeonSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Tile {
    type: 'floor' | 'wall' | 'hole' | 'exit' | 'trap';
    walkable: boolean;
    blocksVision: boolean;
}

interface Enemy {
    id: string;
    type: string;
    hp: number;
    atk: number;
    def: number;
    pos: { x: number; y: number };
    behavior: 'patrol' | 'chase';
}

interface DungeonState {
    level: number;
    map: Tile[][];
    playerPos: { x: number; y: number };
    enemies: Enemy[];
    fogOfWar: boolean[][];
    visibleTiles: Set<string>;
    exploredTiles: Set<string>;
    lootOnFloor: { x: number; y: number; itemId: string }[];
    exitTiles: { x: number; y: number }[];
}

const initialState: DungeonState = {
    level: 1,
    map: [],
    playerPos: { x: 0, y: 0 },
    enemies: [],
    fogOfWar: [],
    visibleTiles: new Set(),
    exploredTiles: new Set(),
    lootOnFloor: [],
    exitTiles: [],
};

const dungeonSlice = createSlice({
    name: 'dungeon',
    initialState,
    reducers: {
        generateDungeon(state, action: PayloadAction<Tile[][]>) {
        state.map = action.payload;
        state.level += 1;
        },
        movePlayer(state, action: PayloadAction<{ x: number; y: number }>) {
        state.playerPos = action.payload;
        },
        updateEnemies(state, action: PayloadAction<Enemy[]>) {
        state.enemies = action.payload;
        },
        revealTiles(state, action: PayloadAction<string[]>) {
        action.payload.forEach(tile => state.visibleTiles.add(tile));
        },
        exploreTiles(state, action: PayloadAction<string[]>) {
        action.payload.forEach(tile => state.exploredTiles.add(tile));
        },
        dropLoot(state, action: PayloadAction<{ x: number; y: number; itemId: string }>) {
        state.lootOnFloor.push(action.payload);
        },
        setExits(state, action: PayloadAction<{ x: number; y: number }[]>) {
        state.exitTiles = action.payload;
        },
        resetDungeon() {
        return initialState;
        },
    },
});

export const {
    generateDungeon,
    movePlayer,
    updateEnemies,
    revealTiles,
    exploreTiles,
    dropLoot,
    setExits,
    resetDungeon,
} = dungeonSlice.actions;
export default dungeonSlice.reducer;