import { useEffect } from 'react';
import SidebarDetailHeader from './SidebarDetailHeader';
import SidebarDetailContent from './SidebarDetailContent';
import SidebarDetailReport from './SidebarDetailReport';
import ReportBtn from './ReportBtn';
import DetailWrite from './DetailWrite';
import { useAppStore } from '../../stores/useAppStore';
import { useUserStore } from '../../stores/useUserStore';

const SidebarDetail = ({ onClose }) => {
  const {
    alertDetail,
    isEditing,
    isWritingId,
    setIsEditing,
    setIsWritingId,
    submitAlertReport,
    updateAlertReport,
    setSelectedAlertId,
    resetReportFields,
  } = useAppStore();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  useEffect(() => {
    setIsWritingId(null);
    setIsEditing(false);
    // [alertDetail, setIsWritingId, setIsEditing]
  }, [setIsWritingId, setIsEditing]);

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
    <div className="SidebarDetail bg-[#20212a] rounded-2xl h-[100%] text-[#eaeaf0] overflow-y-auto scrollbar-none">
      <SidebarDetailHeader alert={alertDetail} onClose={onClose} />
      <SidebarDetailContent alert={alertDetail} />

      <div className="flex justify-between items-center px-3">
        <div className="flex font-bold text-xl">처리 내역</div>
        {/* 로그인 상태이고, 수정/작성 중이 아닐 때만 버튼을 보여줍니다. */}
        {isLoggedIn && (
          <div className="flex">
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

      <div className="px-3 mt-2.5">
        {(() => {
          // "수정하기" 모드이거나 "작성하기" 모드일 때 DetailWrite 폼을 보여줍니다.
          if (isEditing || isWritingId === alertDetail.alertId) {
            return <DetailWrite alert={alertDetail} onSubmit={handleSubmit} />;
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

export default SidebarDetail;
