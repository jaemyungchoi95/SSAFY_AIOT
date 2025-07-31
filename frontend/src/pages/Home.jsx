import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React from 'react';
import SidebarDetail from '../components/common/SidebarDetail';
import { useAppStore } from '../stores/useAppStore';

const Home = () => {
  // contextAPI 대신 useAppStore에서 데이터를 가져옵니다.
  const { issues, reports, selectedIssueId, setSelectedIssueId } =
    useAppStore();

  const selectedIssue = Array.isArray(issues)
    ? issues.find((issue) => issue.id === selectedIssueId)
    : null;

  const relatedReport =
    selectedIssue && Array.isArray(reports)
      ? reports.find((report) => report.alert_id === selectedIssue.id)
      : null;

  return (
    <>
      <div className="Home_content">
        <div className={`map_area ${selectedIssue ? 'shrink' : ''}`}>
          {/* Map 컴포넌트 내에서 직접 store에 접근할 것이기 때문에 props 제거 */}
          <Map />
        </div>

        {selectedIssue && (
          <div className="sidebar_detail_area">
            <SidebarDetail
              issue={selectedIssue}
              report={relatedReport}
              onClose={() => setSelectedIssueId(null)}
            />
          </div>
        )}
        <div className="sidebar_area">
          {/* Sidebar 컴포넌트 내에서 직접 store에 접근할 것이기 때문에 props 제거 */}
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
