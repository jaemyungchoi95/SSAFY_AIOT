import React from 'react';
import './SidebarDetailReport.css';
import ReportContent from './ReportContent';
import ReportBtn from './ReportBtn';
import { useUserStore } from '../../stores/useUserStore';

const SidebarDetailReport = ({ alert, onEditClick }) => {
  const currentUserId = useUserStore((state) => state.userId);
  const isMyPost = currentUserId === alert.writerId;
  return (
    <div className="SidebarDetailReport">
      <div className="SidebarDetailReport_Header">
        <div className="SidebarDetailReport_Title">처리 내역</div>
        {isMyPost && <ReportBtn text={'수정하기'} onClick={onEditClick} />}
      </div>
      <ReportContent alert={alert} />
    </div>
  );
};

export default SidebarDetailReport;
