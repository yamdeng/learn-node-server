import AppTable from "@/components/common/AppTable";
import { createListSlice, listBaseState } from "@/stores/slice/listSlice";
import { useEffect } from "react";
import { create } from "zustand";

// 파일명은 테이블명 기준으로 {tableName}List.tsx

// 1.컬럼명, 2.컬럼주석명, 3.columntype, 4.null 허용여부, 5.null 허용여부를 필터해서 넣어줌

/* 해당 영역은 db 메타 정보 기준으로 반영*/
const columns: any = [
  { field: "id", headerName: "Id" },
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Nameen" },
  { field: "email", headerName: "Email" },
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

  /*

    <SearchInput />을 공통으로 하였을 경우에 어느 정도 효율이 날지 고민
     -

  */

  // TODO : state value를 state[name] 방식으로 접근이 가능한지 확인하기
  // const inputList = [
  //   { type: 'text', name: 'apiKeyName1' },
  //   { type: 'code', groupCodeId: 'groupCd' },
  //   { type: 'userSearch', name: 'apiKeyName2' },
  //   { type: 'userSearchId', name: 'apiKeyName2' },
  //   { type: 'deptSearch', name: 'apiKeyName2' },
  //   { type: 'deptSearchId', name: 'apiKeyName2' },
  //   { type: 'custom', name: 'apiKeyName2', customComponent: <span>aaa</span> },
  // ];

  // 2차원 배열로 할지 여부 검토 필요

  return (
    <>
      <SearchInput inputList={[]} store={state} />
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
