import React from 'react';
import { useAppStore } from '../../stores/useAppStore';

const FilterStatusClick = ({ text }) => {
  const selectedStatusFilter = useAppStore(
    (state) => state.selectedStatusFilter,
  );
  const setSelectedStatusFilter = useAppStore(
    (state) => state.setSelectedStatusFilter,
  );

  const isActive = selectedStatusFilter === text;

  return (
    <button
      className={`FilterStatusClick border-1 border-[#c2c2c2] rounded-3 px-2.5 cursor-pointer font-bold text-base inline-flex items-center justify-center h-10 hover:bg-[#c2c2c2] hover:text-[#20212a] truncate ${isActive ? 'bg-[#c2c2c2] text-[#20212a]' : ''}`}
      onClick={() => setSelectedStatusFilter(text)}
    >
      {text}
    </button>
  );
};

export default FilterStatusClick;
