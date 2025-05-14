// src/game/scenes/BattleScene.ts
import Phaser from 'phaser';
import type { Entity, Enemy, LootEntry } from '../types';
import { openInventoryModal } from '../ui/inventoryModal';

export default class BattleScene extends Phaser.Scene {
  player!: Entity;
  enemy!: Enemy;
  playerHpBar!: Phaser.GameObjects.Rectangle;
  enemyHpBar!: Phaser.GameObjects.Rectangle;
  playerHpText!: Phaser.GameObjects.Text;
  enemyHpText!: Phaser.GameObjects.Text;
  messageText!: Phaser.GameObjects.Text;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.player = this.registry.get('player');
    this.enemy = this.registry.get('enemy');

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.cameras.main.setBackgroundColor('#111');

    // Sprites (placeholders)
    this.add.rectangle(centerX - 180, centerY + 60, 100, 100, 0x00ff00); // player
    this.add.rectangle(centerX + 180, centerY - 60, 100, 100, 0xff0000); // enemy

    // HP bars
    this.playerHpBar = this.add.rectangle(centerX - 180, centerY + 130, 100, 10, 0x00ff00).setOrigin(0.5);
    this.enemyHpBar = this.add.rectangle(centerX + 180, centerY - 130, 100, 10, 0xff0000).setOrigin(0.5);

    // HP text
    this.playerHpText = this.add.text(centerX - 230, centerY + 145, `${this.player.hp}/${this.player.maxHp}`, {
      fontSize: '14px',
      color: '#ffffff'
    });

    this.enemyHpText = this.add.text(centerX + 130, centerY - 115, `${this.enemy.hp}/${this.enemy.maxHp}`, {
      fontSize: '14px',
      color: '#ffffff'
    });

    // Message box
    this.messageText = this.add.text(centerX - 100, centerY + 210, '', {
      fontSize: '18px',
      color: '#ffff88'
    });

    // Menu text
    this.add.text(centerX - 100, centerY + 180, 'Attack', { fontSize: '24px', color: '#fff' })
      .setInteractive()
      .on('pointerdown', () => {
        const damage = Math.max(1, this.player.atk - (this.enemy.def ?? 0) + Phaser.Math.Between(-2, 2));
        this.enemy.hp = Math.max(0, this.enemy.hp - damage);
        this.updateHpBars();
        this.messageText.setText(`You did ${damage} damage!`);

        if (this.enemy.hp <= 0) {
          this.time.delayedCall(1000, () => this.endBattle());
        }
      });

    this.add.text(centerX + 20, centerY + 180, 'Run', { fontSize: '24px', color: '#fff' })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('DungeonScene');
      });
  }

  updateHpBars() {
    const enemyRatio = this.enemy.hp / this.enemy.maxHp;
    this.enemyHpBar.width = 100 * enemyRatio;
    this.enemyHpText.setText(`${this.enemy.hp}/${this.enemy.maxHp}`);
  }

  endBattle() {
    const lootTable = this.enemy.lootTable ?? [];
    const rolledLoot: string[] = [];
    const itemRegistry = this.registry.get('itemRegistry') || {};

    lootTable.forEach((entry: LootEntry) => {
      if (Math.random() <= entry.chance) {
        rolledLoot.push(entry.id);
      }
    });

    if (!rolledLoot.length) {
      this.scene.start('DungeonScene');
      return;
    }

    let selected: string | null = null;

    const selectedText = this.add.text(340, 120, 'Select loot...', {
      fontSize: '12px', color: '#ffffff', wordWrap: { width: 260 }
    }).setDepth(502);

    const selectedIcon = this.add.text(310, 122, '', {
      fontSize: '20px', color: '#ffffff'
    }).setDepth(502);

    const descriptionBox = this.add.rectangle(300, 110, 300, 100, 0x333333)
      .setOrigin(0, 0).setDepth(501);

    rolledLoot.forEach((itemId, i) => {
      const item = itemRegistry[itemId];
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 300 + col * 50;
      const y = 20 + row * 50;

      const cell = this.add.rectangle(x, y, 40, 40, 0x555555)
        .setInteractive()
        .setDepth(502);

      const icon = this.add.text(x, y, item?.icon || '?', {
        fontSize: '16px', color: '#ffffff'
      }).setOrigin(0.5).setDepth(503);

      cell.on('pointerdown', () => {
        selected = itemId;
        selectedIcon.setText(item.icon || '');
        selectedText.setText(`${item.name}\n${item.description}`);
      });
    });

    const takeBtn = this.add.text(330, 220, 'Take', {
      fontSize: '14px', color: '#ffffff', backgroundColor: '#008800'
    }).setPadding(6).setInteractive().setDepth(502);

    const trashBtn = this.add.text(400, 220, 'Trash', {
      fontSize: '14px', color: '#ffffff', backgroundColor: '#880000'
    }).setPadding(6).setInteractive().setDepth(502);

    takeBtn.on('pointerdown', () => {
      if (!selected) return;
      const inventory = this.registry.get('inventoryItems') || [];
      if (inventory.length >= 10) {
        this.tweens.add({ targets: takeBtn, x: '+=5', duration: 50, yoyo: true, repeat: 3 });
        return;
      }
      inventory.push(selected);
      this.registry.set('inventoryItems', inventory);
      selected = null;
      selectedIcon.setText('');
      selectedText.setText('Select loot...');
    });

    trashBtn.on('pointerdown', () => {
      if (!selected) return;
      selected = null;
      selectedIcon.setText('');
      selectedText.setText('Select loot...');
    });

    openInventoryModal(this);
  }
}
