import React from 'react';
import './IssueItem.css';
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
    <button className="IssueItem" onClick={handleClick}>
      <div className="IssueItem_Header">
        <span className="IssueItem_Spot">
          Rack {alert.rackId} - {alert.spotId}
        </span>

        {/* danger가 true면 두 개의 Status를 보여줌 */}
        <div className="IssueItem_StatusGroup">
          {alert.danger && <Status text="위험" type="Danger" />}
          <Status text={isCompleteText} type={isCompleteType} />
        </div>
      </div>
      <div className="IssueItem_Temp">
        <TempInfo temperature={alert.temperature} />
      </div>
      <div className="IssueItem_Message">{alert?.comment || <br />}</div>
      <div className="IssueItem_Footer">
        <div className="IssueItem_Admin">{alert?.handlerName || ''}</div>
        <div className="IssueItem_Date">
          {new Date(alert.createdAt).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
};

export default IssueItem;
