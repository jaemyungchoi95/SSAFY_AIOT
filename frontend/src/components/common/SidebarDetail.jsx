import { useEffect } from 'react';
import './SidebarDetail.css';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import DetailWrite from './DetailWrite';
import { useAppStore } from '../../stores/useAppStore';

const SidebarDetail = ({ onClose }) => {
  const {
    alertDetail,
    isEditing,
    isWritingId,
    setIsEditing,
    setIsWritingId,
    submitAlertReport,
  } = useAppStore();

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
  }, [alertDetail, setIsWritingId, setIsEditing]);

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
  const handleCancelWrite = () => setIsWritingId(null);

  if (!alertDetail) return null;

  const isHandled = alertDetail.status === 'DONE';

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader alert={alertDetail} onClose={onClose} />
      <SidebarDetailContent alert={alertDetail} />
      {isHandled ? (
        isEditing ? (
          <div className="SidebarDetail_Write">
            <DetailWrite
              alert={alertDetail}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="SidebarDetail_Report">
            <SidebarDetailReport
              alert={alertDetail}
              onEditClick={handleEditClick}
            />
          </div>
        )
      ) : isWritingId === alertDetail.alertId ? (
        <div className="SidebarDetail_Write">
          <DetailWrite
            alert={alertDetail}
            onSubmit={handleSubmit}
            onCancel={handleCancelWrite}
          />
        </div>
      ) : (
        <div className="SidebarDetail_ReportBtnWrapper">
          <ReportBtn text={'작성하기'} onClick={handleWriteClick} />
        </div>
      )}
    </div>
  );
};

export default SidebarDetail;
