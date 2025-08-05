import React from 'react';
import './IssueFilter.css';
import FilterTime from './FilterTime';
import FilterStatusClick from './FilterStatusClick';
import FilterDay from './FilterDay';

const IssueFilter = () => {
  return (
    <div className="IssueFilter">
      <div className="IssueFilter_Title">전체 이슈 관리</div>
      <div className="Dropdown_Filter">
        <div className="Dropdown_Filter_Left">
          <FilterTime />
          <FilterDay />
        </div>
        <div className="Dropdown_Filter_Right">
          <FilterStatusClick text={'전체'} />
          <FilterStatusClick text={'미확인'} />
          <FilterStatusClick text={'처리 완료'} />
        </div>
      </div>
      <div className="Searh_Filter">
        <div className="Search_Filter_Left">
          <img src="../../src/assets/Search.png" alt="search icon" />
          <input type="text" placeholder="검색어를 입력해주세요" />
        </div>
        <div className="Search_Filter_Right">
          <FilterStatusClick text={'검색'} />
          <label htmlFor="danger">
            <div className="Search_Filter_Checkbox">
              <input type="checkbox" id="danger" /> 위험 이슈만 보기
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default IssueFilter;
