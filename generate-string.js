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

/* zustand store 생성 */
const <%= storeName %> = create<any>((set, get) => ({
  ...createListSlice(set, get),

  ...initListData,

  clear: () => {
    set(initListData);
  },
}));

function <%= fileName %>() {
  const state = <%= storeName %>();
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
      />
    </>
  );
}

export default <%= fileName %>;
`;

const formStoreGenerateString = `
import { create } from "zustand";
import { formBaseState, createFormSliceYup } from "@/stores/slice/formSlice";
import * as yup from "yup";

/* yup validation */
const yupFormSchema = yup.object({<% tableColumns.forEach((columnInfo)=> { %>
  <%= columnInfo.column_name %>: yup.<%= columnInfo.yupType %>,<% }) %>
});

/* form 초기화 */
const initFormData = {
  ...formBaseState,

  requiredFields: [<% requiredFieldList.forEach((fieldName)=> { %>"<%= fieldName %>", <% }) %>],
  <% tableColumns.forEach((columnInfo)=> { %>
  <%= columnInfo.column_name %>: <%- columnInfo.formInitValue %>,<% }) %>
};

/* zustand store 생성 */
const <%= fileName %> = create<any>((set, get) => ({
  ...createFormSliceYup(set, get),

  ...initFormData,

  yupFormSchema: yupFormSchema,

  save: () => {
    const { validate, getApiParam } = get();
    if (validate()) {
      const apiParam = getApiParam();
    }
  },

  clear: () => {
    set(initFormData);
  },
}));

export default <%= fileName %>`;

module.exports = {
  testGenerateString: testGenerateString,
  listComponentGenerateString: listComponentGenerateString,
  formStoreGenerateString: formStoreGenerateString,
};
