import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React, { useEffect } from 'react';
import SidebarDetail from '../components/common/SidebarDetail';
import { useAppStore } from '../stores/useAppStore';
import AlertToast from '../components/realtime/AlertToast';
import { useAlertStore } from '../stores/useAlertStore';

const MAX_VISIBLE_ALERTS = 3; //  최대 알림 개수

const Home = () => {
  const { selectedAlertId, setSelectedAlertId, selectedWarehouseId } =
    useAppStore();

  // 알림목록 가져오기
  const socketAlerts = useAlertStore((state) => state.socketAlerts);

  const alertsToDisplay = socketAlerts.slice(-MAX_VISIBLE_ALERTS);

  useEffect(() => {
    setSelectedAlertId(null);
  }, [selectedWarehouseId, setSelectedAlertId]);

  return (
    <>
      <div className="Home_content">
        <div className={`map_area ${selectedAlertId ? 'shrink' : ''}`}>
          <Map />
        </div>

        {selectedAlertId && (
          <div
            className={`sidebar_detail_area ${!selectedAlertId ? 'collapsed' : ''}`}
          >
            <SidebarDetail onClose={() => setSelectedAlertId(null)} />
          </div>
        )}
        <div className="sidebar_area">
          <Sidebar />
        </div>
        {/* 3. 알림 토스트 컨테이너 및 렌더링 */}
        <div className="alert_toast_container">
          {alertsToDisplay.map((alert) => (
            <AlertToast key={alert.alertId} alert={alert} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
