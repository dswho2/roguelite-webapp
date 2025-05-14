// frontend/src/screens/VictoryScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../redux/slices/screenSlice';

const VictoryScreen = () => {
  const dispatch = useDispatch();

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-semibold text-green-400">Victory!</h2>
      <button
        className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded"
        onClick={() => dispatch(setScreen('town'))}
      >
        Return to Town
      </button>
    </div>
  );
};

export default VictoryScreen;
