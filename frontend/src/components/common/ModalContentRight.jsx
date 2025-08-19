import React, { useEffect } from 'react';
import DetailWrite from './DetailWrite';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import { useAppStore } from '../../stores/useAppStore';
import { useUserStore } from '../../stores/useUserStore';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo';

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
    resetReportFields,
  } = useAppStore();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

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
    resetReportFields();
  };

  const handleEditClick = () => setIsEditing(true);
  const handleWriteClick = () => setIsWritingId(alertDetail.alertId);

  const handleCancel = () => {
    resetReportFields();
    setIsEditing(false);
  };
  const handleCancelWrite = () => {
    resetReportFields();
    setIsWritingId(null);
  };

  if (!alertDetail) return null;

  const isHandled = alertDetail.status === 'DONE';

  const isFormActivate = isEditing || isWritingId === alertDetail.alertId;

  return (
    <div className="Modal_Content_Right flex flex-col h-full">
      <div className="Modal_Content_Right_Title flex font-bold text-2xl mb-2.5 truncate">
        리포트 내용
      </div>
      <div className="Modal_Content_Right_Content flex flex-col gap-1 mb-4 truncate">
        <div className="Modal_Content_Right_Date font-light">
          <DateInfo
            createdAt={alertDetail.createdAt}
            handledAt={alertDetail.handledAt}
          />
        </div>
        <div className="Modal_Content_Right_Temp font-light ml-[-2px]">
          <TempInfo temperature={alertDetail.temperature} />
        </div>
      </div>

      <div className="flex justify-between pr-4 mb-2.5">
        <div className="Modal_Content_Right_Title flex font-bold text-2xl truncate">
          처리 내역
        </div>
        {/* 로그인 상태이고, 수정/작성 중이 아닐 때만 버튼을 보여줍니다. */}
        {isLoggedIn && (
          <div className="Modal_ReportBtnWrapper flex">
            {!isFormActivate ? (
              isHandled ? (
                <ReportBtn text={'수정하기'} onClick={handleEditClick} />
              ) : (
                <ReportBtn text={'작성하기'} onClick={handleWriteClick} />
              )
            ) : (
              <ReportBtn
                text="취소하기"
                onClick={isEditing ? handleCancel : handleCancelWrite}
              />
            )}
          </div>
        )}
      </div>

      <div className="Modal_Content_Right_Content mt-2.5 pr-4">
        {(() => {
          // "수정하기" 모드이거나 "작성하기" 모드일 때 DetailWrite 폼을 보여줍니다.
          if (isEditing || isWritingId === alertDetail.alertId) {
            return (
              <DetailWrite
                alert={alertDetail}
                onSubmit={handleSubmit}
                cname="modal"
              />
            );
          }
          // 처리 완료된 리포트일 경우, 보고서 내용을 보여줍니다.
          if (isHandled) {
            return <SidebarDetailReport alert={alertDetail} />;
          }
          // 처리 전이고, 작성 중도 아닐 경우, 안내 메시지를 보여줍니다.
          return (
            <div className="text-center text-gray-400 py-4">
              처리 내역이 없습니다.
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ModalContentRight;
