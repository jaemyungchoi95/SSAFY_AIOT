import React from 'react'
import './FilterLocation.css'
import './FilterTime.css'
import { WarehouseStateContext } from '../../utils/AlertContext'
import { useContext, useState } from 'react'

const FilterLocation = ({selectedWarehouse, setSelectedWarehouse}) => {
  const warehouses = useContext(WarehouseStateContext);
  const [isOpen, setIsOpen] = useState(false);

  const defaultWarehouse = warehouses.find(warehouse => warehouse.id === selectedWarehouse) || {};
  const defaultName = defaultWarehouse ? defaultWarehouse.name : '창고 선택';

  const handleSelect = (id) => {
    setSelectedWarehouse(id);
    setIsOpen(false);
  }

  return (
    <div className="FilterLocation">
    <button className="FilterLocation_Title" onClick={() => setIsOpen(prev => !prev)}>
        <span>{defaultName}</span>
        <span className="Chevron">▼</span>
    </button>
    <div className="LocationUnderline"></div>
    {isOpen &&(
      <div className="FilterMenu">
        {warehouses.map((warehouse) => (
            <button className="FilterItem" key={warehouse.id} onClick={()=> handleSelect(warehouse.id)}>
                <span>{warehouse.name}</span>
            </button>
        ))}
      </div>
    )}
    
        
    
    </div>

  )
}

export default FilterLocation