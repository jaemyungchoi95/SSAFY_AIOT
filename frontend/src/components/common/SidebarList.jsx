import SidebarItem from './SidebarItem';
import './SidebarList.css';
import { useAppStore } from '../../stores/useAppStore';

const SidebarList = ({ selectedStatus, selectedTime }) => {
  const { issues, reports, setSelectedIssueId, selectedWarehouseId } =
    useAppStore();

  const getFilteredIssues = () => {
    let filtered = Array.isArray(issues)
      ? issues.filter((issue) => issue.warehouseId === selectedWarehouseId)
      : [];

    if (selectedStatus === '처리완료') {
      filtered = filtered.filter((issue) => issue.status === 'DONE');
    } else if (selectedStatus === '미확인') {
      filtered = filtered.filter((issue) =>
        ['UNCHECKED', 'Caution'].includes(issue.status),
      );
    } else if (selectedStatus === '위험') {
      filtered = filtered.filter((issue) => issue.isDanger === true);
    }

    // 원본 배열을 수정하지 않도록 복사본을 만들어서 정렬함
    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });
    // 복사하여 정렬한 배열을 반환
    return sorted;
  };

  const filteredIssues = getFilteredIssues();

  return (
    <div className="SidebarList">
      {filteredIssues.map((issue) => {
        const relatedReport = reports
          ? reports.find((report) => report.alertId === issue.alertId)
          : null;
        return (
          <SidebarItem
            key={issue.alertId}
            issue={issue}
            report={relatedReport}
            onClick={() => setSelectedIssueId(issue.alertId)}
          />
        );
      })}
    </div>
  );
};

export default SidebarList;
