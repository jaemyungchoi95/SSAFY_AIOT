import React from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import { useContext } from 'react';
import { ReportStateContext } from '../../utils/AlertContext';
import ReportBtn from './ReportBtn';

const SidebarDetail = ({ issue, onClose }) => {
  const reports = useContext(ReportStateContext);
  const relatedReport = reports.find(
    (report) => Number(report.alert_id) === Number(issue.id),
  );

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader issue={issue} onClose={onClose} />
      <SidebarDetailContent issue={issue} />
      {relatedReport ? (
        <SidebarDetailReport report={relatedReport} />
      ) : (
        <ReportBtn text={'작성하기'} />
      )}
    </div>
  );
};
export default SidebarDetail;
