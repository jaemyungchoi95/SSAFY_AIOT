import React from 'react';
import './IssueItem.css';
import Status from './Status';
import { useIssueStore } from '../../stores/useIssueStore';
import { useAppStore } from '../../stores/useAppStore';
import TempInfo from './TempInfo';

const IssueItem = ({ issueId }) => {
  const { issues, reports } = useAppStore();
  const { setSelectedIssue, setSelectedReport } = useIssueStore();

  const issue = issues?.find((i) => i.id === issueId);
  const report = reports?.find((r) => r.alert_id === issueId);

  if (!issue) return null;

  const isCompleteText = issue.status === 'DONE' ? '처리완료' : '미확인';
  const isCompleteType = issue.status === 'DONE' ? 'Complete' : 'Caution';

  const handleClick = () => {
    setSelectedIssue(issue);
    setSelectedReport(report);
  };

  return (
    <button className="IssueItem" onClick={handleClick}>
      <div className="IssueItem_Header">
        <span className="IssueItem_Spot">Rack-{issue.rack_id}</span>
        <Status
          text={issue.is_danger ? '위험' : isCompleteText}
          type={issue.is_danger ? 'Danger' : isCompleteType}
        />
      </div>
      <div className="IssueItem_Temp">
        <TempInfo temperature={issue.temperature} />
      </div>
      <div className="IssueItem_Message">{report?.comment || <br />}</div>
      <div className="IssueItem_Footer">
        <div className="IssueItem_Admin">{report?.handler_name || ''}</div>
        <div className="IssueItem_Date">
          {new Date(
            report?.handled_at || issue.created_at,
          ).toLocaleDateString()}
        </div>
      </div>
    </button>
  );
};

export default IssueItem;
