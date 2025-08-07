import React, { useEffect } from 'react';
import './ModalContentRight.css';
import DetailWrite from './DetailWrite';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import { useAppStore } from '../../stores/useAppStore';

const ModalContentRight = () => {
  const {
    alerts,
    selectedAlertId,
    submitAlertReport,
    isWritingId,
    setIsWritingId,
    isEditing,
    setIsEditing,
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
    <div className="Modal_Content_Right">
      <div className="Modal_Content_Right_Title">처리 내역 등록</div>
      <div className="Modal_Content_Right_Content">
        {isHandled ? (
          isEditing ? (
            <DetailWrite
              alert={selectedAlert}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <SidebarDetailReport
              alert={selectedAlert}
              onEditClick={handleEditClick}
            />
          )
        ) : isWritingId === selectedAlert.alertId ? (
          <DetailWrite
            alert={selectedAlert}
            onSubmit={handleSubmit}
            onCancel={handleCancelWrite}
          />
        ) : (
          <div className="Modal_ReportBtnWrapper">
            <ReportBtn text="작성하기" onClick={handleWriteClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalContentRight;
