import React from 'react';
import FilterTime from './FilterTime';
import FilterStatusClick from './FilterStatusClick';
import FilterDay from './FilterDay';

import searchIcon from '../../assets/Search.png';

import { useAppStore } from '../../stores/useAppStore';

const IssueFilter = () => {
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const showDangerOnly = useAppStore((state) => state.showDangerOnly);
  const setShowDangerOnly = useAppStore((state) => state.setShowDangerOnly);

  return (
    <div className="flex flex-col px-4 py-2 gap-3">
      <div className="md:text-[17px] text-xs font-bold text-[#eaeaf0] flex-[1] truncate">
        전체 이슈 관리
      </div>
      <div className="flex flex-[1] gap-4 truncate">
        <div className="flex gap-2 w-[25%]">
          <FilterTime />
          <FilterDay />
        </div>
        <div className="flex gap-2 items-center truncate">
          <FilterStatusClick text={'전체'} />
          <FilterStatusClick text={'미확인'} />
          <FilterStatusClick text={'처리 완료'} />
        </div>
      </div>
      <div className="flex gap-3.5 w-[100%]">
        <div className="flex border-b-2 border-[#4b4b4b] gap-2 w-[20%] items-center">
          <img className="w-auto h-auto" src={searchIcon} alt="search icon" />
          <input
            className="text-sm w-[100%] rounded-none outline-0"
            type="text"
            placeholder="검색어를 입력해주세요"
            onChange={(e) => setSearchKeyword(e.target.value)} // 상태 직접 변경
          />
        </div>
        <div className="flex gap-2.5 items-center truncate">
          <label htmlFor="danger">
            <div className="cursor-pointer">
              <input
                className="accent-[#787980]"
                type="checkbox"
                id="danger"
                checked={showDangerOnly}
                onChange={(e) => setShowDangerOnly(e.target.checked)}
              />{' '}
              <span className="truncate">위험 이슈만 보기</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default IssueFilter;
