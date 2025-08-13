import React from 'react';
import './ModalContentLeft.css';
import TempInfo from './TempInfo';
import DateInfo from './DateInfo';
import { useAppStore } from '../../stores/useAppStore';

const Modal_Content_Left = () => {
  const { alertDetail } = useAppStore();

  if (!alertDetail) {
    // 데이터 없으면 로딩 표시하거나 빈 화면 렌더링
    return <div>로딩 중...</div>;
  }

  return (
    <div className="Modal_Content_Left">
      <div className="Modal_Content_Left_Title">리포트 내용</div>
      <div className="Modal_Content_Left_Date">
        <DateInfo
          createdAt={alertDetail.createdAt}
          handledAt={alertDetail.handledAt}
        />
      </div>
      <div className="Modal_Content_Left_Temp">
        <TempInfo temperature={alertDetail.temperature} />
      </div>
      <div className="Modal_Content_Left_Images">
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            marginBottom: '20px',
          }}
        >
          <img
            src={alertDetail.imageNormalUrl}
            style={{ filter: 'brightness(200%)' }}
            alt=""
          />
          <img
            src={alertDetail.imageThermalUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.45,
              width: '100%',
              height: '100%',
            }}
            alt=""
          />
        </div>
        <img
          src={alertDetail.imageNormalUrl}
          style={{
            filter: 'brightness(200%)',
            marginBottom: '20px',
          }}
          alt="일반 이미지"
        />
        <img src={alertDetail.imageThermalUrl} alt="열화상 이미지" />
      </div>
    </div>
  );
};

export default Modal_Content_Left;
