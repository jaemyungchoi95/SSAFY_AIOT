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
    alerts,
    selectedAlertId,
    isEditing,
    isWritingId,
    setIsEditing,
    setIsWritingId,
    submitAlertReport,
  } = useAppStore();

  const selectedAlert = Array.isArray(alerts)
    ? alerts.find((alert) => alert.alertId === selectedAlertId)
    : null;

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
  }, [selectedAlert, setIsWritingId, setIsEditing]);

  const handleSubmit = (reportData) => {
    if (selectedAlert) {
      submitAlertReport(selectedAlert.alertId, reportData);
      setIsWritingId(null);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleWriteClick = () => setIsWritingId(selectedAlert.alertId);
  const handleCancel = () => setIsEditing(false);
  const handleCancelWrite = () => setIsWritingId(null);

  if (!selectedAlert) return null;

  const isHandled = selectedAlert.status === 'DONE';

  return (
    <div className="SidebarDetail">
      <SidebarDetailHeader alert={selectedAlert} onClose={onClose} />
      <SidebarDetailContent alert={selectedAlert} />
      {isHandled ? (
        isEditing ? (
          <div className="SidebarDetail_Write">
            <DetailWrite
              alert={selectedAlert}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div className="SidebarDetail_Report">
            <SidebarDetailReport
              alert={selectedAlert}
              onEditClick={handleEditClick}
            />
          </div>
        )
      ) : isWritingId === selectedAlert.alertId ? (
        <div className="SidebarDetail_Write">
          <DetailWrite
            alert={selectedAlert}
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
