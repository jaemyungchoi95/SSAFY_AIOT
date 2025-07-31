import React from 'react';
import './FilterTime.css';
import { useState } from 'react';

const FilterTime = ({ selectedTime, setSelectedTime }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (time) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  // gemini request : 이 컴포넌트는 SidebarHeader 로부터 전달받은 props를 바탕으로 데이터를 정렬합니다.
  return (
    <div className="FilterTime">
      <button
        className="Filter_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src="../../src/assets/FilterTime.png" className="Icon" alt="" />
        <span className="Label">{selectedTime}</span>
        <img src="../../src/assets/FilterDrop.png" alt="" className="Chevron" />
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
