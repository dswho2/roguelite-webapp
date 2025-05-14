// frontend/src/App.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import TitleScreen from './screens/TitleScreen';
import TownScreen from './screens/TownScreen';
import DungeonSelectScreen from './screens/DungeonSelectScreen';
import VictoryScreen from './screens/VictoryScreen';
import GameOverScreen from './screens/GameOverScreen';
import GameContainer from './game/GameContainer';

const App = () => {
  const screen = useSelector((state: RootState) => state.screen.current);

  const renderScreen = () => {
    switch (screen) {
      case 'title': return <TitleScreen />;
      case 'town': return <TownScreen />;
      case 'dungeonSelect': return <DungeonSelectScreen />;
      case 'dungeon': return <GameContainer />;
      case 'victory': return <VictoryScreen />;
      case 'gameOver': return <GameOverScreen />;
      default: return <div>Unknown screen state</div>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-5xl text-center space-y-6">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;