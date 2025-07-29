import React, { useEffect } from 'react'
import SidebarItem from './SidebarItem'
import './SidebarList.css'
import { useContext } from 'react'
import { AlertStateContext, ReportStateContext } from '../../utils/AlertContext'

const SidebarList = ({selectedWarehouse, selectedStatus, selectedTime, setDangerCnt, setCautionCnt}) => {
  const issues = useContext(AlertStateContext)
  const reports = useContext(ReportStateContext)

  const getFilteredIssues = () => {
    let filtered = issues.filter(issue => issue.warehouse_id === selectedWarehouse);

    if (selectedStatus === '처리완료') {
      filtered = filtered.filter(issue => issue.status === 'DONE');
    } else if (selectedStatus === '미확인') {
      filtered = filtered.filter(issue => ['UNCHECKED', 'Caution'].includes(issue.status));
    } else if (selectedStatus === '위험') {
      filtered = filtered.filter(issue => issue.is_danger === true);
    }

    filtered.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return selectedTime === '최신순' ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  }

  const filteredIssues = getFilteredIssues();

  useEffect(() => {
    const danger = filteredIssues.filter(issue => issue.is_danger === true).length;
    const caution = filteredIssues.filter(issue => issue.status === 'UNCHECKED').length;

    setDangerCnt(danger);
    setCautionCnt(caution);
  }, [issues, selectedWarehouse, selectedStatus, setDangerCnt, setCautionCnt]);

  return (
    <div>
      {filteredIssues.map(issue => {
        const relatedReport = reports ? reports.find(report => report.alert_id === issue.id) : null;
        return (
          <SidebarItem
            key={issue.id}
            issue={issue}
            report={relatedReport}
          />
        );
      })}
    </div>
  )
}

export default SidebarList
