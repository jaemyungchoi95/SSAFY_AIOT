import React from 'react';
import './FilterDay.css';
import './FilterTime.css';

import CalenderIcon from '../../assets/Calender.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';

const FilterDay = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedDay, setSelectedDay } = useFilterStore();

  const handleSelect = (day) => {
    setSelectedDay(day);
    setIsOpen(false);
  };

  return (
    <div className="FilterStatus" ref={dropdownRef}>
      <button
        className="Filter_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={CalenderIcon} className="Icon" alt="" />
        <span className="Label">{selectedDay}</span>
        <img src={FilterDropIcon} alt="" className="Chevron" />
      </button>

      {isOpen && (
        <div className="Filter_Menu">
          {['전체', '하루', '일주일', '한달'].map((day) => (
            <button
              key={day}
              className="Filter_Item"
              onClick={() => handleSelect(day)}
            >
              {day}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDay;
