import React from 'react';
import './IssueContent.css';
import { useAppStore } from '../../stores/useAppStore';
import { useFilterStore } from '../../stores/useFilterStore';
import { useIssueStore } from '../../stores/useIssueStore';
import IssueItem from './IssueItem';
import IssueModal from './IssueModal';

const IssueList = () => {
  const { issues, reports, selectedWarehouseId } = useAppStore();
  const { selectedStatus, selectedTime } = useFilterStore();
  const {
    setSelectedIssue,
    setSelectedReport,
    clearModal,
    selectedIssue,
    selectedReport,
  } = useIssueStore();

  const getFilteredIssues = () => {
    let filtered = Array.isArray(issues)
      ? issues.filter((issue) => issue.warehouse_id === selectedWarehouseId)
      : [];

    if (selectedStatus === '처리완료') {
      filtered = filtered.filter((issue) => issue.status === 'DONE');
    } else if (selectedStatus === '미확인') {
      filtered = filtered.filter((issue) =>
        ['UNCHECKED', 'Caution'].includes(issue.status),
      );
    } else if (selectedStatus === '위험') {
      filtered = filtered.filter((issue) => issue.is_danger === true);
    }

    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  };

  const filteredIssues = getFilteredIssues();

  return (
    <div className="IssueContent">
      <div className="IssueGridWrapper">
        {filteredIssues.map((issue) => (
          <IssueItem key={issue.id} issueId={issue.id} />
        ))}
      </div>
      <IssueModal
        issue={selectedIssue}
        report={selectedReport}
        onClose={clearModal}
      />
    </div>
  );
};

export default IssueList;
