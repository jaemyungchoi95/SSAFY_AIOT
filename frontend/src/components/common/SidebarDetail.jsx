import { useEffect, useState } from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import DetailWrite from './DetailWrite';
import { useAppStore } from '../../stores/useAppStore';

const SidebarDetail = ({ onClose }) => {
  const { issues, reports, selectedIssueId } = useAppStore();

  const [isWritingId, setIsWritingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editReport, setEditReport] = useState(null);

  // 👇 데이터 계산 로직을 Home에서 여기로 가져옵니다.
  const selectedIssue = Array.isArray(issues)
    ? issues.find((issue) => issue.alertId === selectedIssueId)
    : null;

  const relatedReport =
    selectedIssue && Array.isArray(reports)
      ? reports.find((report) => report.alertId === selectedIssue.alertId)
      : null;

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
    setEditReport(null);
  }, [selectedIssue]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsWritingId(null);
    setEditReport(relatedReport);
  };

  const handleWriteClick = () => {
    setIsWritingId(selectedIssue.alertId);
    setIsEditing(false);
  };

  if (!selectedIssue) {
    return null;
  }

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader issue={selectedIssue} onClose={onClose} />
      <SidebarDetailContent issue={selectedIssue} report={relatedReport} />
      {relatedReport ? (
        isEditing ? (
          <DetailWrite
            issue={selectedIssue}
            report={editReport}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <SidebarDetailReport
            report={relatedReport}
            onEditClick={handleEditClick}
          />
        )
      ) : isWritingId === selectedIssue.alertId ? (
        <DetailWrite issue={selectedIssue} />
      ) : (
        <div className="SidebarDetail_ReportBtnWrapper">
          <ReportBtn text={'작성하기'} onClick={handleWriteClick} />
        </div>
      )}
    </div>
  );
};
export default SidebarDetail;
