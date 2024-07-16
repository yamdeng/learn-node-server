
import AppTable from "@/components/common/AppTable";
import { createListSlice, listBaseState } from "@/stores/slice/listSlice";
import { useEffect } from "react";
import { create } from "zustand";

/* 컬럼 영역 */
const columns: any = [
    { field: "id", headerName: "ID" },
    { field: "createUserId", headerName: "등록자 ID" },
    { field: "updateUserId", headerName: "수정자 ID" },
    { field: "createDate", headerName: "등록일" },
    { field: "updateDate", headerName: "수정일" },
    { field: "isDelete", headerName: "삭제 여부" },
    { field: "name", headerName: "비행기이름" },
    { field: "nameEn", headerName: "비행기영문명" },
    { field: "airCode", headerName: "비행기코드" },
    { field: "countryCode", headerName: "국가코드" },
    { field: "lastPainDate", headerName: "최종비행시간" },
    { field: "lastFixDate", headerName: "최종수리시간" },
    { field: "size", headerName: "크기" },
];

const initListData = {
  ...listBaseState,
  listApiPath: "목록api패스",
  columns: columns,
};

const testStore = create<any>((set, get) => ({
  ...createListSlice(set, get),

  ...initListData,

  clear: () => {
    set(initListData);
  },
}));

function AppTableServerPage2() {
  const state = testStore();
  const { search, list, getColumns } = state;
  const columns = getColumns();

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      {/* 검색 input 영역입니다 */}
      <AppTable
        rowData={list}
        columns={columns}
        store={state}
        useColumnDynamicSetting
      />
    </>
  );
}

export default AppTableServerPage2;
