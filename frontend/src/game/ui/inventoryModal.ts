// src/game/ui/inventoryModal.ts
import Phaser from 'phaser';
import { createItemCell } from './components/ItemCell';
import { createItemDescriptionUI } from './components/itemDescriptionUI';
import type { Item, GearItem, ConsumableItem, GearSlot } from '../types';

export function openInventoryModal(scene: Phaser.Scene): void {
  const gearBoxes: Phaser.GameObjects.GameObject[] = [];
  const gearTexts: Phaser.GameObjects.Text[] = [];
  const itemSlots: Phaser.GameObjects.GameObject[] = [];

  const modalOverlay = scene.add.rectangle(0, 0, scene.scale.width * 2, scene.scale.height * 2, 0x000000, 0.5)
    .setOrigin(0)
    .setDepth(199)
    .setInteractive();

  const modalBg = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, 500, 400, 0x222222, 0.95)
    .setDepth(200)
    .setInteractive();

  const inventoryItems: Item[] = scene.registry.get('inventoryItems') || [];
  const equippedItems: Partial<Record<GearSlot, Item>> = scene.registry.get('equippedItems') || {};

  let selectedSlot: Phaser.GameObjects.Rectangle | null = null;
  let selectedIndex: number | null = null;
  let selectedItem: Item | null = null;
  let selectedFromGear: boolean = false;

  const selectedIcon = scene.add.text(
    scene.scale.width / 2 - 200,
    scene.scale.height / 2 + 50,
    '',
    { fontSize: '28px', color: '#ffffff' }
  ).setDepth(202);

  const { update: updateDescription, destroy: destroyDescription } = createItemDescriptionUI(
    scene,
    scene.scale.width / 2 - 150,
    scene.scale.height / 2 + 30
  );

  const useButton = scene.add.text(scene.scale.width / 2 - 100, scene.scale.height / 2 + 140, '', {
    fontSize: '12px', color: '#ffffff', backgroundColor: '#555555'
  }).setPadding(6).setInteractive().setDepth(202).setVisible(false);

  const trashButton = scene.add.text(scene.scale.width / 2 + 40, scene.scale.height / 2 + 140, 'Trash', {
    fontSize: '12px', color: '#ffffff', backgroundColor: '#880000'
  }).setPadding(6).setInteractive().setDepth(202).setVisible(false);

  const showErrorShake = (target: Phaser.GameObjects.Text) => {
    scene.tweens.add({ targets: target, x: "+=5", duration: 50, yoyo: true, repeat: 3 });
  };

  const updateButtons = (item: Item | null, fromGear: boolean = false) => {
    if (!item) {
      useButton.setVisible(false);
      trashButton.setVisible(false);
      return;
    }
    useButton.setVisible(true);
    trashButton.setVisible(true);
    if (fromGear) {
      useButton.setText('Unequip');
    } else {
      useButton.setText(item.type === 'gear' ? 'Equip' : 'Use');
    }
  };

  const clearSelection = () => {
    if (selectedSlot) selectedSlot.setStrokeStyle(2, 0xaaaaaa);
    selectedSlot = null;
    selectedIndex = null;
    selectedItem = null;
    selectedFromGear = false;
    selectedIcon.setText('');
    updateDescription(null);
    updateButtons(null);
  };

  useButton.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    pointer.event.stopPropagation();
    if (!selectedItem) return;

    if (selectedFromGear && selectedItem.type === 'gear') {
      const emptySlot = inventoryItems.findIndex(i => !i);
      if (emptySlot !== -1) {
        inventoryItems[emptySlot] = selectedItem;
      } else if (inventoryItems.length < 10) {
        inventoryItems.push(selectedItem);
      } else {
        useButton.setBackgroundColor('#aa0000');
        showErrorShake(useButton);
        scene.time.delayedCall(500, () => useButton.setBackgroundColor('#555555'));
        return;
      }
      const slot = selectedItem.slot;
      delete equippedItems[slot];
      scene.registry.set('inventoryItems', inventoryItems);
      scene.registry.set('equippedItems', equippedItems);
      clearSelection();
      destroyInventory();
      openInventoryModal(scene);
    }
    else if (selectedItem.type === 'consumable') {
      inventoryItems.splice(selectedIndex!, 1);
      scene.registry.set('inventoryItems', inventoryItems);
      destroyInventory();
      openInventoryModal(scene);
    }
    else if (selectedItem.type === 'gear') {
      const slot = selectedItem.slot;
      if (equippedItems[slot]) {
        useButton.setBackgroundColor('#aa0000');
        showErrorShake(useButton);
        scene.time.delayedCall(500, () => useButton.setBackgroundColor('#555555'));
        return;
      }
      equippedItems[slot] = selectedItem;
      inventoryItems.splice(selectedIndex!, 1);
      scene.registry.set('equippedItems', equippedItems);
      scene.registry.set('inventoryItems', inventoryItems);
      destroyInventory();
      openInventoryModal(scene);
    }
  });

  trashButton.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    pointer.event.stopPropagation();
    if (!selectedItem) return;
    if (selectedFromGear && selectedItem.type === 'gear') {
      delete equippedItems[selectedItem.slot];
      scene.registry.set('equippedItems', equippedItems);
    } else {
      inventoryItems.splice(selectedIndex!, 1);
      scene.registry.set('inventoryItems', inventoryItems);
    }
    destroyInventory();
    openInventoryModal(scene);
  });

  for (let i = 0; i < 10; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const item = inventoryItems[i];
    const x = scene.scale.width / 2 - 200 + col * 80;
    const y = scene.scale.height / 2 - 140 + row * 80;

    const { slot, label } = createItemCell(scene, x, y, item?.icon || item?.name || '', () => {
      if (selectedSlot) selectedSlot.setStrokeStyle(2, 0xaaaaaa);
      slot.setStrokeStyle(2, 0xffff00);
      selectedSlot = slot;
      selectedIndex = i;
      selectedItem = item;
      selectedFromGear = false;

      selectedIcon.setText(item?.icon || '');
      updateDescription(item);
      updateButtons(item, false);
    });

    itemSlots.push(slot);
    if (label) itemSlots.push(label);
  }

  const gearSlots: GearSlot[] = ['head', 'chest', 'legs', 'weapon'];

  gearSlots.forEach((slotKey, i) => {
    const y = scene.scale.height / 2 - 100 + i * 80;
    const equippedItem = equippedItems[slotKey];

    const slotLabel = scene.add.text(
      scene.scale.width / 2 + 200,
      y - 40,
      slotKey.charAt(0).toUpperCase() + slotKey.slice(1),
      { fontSize: '12px', color: '#ffffff' }
    ).setOrigin(0.5).setDepth(202);
    gearBoxes.push(slotLabel);

    const { slot, label: gearLabel } = createItemCell(scene, scene.scale.width / 2 + 200, y, equippedItem?.icon || equippedItem?.name || '', () => {
      if (!equippedItem) return;
      if (selectedSlot) selectedSlot.setStrokeStyle(2, 0xaaaaaa);
      slot.setStrokeStyle(2, 0xffff00);
      selectedSlot = slot;
      selectedIndex = null;
      selectedItem = equippedItem;
      selectedFromGear = true;

      selectedIcon.setText(equippedItem.icon || '');
      updateDescription(equippedItem);
      updateButtons(equippedItem, true);
    });
    gearBoxes.push(slot);
    if (gearLabel) gearBoxes.push(gearLabel);
  });

  const closeBtn = scene.add.text(scene.scale.width / 2 + 220, scene.scale.height / 2 - 180, 'X', {
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#880000'
  }).setPadding(4).setDepth(203).setInteractive();

  const destroyInventory = () => {
    destroyDescription();
    [modalOverlay, modalBg, useButton, trashButton, closeBtn, selectedIcon, ...itemSlots, ...gearBoxes, ...gearTexts].forEach(el => el.destroy());
  };

  closeBtn.on('pointerdown', destroyInventory);
  modalOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    const bounds = modalBg.getBounds();
    if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
      destroyInventory();
    }
  });

  modalBg.on('pointerdown', () => {
    clearSelection();
  });
}
