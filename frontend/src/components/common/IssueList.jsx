import React, { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { useFilterStore } from '../../stores/useFilterStore';
import IssueItem from './IssueItem';
import IssueModal from './IssueModal';

const IssueList = () => {
  const {
    alerts,
    selectedAlertId,
    setSelectedAlertId,
    searchKeyword,
    showDangerOnly,
    selectedStatusFilter,
    fetchWholeWarehouseAlerts,
  } = useAppStore();

  const { selectedTime, selectedDayRange } = useFilterStore();

  // 초기 알림 데이터 가져오기
  useEffect(() => {
    setSelectedAlertId(null);
    fetchWholeWarehouseAlerts();
  }, [setSelectedAlertId, fetchWholeWarehouseAlerts]);

  // 선택된 알림 모달용
  const selectedAlert = Array.isArray(alerts)
    ? alerts.find((a) => a.alertId === selectedAlertId)
    : null;

  // 필터링 함수
  const getFilteredAlerts = () => {
    if (!Array.isArray(alerts)) return [];

    let filtered = [...alerts];

    // 1. 날짜 필터
    if (selectedDayRange) {
      filtered = filtered.filter((alert) => {
        const alertDate = new Date(alert.createdAt);
        return alertDate >= selectedDayRange;
      });
    }

    // 2. 상태 필터
    if (selectedStatusFilter === '미확인') {
      filtered = filtered.filter((alert) => alert.status === 'UNCHECKED');
    } else if (selectedStatusFilter === '처리 완료') {
      filtered = filtered.filter((alert) => alert.status === 'DONE');
    }

    // 3. 위험 필터
    if (showDangerOnly) {
      filtered = filtered.filter((alert) => alert.danger === true);
    }

    // 4. 키워드 검색
    if (searchKeyword.trim() !== '') {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter((alert) => {
        const comment = alert.comment?.toLowerCase() || '';
        const handler = alert.handlerName?.toLowerCase() || '';
        return comment.includes(keyword) || handler.includes(keyword);
      });
    }

    // 5. 정렬
    filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="IssueContent p-3 h-[100%] overflow-y-auto scrollbar-none">
      <div className="IssueGridWrapper grid grid-cols-4 gap-3 w-[100%]">
        {filteredAlerts.map((alert) => (
          <IssueItem key={alert.alertId} alert={alert} />
        ))}
      </div>

      {selectedAlert && <IssueModal onClose={() => setSelectedAlertId(null)} />}
    </div>
  );
};

export default IssueList;
