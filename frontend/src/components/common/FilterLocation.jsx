import React from 'react';
import './FilterLocation.css';
import { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';

const FilterLocation = () => {
  const { warehouses, selectedWarehouseId, setSelectedWarehouseId } =
    useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedWarehouse = warehouses.find(
    (w) => w.id === selectedWarehouseId,
  );
  const defaultName = selectedWarehouse ? selectedWarehouse.name : '창고 선택';

  const handleSelect = async (id) => {
    setSelectedWarehouseId(id);
    setIsOpen(false);
  };

  return (
    <div className="FilterLocation">
      <button
        className="FilterLocation_Title"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="inline-block max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
          {defaultName}
        </span>
        <span className="Chevron">▼</span>
      </button>
      <div className="LocationUnderline"></div>
      {isOpen && (
        <div className="FilterMenu">
          {warehouses.map((warehouse) => (
            <button
              className="FilterItem"
              key={warehouse.id}
              onClick={() => handleSelect(warehouse.id)}
            >
              <span>{warehouse.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterLocation;
