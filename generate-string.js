const testGenerateString = `
<% if (framework === 'express') { %>
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, <%= name %>!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
<% } else { %>
console.log('Hello, <%= name %>!');
<% } %>
`;

const listComponentGenerateString = `
import AppTable from "@/components/common/AppTable";
import { createListSlice, listBaseState } from "@/stores/slice/listSlice";
import { useEffect } from "react";
import { create } from "zustand";

/* 컬럼 영역 */
const columns: any = [<% tableColumns.forEach((columnInfo)=> { %>
    { field: "<%= columnInfo.column_name %>", headerName: "<%= columnInfo.column_comment %>" },<% }) %>
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
`;

module.exports = {
  testGenerateString: testGenerateString,
  listComponentGenerateString: listComponentGenerateString,
};
