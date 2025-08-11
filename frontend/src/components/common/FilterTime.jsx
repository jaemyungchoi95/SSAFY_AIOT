import React from 'react';
import './FilterTime.css';
import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';

import FilterTimeIcon from '../../assets/FilterTime.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

const FilterTime = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedTime, setSelectedTime } = useFilterStore();

  const handleSelect = (time) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  return (
    <div className="FilterTime" ref={dropdownRef}>
      <button
        className="Filter_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={FilterTimeIcon} className="Icon" alt="" />
        <span className="Label">{selectedTime}</span>
        <img src={FilterDropIcon} alt="" className="Chevron" />
      </button>
      {isOpen && (
        <div className="Filter_Menu">
          {['최신순', '오래된순'].map((time) => (
            <button
              key={time}
              className="Filter_Item"
              onClick={() => handleSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTime;
