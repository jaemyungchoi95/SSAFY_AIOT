import React from 'react';
import Status from './Status';
import TempInfo from './TempInfo';
import { useAppStore } from '../../stores/useAppStore';

const IssueItem = ({ alert }) => {
  const { setSelectedAlertId } = useAppStore();

  const isCompleteText = alert.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = alert.status === 'DONE' ? 'Complete' : 'Caution';

  const handleClick = () => {
    setSelectedAlertId(alert.alertId);
  };

  return (
    <button
      className="IssueItem flex flex-col px-4 py-3 bg-[#32343f] cursor-pointer !rounded-2xl h-44 hover:bg-[#444653]"
      onClick={handleClick}
    >
      <div className="IssueItem_Header flex justify-between items-center mb-2">
        <span className="IssueItem_Spot font-bold text-xl truncate">
          Rack {alert.rackId} - {alert.spotId}
        </span>

        {/* danger가 true면 두 개의 Status를 보여줌 */}
        <div className="IssueItem_StatusGroup truncate">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>
      <div className="IssueItem_Temp flex justify-between text-[#c2c2c2] truncate">
        <TempInfo temperature={alert.temperature} />
        <div className="IssueItem_Date">
          {new Date(alert.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="IssueItem_Message flex mt-2 text-left h-[50%] overflow-hidden">
        {alert?.comment || <br />}
      </div>
    </button>
  );
};

export default IssueItem;
