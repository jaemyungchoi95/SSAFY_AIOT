import React from 'react';
import './SidebarDetailReport.css';
import ReportContent from './ReportContent';
import ReportBtn from './ReportBtn';

const SidebarDetailReport = ({ report }) => {
  return (
    <div className="SidebarDetailReport">
      <div className="SidebarDetailReport_Header">
        <div className="SidebarDetailReport_Title">처리 내역</div>
        <ReportBtn text={'수정하기'} />
      </div>
      <ReportContent report={report} />
    </div>
  );
};

export default SidebarDetailReport;
