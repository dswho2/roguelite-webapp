// src/game/GameContainer.tsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import DungeonScene from './scenes/DungeonScene';
import BattleScene from './scenes/BattleScene';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } from './constants';

const GameContainer = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    if (gameInstance.current) {
      gameInstance.current.destroy(true);
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GRID_WIDTH * TILE_SIZE,
      height: GRID_HEIGHT * TILE_SIZE,
      parent: gameRef.current,
      scene: [DungeonScene, BattleScene],
      backgroundColor: '#1e1e1e',
    };

    gameInstance.current = new Phaser.Game(config);

    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, []);

  return <div ref={gameRef} className="flex items-center justify-center w-full h-full" />;
};

export default GameContainer;