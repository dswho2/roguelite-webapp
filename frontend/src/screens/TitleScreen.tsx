// frontend/src/screens/TitleScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../redux/slices/screenSlice';

const TitleScreen = () => {
  const dispatch = useDispatch();

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">Dungeon Roguelite</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        onClick={() => dispatch(setScreen('town'))}
      >
        Start Game
      </button>
    </div>
  );
};

export default TitleScreen;