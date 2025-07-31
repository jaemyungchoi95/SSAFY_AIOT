import React from 'react';
import './SidebarItem.css';
import Status from './Status';

const SidebarItem = ({ issue, report, onClick }) => {
  const isCompleteText = issue.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = issue.status === 'DONE' ? 'Complete' : 'Caution';

  return (
    <button className="SidebarItem" onClick={onClick}>
      <div className="SidebarItem_Header">
        <div className="SidebarItem_Spot">Rack-{issue.rack_id}</div>
        <Status
          text={issue.is_danger ? '위험' : isCompleteText}
          type={issue.is_danger ? 'Danger' : isCompleteType}
        />
      </div>
      <div className="SidebarItem_Temp">
        <img
          src="../../src/assets/Temp.png"
          alt=""
          className="SidebarItem_TempIcon"
        />
        <span className="SidebarItem_TempValue">{issue.temperature}°C</span>
      </div>
      <div className="SidebarItem_Message">{report ? report.comment : ''}</div>
      <div className="SidebarItem_Footer">
        <div className="SidebarItem_Admin">
          {report ? report.handler_name : ''}
        </div>
        <div className="SidebarItem_Date">
          {report
            ? new Date(report.handled_at).toLocaleDateString()
            : new Date(issue.created_at).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
};

export default SidebarItem;
