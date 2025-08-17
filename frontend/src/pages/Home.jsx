import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React, { useEffect } from 'react';
import SidebarDetail from '../components/common/SidebarDetail';
import { useAppStore } from '../stores/useAppStore';
import AlertToast from '../components/realtime/AlertToast';
import { useAlertStore } from '../stores/useAlertStore';
import MapToast from '../components/realtime/MapToast';
import { useGlobalSubscription } from '../hooks/useGlobalSubscription';
import { useWarehouseSubscription } from '../hooks/useWarehouseSubscription';
import { useRobotStore } from '../stores/useRobotStore';

const Home = () => {
  const { selectedAlertId, setSelectedAlertId, selectedWarehouseId } =
    useAppStore();

  // 알림목록 가져오기
  const socketAlerts = useAlertStore((state) => state.socketAlerts);
  const addSocketAlert = useAlertStore((state) => state.addSocketAlert);
  const socketMaps = useAlertStore((state) => state.socketMaps);
  const setRobotPosition = useRobotStore((state) => state.setRobotPosition);
  const resetRobotState = useRobotStore((state) => state.resetRobotState);

  // const addSocketMap = useAlertStore((state) => state.addSocketMap); // 테스트용

  // 전체 맵 구독
  useGlobalSubscription();

  // 창고별 맵 구독
  useWarehouseSubscription({
    warehouseId: selectedWarehouseId,
    onPosition: setRobotPosition,
    onAlert: addSocketAlert,
  });

  const mapsToDisplay = socketMaps.slice(-1);

  useEffect(() => {
    setSelectedAlertId(null);
    resetRobotState();
  }, [selectedWarehouseId, setSelectedAlertId, resetRobotState]);
  /*
  // // 맵 알림 테스트용 데이터 핸들러
  const mapTest = {
    warehouseId: 1,
    createdAt: '2024-01-15T10:30:00',
  };

  // 맵 알림 테스트 버튼 클릭 핸들러
  const handleAddMapTest = () => {
    addSocketMap(mapTest);
  };

  // Alert 테스트 버튼 클릭 핸들러
  // AlertToast 테스트용 버튼 핸들러
  const handleAddAlertTest = () => {
    const testAlert = {
      alertId: `alert-${Date.now()}`, // 매번 고유한 ID 생성
      rackId: Math.floor(Math.random() * 10) + 1,
      spotId: Math.floor(Math.random() * 20) + 1,
    };
    addSocketAlert(testAlert);
  };

  // // 로봇 마커 테스트용 버튼 핸들러
  const handleAddRobotTest = () => {
    // 테스트용 가상 로봇 데이터 생성
    // x, y 좌표는 실제 맵의 좌표 범위 내에서 테스트해야 정확하게 보입니다.
    const testRobot = {
      robotId: 1, // 테스트할 로봇 ID
      x: Math.random() * 150, // 맵 크기에 맞는 임의의 x 좌표
      y: Math.random() * 250, // 맵 크기에 맞는 임의의 y 좌표
      theta: Math.random() * 360, // 임의의 로봇 방향 (0-360도)
    };

    console.log('테스트 로봇 위치 업데이트:', testRobot);
    setRobotPosition(testRobot);
  };
*/
  return (
    <>
      <div className="Home_content">
        {/* map_area */}
        <div className={`map_area ${selectedAlertId ? 'shrink' : ''}`}>
          <Map />
        </div>

        {selectedAlertId && (
          <div className={'sidebar_detail_area'}>
            <SidebarDetail onClose={() => setSelectedAlertId(null)} />
          </div>
        )}
        <div className="sidebar_area">
          <Sidebar />
        </div>
        {/* 3. 알림 토스트 컨테이너 및 렌더링 */}
        <div className="alert_toast_container ">
          {socketAlerts.map((alert) => (
            <AlertToast key={alert.alertId} alert={alert} />
          ))}
        </div>
        <div className="map_toast_container">
          {mapsToDisplay.map((map) => (
            <MapToast key={map.id} map={map} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
/* 테스트 버튼들
<button
        onClick={handleAddMapTest}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        맵 생성 알림 테스트
      </button>
      <button
        onClick={handleAddAlertTest}
        style={{ position: 'fixed', top: '60px', right: '20px', zIndex: 9999 }}
      >
        위험 알림 테스트
      </button>
      <button
        onClick={handleAddRobotTest}
        style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 9999 }}
      >
        로봇 위치 테스트
      </button>
*/
