import React from 'react';
import './SidebarDetailContent.css';
import { useContext } from 'react';
import { ReportStateContext } from '../../utils/AlertContext';
import FormatDateTime from '../../utils/FormatDateTime';
import BootstrapCarousel from './BootstrapCarousel.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarDetailContent = ({ issue }) => {
  const reports = useContext(ReportStateContext);
  const relatedReport = reports.find((report) => report.issue_id === issue.id);

  const imagePaths = [issue.image_normal_url, issue.image_thermal_url].filter(
    Boolean,
  );

  return (
    <div className="SidebarDetailContent">
      <div className="SidebarDetailContent_Date">
        <img src="/src/assets/Date.png" alt="" />
        <span>
          {relatedReport?.handled_at
            ? FormatDateTime(relatedReport.handled_at)
            : FormatDateTime(issue.created_at)}
        </span>
      </div>
      <div className="SidebarDetailContent_Temp">
        <img src="/src/assets/Temp.png" alt="" />
        <span>{issue.temperature}°C</span>
      </div>
      <div className="SidebarDetailContent_Img">
        <BootstrapCarousel images={imagePaths} />
      </div>
    </div>
  );
};

export default SidebarDetailContent;
