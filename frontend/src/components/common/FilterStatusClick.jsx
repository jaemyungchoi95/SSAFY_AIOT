import React from 'react';
import './FilterStatusClick.css';
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
      className={`FilterStatusClick ${isActive ? 'active' : ''}`}
      onClick={() => setSelectedStatusFilter(text)}
    >
      {text}
    </button>
  );
};

export default FilterStatusClick;
