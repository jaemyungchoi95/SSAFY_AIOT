import React from 'react';
import './SidebarDetailHeader.css';
import Status from './Status';

const SidebarDetailHeader = ({ alert, onClose }) => {
  return (
    <div className="SidebarDetailHeader">
      <div className="SidebarDetailHeader_Left">
        <div className="SidebarDetailHeader_Spot">
          Rack {alert.rackId} - {alert.spotId}
        </div>
        <Status
          text={
            alert.danger
              ? '위험'
              : alert.status === 'DONE'
                ? '처리완료'
                : '미확인'
          }
          type={
            alert.danger
              ? 'Danger'
              : alert.status === 'DONE'
                ? 'Complete'
                : 'Caution'
          }
        />
      </div>

      <button onClick={onClose} className="SidebarDetailHeader_CloseBtn">
        <img src="../../src/assets/CloseBtn.png" alt="" />
      </button>
    </div>
  );
};

export default SidebarDetailHeader;
