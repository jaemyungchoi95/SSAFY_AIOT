import React from 'react';
import './IssuePage.css';
import IssueFilter from '../components/common/IssueFilter';
import IssueContent from '../components/common/IssueContent';

const IssuePage = () => {
  return (
    <div className="IssuePage">
      <div className="IssuePage_header">
        <IssueFilter />
      </div>
      <div className="IssuePage_Content">
        <IssueContent />
      </div>
    </div>
  );
};

export default IssuePage;
