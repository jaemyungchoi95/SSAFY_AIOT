import { useState } from 'react';
import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React from 'react';
import { useState } from 'react';
import SidebarDetail from '../components/common/SidebarDetail';

const Home = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(1);
  const [dangerCnt, setDangerCnt] = useState(0);
  const [cautionCnt, setCautionCnt] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <>
      <div className="Home_content">
        <div className={`map_area ${selectedIssue ? 'shrink' : ''}`}>
          <Map
            selectedWarehouse={selectedWarehouse}
            setSelectedWarehouse={setSelectedWarehouse}
            dangerCnt={dangerCnt}
            cautionCnt={cautionCnt}
          />
        </div>

        {selectedIssue && (
          <div className="sidebar_detail_area">
            <SidebarDetail
              issue={selectedIssue}
              onClose={() => setSelectedIssue(null)}
            />
          </div>
        )}
        <div className="sidebar_area">
          <Sidebar
            selectedWarehouse={selectedWarehouse}
            setDangerCnt={setDangerCnt}
            setCautionCnt={setCautionCnt}
            setSelectedIssue={setSelectedIssue}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
