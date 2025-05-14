// src/game/ui/lootModal.ts
import Phaser from 'phaser';
import { createItemCell } from './components/ItemCell';
import { createItemDescriptionUI } from './components/itemDescriptionUI';
import type { Item } from '../types';

export function openLootModal(scene: Phaser.Scene, itemIds: string[]) {
  const itemRegistry: Record<string, Item> = scene.registry.get('itemRegistry') || {};
  const inventory: string[] = scene.registry.get('inventoryItems') || [];

  let selected: string | null = null;

  const lootCells: Phaser.GameObjects.GameObject[] = [];

  const selectedIcon = scene.add.text(
    scene.scale.width / 2 - 200,
    scene.scale.height / 2 - 30,
    '',
    { fontSize: '28px', color: '#ffffff' }
  ).setDepth(1001);

  const { update: updateDescription, destroy: destroyDescription } = createItemDescriptionUI(
    scene,
    scene.scale.width / 2 - 150,
    scene.scale.height / 2 - 50
  );

  const takeButton = scene.add.text(scene.scale.width / 2 - 100, scene.scale.height / 2 + 70, 'Take', {
    fontSize: '14px', color: '#ffffff', backgroundColor: '#008800'
  }).setPadding(6).setInteractive().setDepth(1001);

  const trashButton = scene.add.text(scene.scale.width / 2 + 20, scene.scale.height / 2 + 70, 'Trash', {
    fontSize: '14px', color: '#ffffff', backgroundColor: '#880000'
  }).setPadding(6).setInteractive().setDepth(1001);

  const showErrorShake = (target: Phaser.GameObjects.Text) => {
    scene.tweens.add({ targets: target, x: '+=5', duration: 50, yoyo: true, repeat: 3 });
  };

  itemIds.forEach((id, i) => {
    const item = itemRegistry[id];
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = scene.scale.width / 2 - 200 + col * 50;
    const y = 60 + row * 50;

    const { slot, label } = createItemCell(scene, x, y, item?.icon || item?.name || '', () => {
      selected = id;
      selectedIcon.setText(item?.icon || '');
      updateDescription(item);
    });

    lootCells.push(slot);
    if (label) lootCells.push(label);
  });

  takeButton.on('pointerdown', () => {
    if (!selected) return;
    if (inventory.length >= 10) {
      showErrorShake(takeButton);
      return;
    }
    inventory.push(selected);
    scene.registry.set('inventoryItems', inventory);
    selected = null;
    selectedIcon.setText('');
    updateDescription(null);
  });

  trashButton.on('pointerdown', () => {
    selected = null;
    selectedIcon.setText('');
    updateDescription(null);
  });

  // can destroy with a key or callback externally
  // Or add a close button here
}
