import React from 'react';
import { useAlertStore } from '../../stores/useAlertStore';

const AlertToast = ({ alert }) => {
  const { dismissAlert } = useAlertStore();

  if (!alert) {
    return null;
  }

  const { alertId, rackId, spotId } = alert;

  const rackIdentifier = `Rack - ${String(rackId).padStart(2, '0')} - ${String(spotId).padStart(2, '0')}`;

  return (
    <section
      className={
        'bg-[#5B5C67] border-2 border-[#FFBC5F] rounded-[15px] w-70 max-w-[400px] h-16 flex items-center gap-2 px-2'
      }
    >
      <div className="flex-shrink-0 px-2">
        <div className="border-[3px] border-[#FFBC5F] rounded-full w-[30px] h-[30px] flex justify-center text-center font-bold text-[#FFBC5F] px-2">
          !
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <p className="text-sm md:text-base font-bold m-0 p-0 truncate">
          비정상 온도 감지
        </p>
        <p className="text-xs md:text-sm font-medium m-0 p-0 text-[#C2C2C2] truncate">
          {rackIdentifier}
        </p>
      </div>
      <div className="flex-shrink-0 px-2">
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
