// src/game/scenes/DungeonScene.ts
import Phaser from 'phaser';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } from '../constants';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import type { Entity, Enemy as EnemyType } from '../types';
import { openInventoryModal } from '../ui/inventoryModal';
import { loadItemsToRegistry } from '../../assets/loadItemRegistry';

export default class DungeonScene extends Phaser.Scene {
  player!: Player;
  enemies: Enemy[] = [];
  highlightGroup!: Phaser.GameObjects.Group;
  actionIcons: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('DungeonScene');
  }

  create() {
    loadItemsToRegistry(this);
    this.createGrid();
    this.highlightGroup = this.add.group();

    const playerStats: Entity = {
      hp: 100, maxHp: 100, atk: 10, def: 5, spd: 3, mobility: 3, luck: 2,
    };

    const px = this.registry.get('playerLastX') ?? 4;
    const py = this.registry.get('playerLastY') ?? 4;
    this.registry.remove('playerLastX');
    this.registry.remove('playerLastY');
    this.player = new Player(this, { x: px, y: py }, playerStats);
    this.registry.set('player', playerStats);

    const enemyStats: EnemyType = {
      hp: 50, maxHp: 50, atk: 8, def: 4, spd: 2, mobility: 2, luck: 1,
      lootTable: [
        { id: 'healing_potion', chance: 0.8 },
        { id: 'iron_sword', chance: 0.4 },
        { id: 'leather_armor', chance: 0.3 },
      ]
    };

    const defeatedX = this.registry.get('enemyAtX');
    const defeatedY = this.registry.get('enemyAtY');
    const skipEnemy = this.registry.get('enemyDefeated');
    this.registry.remove('enemyDefeated');
    this.registry.remove('enemyAtX');
    this.registry.remove('enemyAtY');
    this.enemies = this.enemies.filter(e => e.position.x !== defeatedX || e.position.y !== defeatedY);

    if (!(skipEnemy && defeatedX === 7 && defeatedY === 4)) {
      const enemy = new Enemy(this, { x: 7, y: 4 }, enemyStats);
      this.enemies.push(enemy);
    }

    this.highlightMovableTiles();
    this.input.on('gameobjectdown', this.handleTileClick, this);
  }

  createGrid() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        this.add.rectangle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE - 2, TILE_SIZE - 2, 0x444444)
          .setStrokeStyle(1, 0x222222)
          .setInteractive()
          .setName('tile')
          .setData('gridX', x)
          .setData('gridY', y);
      }
    }
  }

  highlightMovableTiles() {
    this.highlightGroup.clear(true, true);
    const { x: px, y: py } = this.player.position;
    const range = this.player.stats.mobility;

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const distance = Math.abs(x - px) + Math.abs(y - py);
        if (distance <= range) {
          const highlight = this.add.rectangle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE - 6, TILE_SIZE - 6, 0x00ff00, 0.3)
            .setData('gridX', x)
            .setData('gridY', y)
            .setInteractive()
            .setName('highlight');
          this.highlightGroup.add(highlight);
        }
      }
    }
  }

  handleTileClick(_: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {
    if (!gameObject || !gameObject.getData) return;
    const x = gameObject.getData('gridX');
    const y = gameObject.getData('gridY');
    if (typeof x !== 'number' || typeof y !== 'number') return;

    const { x: px, y: py } = this.player.position;
    const inRange = Math.abs(x - px) + Math.abs(y - py) <= this.player.stats.mobility;

    this.actionIcons.forEach(icon => icon.destroy());
    this.actionIcons = [];

    if (!inRange) return;

    const enemyAtTile = this.enemies.find(e => e.position.x === x && e.position.y === y);
    const isSelf = px === x && py === y;

    this.tweens.add({ targets: gameObject, scale: 0.9, duration: 100, yoyo: true });

    let iconKey = enemyAtTile ? '⚔' : isSelf ? '🎒' : '👣';
    const tileCenterX = x * TILE_SIZE + TILE_SIZE / 2;
    const tileCenterY = y * TILE_SIZE + TILE_SIZE / 2;

    const icon = this.add.text(tileCenterX, tileCenterY, iconKey, { fontSize: '18px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive();

    const zone = this.add.rectangle(tileCenterX, tileCenterY, TILE_SIZE - 4, TILE_SIZE - 4, 0x000000, 0)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(99);

    const onConfirm = () => {
      if (enemyAtTile) {
        this.registry.set('playerLastX', px);
        this.registry.set('playerLastY', py);
        this.registry.set('enemyAtX', x);
        this.registry.set('enemyAtY', y);
        this.registry.set('enemy', enemyAtTile.stats);
        this.scene.start('BattleScene');
      } else if (isSelf) {
        openInventoryModal(this);
      } else {
        this.player.moveTo(x, y);
        this.highlightMovableTiles();
        this.actionIcons.forEach(icon => icon.destroy());
        this.actionIcons = [];
      }
    };

    icon.on('pointerdown', onConfirm);
    zone.on('pointerdown', onConfirm);
    this.actionIcons.push(icon, zone);
  }
}
