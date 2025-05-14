// src/game/types.ts

export interface Entity {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  mobility: number;
  luck: number;
}

export interface LootEntry {
  id: string;      // item ID (should match items.json)
  chance: number;  // 0.0 to 1.0
}

export interface Enemy extends Entity {
  lootTable: LootEntry[];
}

export interface Position {
  x: number;
  y: number;
}

// Item types
export type ItemType = 'consumable' | 'gear';
export type GearSlot = 'weapon' | 'head' | 'chest' | 'legs';

export interface BaseItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  icon?: string;
}

export interface ConsumableItem extends BaseItem {
  type: 'consumable';
  effect: string;
  potency: number;
}

export interface GearItem extends BaseItem {
  type: 'gear';
  slot: GearSlot;
  stats: Partial<Entity> & {
    [key: string]: number | undefined;
  };
  specialProperties?: string[];
}

export type Item = ConsumableItem | GearItem;
