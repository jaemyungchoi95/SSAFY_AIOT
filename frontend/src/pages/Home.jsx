import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React, { useEffect } from 'react';
import SidebarDetail from '../components/common/SidebarDetail';
import { useAppStore } from '../stores/useAppStore';

const Home = () => {
  const { selectedAlertId, setSelectedAlertId, selectedWarehouseId } =
    useAppStore();

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
      </div>
    </>
  );
};

export default Home;
