import React, { useEffect } from 'react';
import './ModalContentRight.css';
import DetailWrite from './DetailWrite';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import { useAppStore } from '../../stores/useAppStore';

const ModalContentRight = () => {
  const {
    alertDetail,
    isEditing,
    isWritingId,
    setIsEditing,
    setIsWritingId,
    submitAlertReport,
    updateAlertReport,
    setSelectedAlertId,
    fetchDetailAlert,
    selectedAlertId,
  } = useAppStore();

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
    if (selectedAlertId) {
      fetchDetailAlert(selectedAlertId);
    }
  }, [setIsWritingId, setIsEditing, selectedAlertId, fetchDetailAlert]);

  const handleSubmit = (reportData) => {
    if (!alertDetail) return;
    if (alertDetail.status === 'DONE') {
      updateAlertReport(alertDetail.alertId, reportData);
    } else {
      submitAlertReport(alertDetail.alertId, reportData);
    }
    setIsWritingId(null);
    setIsEditing(false);
    setSelectedAlertId(null);
  };

  const handleEditClick = () => setIsEditing(true);
  const handleWriteClick = () => setIsWritingId(alertDetail.alertId);
  const handleCancel = () => setIsEditing(false);
  const handleCancelWrite = () => setIsWritingId(null);

  if (!alertDetail) return null;

  const isHandled = alertDetail.status === 'DONE';

  return (
    <div className="Modal_Content_Right">
      <div className="Modal_Content_Right_Title">처리 내역 등록</div>
      <div className="Modal_Content_Right_Content">
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
          <div className="Modal_ReportBtnWrapper">
            <ReportBtn text="작성하기" onClick={handleWriteClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalContentRight;
