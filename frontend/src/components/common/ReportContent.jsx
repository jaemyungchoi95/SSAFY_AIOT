import React from 'react';
import formatDateTime from '../../utils/FormatDateTime';

const ReportContent = ({ alert }) => {
  return (
    <div className="SidebarDetailReport_Content flex flex-col text-[#c2c2c2] gap-2">
      <div className="SidebarDetailReport_Ad flex gap-2">
        <div className="SidebarDetailReport_Ad_Title font-bold truncate">
          {' '}
          담당자{' '}
        </div>
        <div className="SidebarDetailReport_Ad_Name truncate">
          {' '}
          {alert.userName}{' '}
        </div>
      </div>
      <div className="SidebarDetailReport_Emp flex gap-2">
        <div className="SidebarDetailReport_Emp_Title font-bold truncate">
          {' '}
          작업자{' '}
        </div>
        <div className="SidebarDetailReport_Emp_Name truncate">
          {alert.handlerName}
        </div>
      </div>
      <div className="SidebarDetailReport_Item flex gap-2">
        <div className="SidebarDetailReport_Item_Title font-bold truncate">
          {' '}
          물건명{' '}
        </div>
        <div className="SidebarDetailReport_Item_Name truncate">
          {alert.itemType}
        </div>
      </div>
      <div className="SidebarDetailReport_Time flex gap-2">
        <div className="SidebarDetailReport_Time_Title font-bold truncate">
          {' '}
          작성 시간{' '}
        </div>
        <div className="SidebarDetailReport_Time_Value truncate">
          {formatDateTime(alert.handledAt)}
        </div>
      </div>
      <div className="SidebarDetailReport_Message text-[#dad9df] leading-6">
        <div className="SidebarDetailReport_Message_Value">{alert.comment}</div>
      </div>
    </div>
  );
};

export default ReportContent;
