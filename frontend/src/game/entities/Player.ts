// src/game/entities/Player.ts
import Phaser from 'phaser';
import { TILE_SIZE } from '../constants';
import type { EntityStats, Position } from '../types';

export default class Player {
  sprite: Phaser.GameObjects.Rectangle;
  position: Position;
  stats: EntityStats;
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, startPos: Position, stats: EntityStats) {
    this.scene = scene;
    this.position = startPos;
    this.stats = stats;

    this.sprite = this.scene.add.rectangle(
      startPos.x * TILE_SIZE + TILE_SIZE / 2,
      startPos.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE - 10,
      TILE_SIZE - 10,
      0x00ff00
    );
  }

  moveTo(x: number, y: number) {
    this.sprite.setPosition(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
    this.position = { x, y };
  }
}
