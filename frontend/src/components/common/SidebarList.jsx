import SidebarItem from './SidebarItem';
import './SidebarList.css';
import { useAppStore } from '../../stores/useAppStore';

const SidebarList = ({ selectedStatus, selectedTime }) => {
  const { issues, reports, setSelectedIssueId, selectedWarehouseId } =
    useAppStore();

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

    // 원본 배열을 수정하지 않도록 복사본을 만들어서 정렬함
    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });

    return sorted;
  };

  const filteredIssues = getFilteredIssues();

  // gemini request : 이 컴포넌트는 contextAPI로 관리되는 전역변수인 issue와 alert의 수를 표시하며, SidebarItem의 정보를 리스트업 하여 나열해주는 역할을 합니다.
  return (
    <div className="SidebarList">
      {filteredIssues.map((issue) => {
        const relatedReport = reports
          ? reports.find((report) => report.alert_id === issue.id)
          : null;
        return (
          <SidebarItem
            key={issue.id}
            issue={issue}
            report={relatedReport}
            onClick={() => setSelectedIssueId(issue.id)}
          />
        );
      })}
    </div>
  );
};

export default SidebarList;
