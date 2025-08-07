import { useEffect, useState } from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import DetailWrite from './DetailWrite';
import { useAppStore } from '../../stores/useAppStore';

const SidebarDetail = ({ onClose }) => {
  const { alertDetail, submitAlertReport } = useAppStore();

  const [isWritingId, setIsWritingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
  }, [alertDetail]);

  const handleSubmit = (reportData) => {
    if (alertDetail) {
      submitAlertReport(alertDetail.alertId, reportData);

      setIsWritingId(null);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleWriteClick = () => setIsWritingId(alertDetail.alertId);
  const handleCancel = () => setIsEditing(false);
  const handleCancelWrite = () => setIsWritingId(false);

  if (!alertDetail) return null;

  const isHandled = alertDetail.status === 'DONE';

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader alert={alertDetail} onClose={onClose} />
      <SidebarDetailContent alert={alertDetail} />
      {isHandled ? (
        isEditing ? (
          <DetailWrite
            alert={alertDetail}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <SidebarDetailReport
            alert={alertDetail}
            onEditClick={handleEditClick}
          />
        )
      ) : isWritingId === alertDetail.alertId ? (
        <DetailWrite
          alert={alertDetail}
          onSubmit={handleSubmit}
          onCancel={handleCancelWrite}
        />
      ) : (
        <div className="SidebarDetail_ReportBtnWrapper">
          <ReportBtn text={'작성하기'} onClick={handleWriteClick} />
        </div>
      )}
    </div>
  );
};
export default SidebarDetail;
