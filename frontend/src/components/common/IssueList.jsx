import React, { useEffect } from 'react';
import './IssueContent.css';
import { useAppStore } from '../../stores/useAppStore';
import { useFilterStore } from '../../stores/useFilterStore';
import IssueItem from './IssueItem';
import IssueModal from './IssueModal';

const IssueList = () => {
  const {
    alerts,
    selectedWarehouseId,
    selectedAlertId,
    setSelectedAlertId,
    searchKeyword,
    showDangerOnly,
    selectedStatusFilter,
  } = useAppStore();
  const selectedAlert = alerts.find((a) => a.alertId === selectedAlertId);

  const { selectedStatus, selectedTime } = useFilterStore();

  useEffect(() => {
    setSelectedAlertId(null);
  }, [setSelectedAlertId]);

  const getFilteredAlerts = () => {
    let filtered = Array.isArray(alerts)
      ? alerts.filter((alert) => alert.warehouseId === selectedWarehouseId)
      : [];

    if (selectedStatusFilter === '미확인') {
      filtered = filtered.filter((alert) => alert.status === 'UNCHECKED');
    } else if (selectedStatusFilter === '처리 완료') {
      filtered = filtered.filter((alert) => alert.status === 'DONE');
    }

    if (showDangerOnly) {
      filtered = filtered.filter((alert) => alert.danger === true);
    }

    if (searchKeyword.trim() !== '') {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter((alert) => {
        const comment = alert.comment?.toLowerCase() || '';
        const handler = alert.handlerName?.toLowerCase() || '';
        return comment.includes(keyword) || handler.includes(keyword);
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="IssueContent">
      <div className="IssueGridWrapper">
        {filteredAlerts.map((alert) => (
          <IssueItem key={alert.alertId} alert={alert} />
        ))}
      </div>
      {selectedAlert && <IssueModal onClose={() => setSelectedAlertId(null)} />}
    </div>
  );
};

export default IssueList;
