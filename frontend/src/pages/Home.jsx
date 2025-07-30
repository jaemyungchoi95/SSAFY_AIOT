import { useState } from 'react';
import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';

const Home = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(1);
  const [dangerCnt, setDangerCnt] = useState(0);
  const [cautionCnt, setCautionCnt] = useState(0);

  return (
    <>
      <div className="Home_content">
        <Map
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
          dangerCnt={dangerCnt}
          cautionCnt={cautionCnt}
        />
        <Sidebar
          selectedWarehouse={selectedWarehouse}
          setDangerCnt={setDangerCnt}
          setCautionCnt={setCautionCnt}
        />
      </div>
    </>
  );
};

export default Home;
