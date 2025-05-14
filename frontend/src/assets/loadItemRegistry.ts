// src/assets/loadItemRegistry.ts
import rawItems from './items.json';
import type { Item } from '../game/types';

export function loadItemsToRegistry(scene: Phaser.Scene) {
  const items: Item[] = rawItems as Item[];

  const itemMap: Record<string, Item> = {};
  items.forEach(item => {
    itemMap[item.id] = item;
  });

  scene.registry.set('itemMap', itemMap);
  scene.registry.set('inventoryItems', [
    itemMap['potion_small'],
    itemMap['fire_sword']
  ]);
  scene.registry.set('equippedItems', {
  });
}