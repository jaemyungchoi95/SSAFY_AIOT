import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React, { useEffect } from 'react';
import SidebarDetail from '../components/common/SidebarDetail';
import { useAppStore } from '../stores/useAppStore';

const Home = () => {
  // contextAPI 대신 useAppStore에서 데이터를 가져옵니다.
  const { selectedAlertId, setSelectedAlertId, selectedWarehouseId } =
    useAppStore();

  useEffect(() => {
    setSelectedAlertId(null);
  }, [selectedWarehouseId]);

  return (
    <>
      <div className="Home_content">
        <div className={`map_area ${selectedAlertId ? 'shrink' : ''}`}>
          {/* Map 컴포넌트 내에서 직접 store에 접근할 것이기 때문에 props 제거 */}
          <Map />
        </div>

        {selectedAlertId && (
          <div className="sidebar_detail_area">
            <SidebarDetail onClose={() => setSelectedAlertId(null)} />
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
