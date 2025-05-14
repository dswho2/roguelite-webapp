// src/game/ui/components/itemDescriptionUI.ts
import Phaser from 'phaser';
import type { Item, GearItem, ConsumableItem } from '../../types';

export function createItemDescriptionUI(
  scene: Phaser.Scene,
  x: number,
  y: number
): {
  update: (item: Item | null) => void;
  destroy: () => void;
} {
  const descriptionBox = scene.add.rectangle(x, y, 300, 100, 0x333333)
    .setOrigin(0, 0)
    .setDepth(500);

  const nameText = scene.add.text(x + 10, y + 10, '', {
    fontSize: '14px', color: '#ffffff'
  }).setDepth(501);

  const descText = scene.add.text(x + 10, y + 30, 'Select an item...', {
    fontSize: '12px', color: '#ffffff', wordWrap: { width: 280 }
  }).setDepth(501);

  const formatDescription = (item: Item): string => {
    let desc = item.description;
    if (item.type === 'gear') {
      const gear = item as GearItem;
      const stats = Object.entries(gear.stats || {})
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');
      if (stats) desc += `\nStats: ${stats}`;
      if (gear.specialProperties?.length) desc += `\nSpecial: ${gear.specialProperties.join(', ')}`;
    } else if (item.type === 'consumable') {
      const cons = item as ConsumableItem;
      desc += `\nEffect: ${cons.effect} (${cons.potency})`;
    }
    return desc;
  };

  const update = (item: Item | null) => {
    if (!item) {
      nameText.setText('');
      descText.setText('Select an item...');
    } else {
      nameText.setText(item.name);
      descText.setText(formatDescription(item));
    }
  };

  const destroy = () => {
    descriptionBox.destroy();
    nameText.destroy();
    descText.destroy();
  };

  return { update, destroy };
}
