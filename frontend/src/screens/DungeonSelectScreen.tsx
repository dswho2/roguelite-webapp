// frontend/src/screens/DungeonSelectScreen.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setScreen } from '../redux/slices/screenSlice';
import { selectDungeon } from '../redux/slices/uiSlice';

const DungeonSelectScreen = () => {
  const dispatch = useDispatch();

  const handleSelect = (name: string) => {
    dispatch(selectDungeon(name));
    dispatch(setScreen('dungeon'));
  };

  return (
    <div className="text-center space-y-2">
      <h2 className="text-xl">Choose a Dungeon</h2>
      <button
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        onClick={() => handleSelect('Cursed Catacombs')}
      >
        Cursed Catacombs
      </button>
    </div>
  );
};

export default DungeonSelectScreen;