import React from 'react';
import ReportContent from './ReportContent';

const SidebarDetailReport = ({ alert }) => {
  return (
    <div className="SidebarDetailReport">
      <ReportContent alert={alert} />
    </div>
  );
};

export default SidebarDetailReport;
