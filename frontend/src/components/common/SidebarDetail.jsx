import { useEffect, useState } from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import DetailWrite from './DetailWrite';

const SidebarDetail = ({ issue, report, onClose }) => {

  // const [isWriting, setIsWriting] = useState(false);
  const [isWritingId, setIsWritingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editReport, setEditReport] = useState(null);

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
    setEditReport(null);
  }, [issue]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsWritingId(null);
    setEditReport(relatedReport);
  };

  const handleWriteClick = () => {
    setIsWritingId(issue.id);
    setIsEditing(false);
  };

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader issue={issue} onClose={onClose} />
      <SidebarDetailContent issue={issue} report={report} />
      {report ? (
        isEditing ? (
          <DetailWrite
            issue={issue}
            report={editReport}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <SidebarDetailReport
            report={report}
            onEditClick={handleEditClick}
          />
        )
      ) : isWritingId === issue.id ? (
        <DetailWrite issue={issue} />
      ) : (
        <div className="SidebarDetail_ReportBtnWrapper">
          <ReportBtn text={'작성하기'} onClick={handleWriteClick} />
        </div>
      )}
    </div>
  );
};
export default SidebarDetail;
