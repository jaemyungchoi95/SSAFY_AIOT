import React from 'react';
import Status from './Status';
import TempInfo from './TempInfo';

const SidebarItem = ({ alert, onClick }) => {
  const isCompleteText = alert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = alert.status === 'DONE' ? 'Complete' : 'Caution';

  return (
    <button
      className="SidebarItem flex flex-col px-2.5 py-2.5 border-b-[3px] h-32 border-[#33333c] hover:bg-[#444653] cursor-pointer"
      onClick={onClick}
    >
      <div className="SidebarItem_Header flex justify-between items-center text-base mb-2">
        <div className="SidebarItem_Spot font-bold text-xl truncate">
          Rack {alert.rackId} - {alert.spotId}
        </div>

        <div className="SidebarItem_StatusGroup">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>

      <div className="SidebarItem_Temp flex justify-between text-[#c2c2c2]">
        <TempInfo temperature={alert.temperature} />
        <div className="SidebarItem_Date">
          {new Date(alert.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="SidebarItem_Message flex mt-2.5 text-left line-clamp-3">
        {alert.comment || ''}
      </div>
    </button>
  );
};

export default SidebarItem;
