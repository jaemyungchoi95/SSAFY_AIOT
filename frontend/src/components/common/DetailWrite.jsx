import React, { useEffect } from 'react';
import ReportBtn from './ReportBtn';
import { useAppStore } from '../../stores/useAppStore';

const DetailWrite = ({ alert, onSubmit, cname = '' }) => {
  const {
    reportHandlerName,
    reportComment,
    reportItemName,
    setReportHandlerName,
    setReportComment,
    setReportItemName,
    resetReportFields,
  } = useAppStore();

  useEffect(() => {
    if (alert) {
      setReportHandlerName(alert.handlerName || '');
      setReportItemName(alert.itemType || '');
      setReportComment(alert.comment || '');
    } else {
      resetReportFields();
    }
  }, [
    alert,
    setReportHandlerName,
    setReportComment,
    setReportItemName,
    resetReportFields,
  ]);

  // 아이템 타입 입력 추가
  const handleItemNameChange = (e) => {
    setReportItemName(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({
      handlerName: reportHandlerName.trim(),
      itemType: reportItemName.trim(),
      comment: reportComment.trim(),
    });
  };

  return (
    <div className="DetailWrite flex flex-col h-full text-[#dad9df]">
      <div className="DetailWrite_Value flex flex-col flex-1">
        <div className="DetailWrite_Emp flex">
          <div className="DetailWrite_EmpTitle w-[25%] pt-1.5 text-base">작업자</div>
          <textarea
            placeholder="작업자 이름을 입력해 주세요"
            className="DetailWrite_Input DetailWrite_EmpInput h-[30px] w-[100%] border-b-1 border-[#787980] my-1 "
            value={reportHandlerName}
            onChange={(e) => setReportHandlerName(e.target.value)}
          />
        </div>
        <div className="DetailWrite_Item flex">
          <div className="DetailWrite_ItemTitle w-[25%] pt-1.5 text-base">물건명</div>
          <textarea
            name=""
            id=""
            placeholder="물건 종류를 입력해 주세요"
            className="DetailWrite_Input DetailWrite_ItemInput h-[30px] w-[100%] border-b-1 border-[#787980] resize-none my-1"
            value={reportItemName}
            onChange={handleItemNameChange}
          ></textarea>
        </div>
        <div className="DetailWrite_Message flex flex-1">
          <div className="DetailWrite_MessageTitle w-[25%] pt-1.5 text-base">메시지</div>
          <textarea
            placeholder="이슈 상황 및 처리 내용을 입력해 주세요"
            className={`DetailWrite_Input DetailWrite_MessageInput w-full h-[100px] border-b-1 border-[#787980] resize-none my-1 ${cname == 'modal' ? 'h-[295px]' : ''}`}
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
          />
        </div>
      </div>

      <div className="DetailWrite_BtnWrapper flex justify-end mt-2">
        <ReportBtn text="등록하기" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default DetailWrite;
