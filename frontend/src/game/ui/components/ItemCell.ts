// src/game/ui/itemCell.ts
import Phaser from 'phaser';

export function createItemCell(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void
): { slot: Phaser.GameObjects.Rectangle; label?: Phaser.GameObjects.Text } {
  const slot = scene.add.rectangle(x, y, 60, 60, 0x444444)
    .setStrokeStyle(2, 0xaaaaaa)
    .setDepth(201)
    .setInteractive();

  const textLabel = label ? scene.add.text(x, y, label, {
    fontSize: '12px',
    color: '#ffffff',
    align: 'center',
    wordWrap: { width: 50, useAdvancedWrap: true },
  }).setOrigin(0.5).setDepth(202) : undefined;

  slot.on('pointerdown', () => {
    scene.tweens.add({
      targets: slot,
      scaleX: 0.9,
      scaleY: 0.9,
      yoyo: true,
      duration: 100,
      ease: 'Power1'
    });
    onClick();
  });

  return { slot, label: textLabel };
}
