// frontend/src/screens/GameOverScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../redux/slices/screenSlice';

const GameOverScreen = () => {
  const dispatch = useDispatch();

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-semibold text-red-500">Game Over</h2>
      <button
        className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
        onClick={() => dispatch(setScreen('town'))}
      >
        Try Again
      </button>
    </div>
  );
};

export default GameOverScreen;