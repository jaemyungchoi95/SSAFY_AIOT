import React from 'react';
import './SidebarDetailReport.css';
import ReportContent from './ReportContent';
import ReportBtn from './ReportBtn';

const SidebarDetailReport = ({ alert, onEditClick }) => {
  return (
    <div className="SidebarDetailReport">
      <div className="SidebarDetailReport_Header">
        <div className="SidebarDetailReport_Title">처리 내역</div>
        <ReportBtn text={'수정하기'} onClick={onEditClick} />
      </div>
      <ReportContent alert={alert} />
    </div>
  );
};

export default SidebarDetailReport;
