import React from 'react';
import { useAlertStore } from '../../stores/useAlertStore';

const AlertToast = ({ alert }) => {
  const { dismissAlert } = useAlertStore();

  if (!alert) {
    console.warn("AlertToast received an undefined or null 'alert' prop.");
    return null;
  }

  const { alertId, rackId, spotId, isNew } = alert;

  const rackIdentifier = `Rack - ${String(rackId).padStart(2, '0')} - ${String(spotId).padStart(2, '0')}`;

  return (
    <section
      className={`border-2 border-[#FFBC5F] rounded-[15px] w-[400px] h-[80px] flex  gap-1.5 ${isNew ? 'opacity-100' : 'opacity-70'}`}
    >
      <div className="flex items-center justify-center w-[15%]">
        <div className="border-3 border-[#FFBC5F] rounded-full w-[30px] h-[30px] flex justify-center text-center font-bold text-[#FFBC5F]">
          !
        </div>
      </div>
      <div className="w-[70%] flex items-center gap-2">
        <p className="text-[18px] font-bold m-0 p-0">비정상 온도 감지</p>
        <p className="text-[18px] font-medium m-0 p-0 text-[#C2C2C2]">
          {rackIdentifier}
        </p>
      </div>
      <div className="w-[15%] flex justify-center items-center">
        <button
          className="text-[#C2C2C2] !text-3xl m-0 pb-2 text-center"
          onClick={() => dismissAlert(alertId)}
        >
          &times;
        </button>
      </div>
    </section>
  );
};

export default AlertToast;
