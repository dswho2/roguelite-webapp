// frontend/src/screens/TownScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../redux/slices/screenSlice';

const TownScreen = () => {
  const dispatch = useDispatch();

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl">Welcome to the Town</h2>
      <button
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        onClick={() => dispatch(setScreen('dungeonSelect'))}
      >
        Enter Dungeon
      </button>
    </div>
  );
};

export default TownScreen;