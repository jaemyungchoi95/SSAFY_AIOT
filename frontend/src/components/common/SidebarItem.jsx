import React from 'react';
import './SidebarItem.css';
import Status from './Status';
import TempInfo from './TempInfo';

const SidebarItem = ({ alert, onClick }) => {
  const isCompleteText = alert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = alert.status === 'DONE' ? 'Complete' : 'Caution';

  return (
    <button className="SidebarItem" onClick={onClick}>
      <div className="SidebarItem_Header">
        <div className="SidebarItem_Spot">
          Rack {alert.rackId} - {alert.spotId}
        </div>

        <div className="SidebarItem_StatusGroup">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>

      <div className="SidebarItem_Temp">
        <TempInfo temperature={alert.temperature} />
      </div>

      <div className="SidebarItem_Message">{alert.comment || ''}</div>

      <div className="SidebarItem_Footer">
        <div className="SidebarItem_Admin">{alert.handlerName || ''}</div>
        <div className="SidebarItem_Date">
          {new Date(alert.createdAt).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
};

export default SidebarItem;
