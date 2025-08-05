import React from 'react';
import './SidebarDetailContent.css';
import FormatDateTime from '../../utils/FormatDateTime';
import BootstrapCarousel from './BootstrapCarousel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarDetailContent = ({ alert }) => {
  const imagePaths = [alert.imageNormalUrl, alert.imageThermalUrl].filter(
    Boolean,
  );

  return (
    <div className="SidebarDetailContent">
      <div className="SidebarDetailContent_Date">
        <img src="/src/assets/Date.png" alt="" />
        <span>
          {alert?.handledAt
            ? FormatDateTime(alert.handledAt)
            : FormatDateTime(alert.createdAt)}
        </span>
      </div>
      <div className="SidebarDetailContent_Temp">
        <img src="/src/assets/Temp.png" alt="" />
        <span>{alert.temperature}°C</span>
      </div>
      <div className="SidebarDetailContent_Img">
        <BootstrapCarousel images={imagePaths} />
      </div>
    </div>
  );
};

export default SidebarDetailContent;
