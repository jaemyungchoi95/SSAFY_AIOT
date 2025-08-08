import React from 'react';
import './FilterStatus.css';
import './FilterTime.css';
import { useFilterStore } from '../../stores/useFilterStore';
import { useDropdownFilter } from '../../hooks/useDropdownFilter';
import FilterStatusIcon from '../../assets/FilterStatus.png';
import FilterDropIcon from '../../assets/FilterDrop.png';

const FilterStatus = () => {
  const { isOpen, setIsOpen, dropdownRef } = useDropdownFilter();
  const { selectedStatus, setSelectedStatus } = useFilterStore();

  const handleSelect = (time) => {
    setSelectedStatus(time);
    setIsOpen(false);
  };
  return (
    <div className="FilterStatus" ref={dropdownRef}>
      <button
        className="Filter_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={FilterStatusIcon} className="Icon" alt="" />
        <span className="Label">{selectedStatus}</span>
        <img src={FilterDropIcon} alt="" className="Chevron" />
      </button>

      {isOpen && (
        <div className="Filter_Menu">
          {['전체', '처리완료', '미확인', '위험'].map((status) => (
            <button
              key={status}
              className="Filter_Item"
              onClick={() => handleSelect(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterStatus;
