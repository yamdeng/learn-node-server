import AppTable from "@/components/common/AppTable";
import { createListSlice, listBaseState } from "@/stores/slice/listSlice";
import { useEffect } from "react";
import { create } from "zustand";

/* 컬럼 영역 */
const columns: any = [
  <% tableColumns.forEach((columnInfo)=> { %>
    { field: "<%= columnInfo.column_name %>", headerName: "<%= columnInfo.column_comment %>" }
  <% }) %>
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
