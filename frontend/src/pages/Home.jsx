import Map from '../components/common/Map';
import Sidebar from '../components/common/Sidebar';
import './Home.css';
import React from 'react';
import { useState } from 'react';

const Home = () => {
  // const [message, setMessage] = useState("서버에서 응답을 기다리는 중...");

  // useEffect(() => {
  //   axios.get(`${import.meta.env.VITE_REACT_APP_SPRING_BASE_URL}/get`)
  //     .then(response => {
  //       setMessage(response.data);
  //     })
  //     .catch(error => {
  //       console.error('axios 데이터 로딩 에러', error);
  //       setMessage("데이터 불러오기에 실패하였습니다.");
  //     });
  // }, []); // 의존성 배열 꼭 넣기!

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
