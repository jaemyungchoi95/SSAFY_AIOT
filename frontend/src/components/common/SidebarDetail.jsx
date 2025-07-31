import React from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';

const SidebarDetail = ({ issue, report, onClose }) => {
  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader issue={issue} onClose={onClose} />
      <SidebarDetailContent issue={issue} report={report} />
      {report ? (
        <SidebarDetailReport report={report} />
      ) : (
        <ReportBtn text={'작성하기'} />
      )}
    </div>
  );
};
export default SidebarDetail;
