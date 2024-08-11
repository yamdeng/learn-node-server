import { Button, Flex, Select, Table, Tabs, Checkbox } from "antd";
import axios from "axios";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AsyncSelect from "react-select/async";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useImmer } from "use-immer";
import "./App.css";

// import AppTextInput from '@/components/common/AppTextInput';
// import AppSelect from '@/components/common/AppSelect';
// import AppCodeSelect from '@/components/common/AppCodeSelect';
// import AppTextArea from '@/components/common/AppTextArea';
// import AppEditor from '@/components/common/AppEditor';
// import AppDatePicker from '@/components/common/AppDatePicker';
// import AppTimePicker from '@/components/common/AppTimePicker';
// import AppCheckbox from '@/components/common/AppCheckbox';
// import AppRadio from '@/components/common/AppRadio';
// import AppUserSelectInput from '@/components/common/AppUserSelectInput';
// import AppDeptSelectInput from '@/components/common/AppDeptSelectInput';
// import AppAutoComplete from '@/components/common/AppAutoComplete';
// import AppTreeSelect from '@/components/common/AppTreeSelect';

// text, numnber, select, code, textarea, editor, datepicker, timepicker, checkbox, radio, user-select-input, dept-select-input, auto-complete, tree-select
const componentTypeOptions = [
  { value: "text", label: "text" },
  { value: "number", label: "number" },
  { value: "select", label: "code" },
  { value: "textarea", label: "textarea" },
  { value: "editor", label: "editor" },
  { value: "datepicker", label: "datepicker" },
  { value: "timepicker", label: "timepicker" },
  { value: "checkbox", label: "checkbox" },
  { value: "radio", label: "radio" },
  { value: "user-select-input", label: "사용자검색 input" },
  { value: "dept-select-input", label: "부서검색 input" },
  { value: "auto-complete", label: "AutoComplete" },
  { value: "tree-select", label: "트리 select" },
];

// const getQueryStringByArray = (parameterName, arr) => {
//   let result = "";
//   if (arr && arr.length) {
//     for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
//       const stringValue = arr[arrIndex];
//       if (arrIndex === 0) {
//         result =
//           result + `?${encodeURIComponent(parameterName)}=` + stringValue;
//       } else {
//         result =
//           result + `&${encodeURIComponent(parameterName)}=` + stringValue;
//       }
//     }
//   }

//   return result;
// };

const loadOptions = (inputValue, callback) => {
  console.log("on load options function");
  axios
    .get(`/api/tables`, {
      params: {
        keyword: inputValue,
      },
    })
    .then((response) => {
      const list = response.data.list;
      const options = [];
      list.forEach((info) => {
        options.push({
          label: info.table_name,
          value: info.table_name,
        });
      });
      callback(options);
    });
};

function App() {
  const [selectTableName, setSelectTableName] = useState("");
  const [selectGenerateType, setSelectGenerateType] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnList, setColumnList] = useImmer([]);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [listSourceContent, setListSourceContent] = useState("");
  const [formStoreSourceContent, setFormStoreSourceContent] = useState("");
  const [formViewSourceContent, setFormViewSourceContent] = useState("");
  const [detailViewSourceContent, setDetailViewSourceContent] = useState("");
  const [modalFormSourceContent, setModalFormSourceContent] = useState("");
  const [modalViewSourceContent, setModalViewSourceContent] = useState("");
  const [checkedMultiColumn, setCheckedMultiColumn] = useState(false);
  const [checkedModalUseState, setCheckedModalUseState] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "목록",
      children: (
        <>
          <CopyToClipboard
            text={listSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {listSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
    {
      key: "2",
      label: "form-store",
      children: (
        <>
          <CopyToClipboard
            text={formStoreSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {formStoreSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
    {
      key: "3",
      label: "form-view",
      children: (
        <>
          <CopyToClipboard
            text={formViewSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {formViewSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
    {
      key: "4",
      label: "detail-view",
      children: (
        <>
          <CopyToClipboard
            text={detailViewSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {detailViewSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
    {
      key: "5",
      label: "modal-form",
      children: (
        <>
          <CopyToClipboard
            text={modalFormSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {modalFormSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
    {
      key: "6",
      label: "modal-view",
      children: (
        <>
          <CopyToClipboard
            text={modalViewSourceContent}
            onCopy={() => alert("클립보드 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {modalViewSourceContent}
          </SyntaxHighlighter>
        </>
      ),
    },
  ];

  const onTabChange = (key) => {
    console.log(key);
    setActiveTabKey(key);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChange = (optionInfo) => {
    setSelectTableName(optionInfo.value);

    axios
      .get(`/api/columns/${optionInfo.value}`, {
        params: {},
      })
      .then((response) => {
        const list = response.data.list;
        setColumnList(list);
        const tableCheckKeyList = list.map((info) => info.column_name_original);
        setSelectedRowKeys(tableCheckKeyList);
      });
  };

  const fileDownload = () => {
    axios
      .post(
        `/api/generate/${selectTableName}/${selectGenerateType}/fileDownload`,
        {
          checkedColumns: columnList,
          checkedMultiColumn: checkedMultiColumn,
          checkedModalUseState: checkedModalUseState,
        }
      )
      .then((response) => {
        const disposition = response.headers["content-disposition"];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");

        let fileName = "downloaded_file";
        if (disposition) {
          const fileNameMatch = disposition.match(/filename="(.+)"/);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        a.style.display = "none";
        a.href = url;
        a.download = fileName; // 다운로드될 파일 이름
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // 메모리
      })
      .catch((error) =>
        console.error("There was a problem with the download:", error)
      );
  };

  const changeGenerateType = (value) => {
    setSelectGenerateType(value);
  };

  const refreshSource = () => {
    const checkedColumns = columnList.filter((columnInfo) => {
      const searchIndex = selectedRowKeys.findIndex(
        (key) => key === columnInfo.column_name_original
      );
      if (searchIndex !== -1) {
        return true;
      }
      return false;
    });
    axios
      .get(`/api/generate/${selectTableName}`, {
        params: {
          checkedColumns: checkedColumns,
          checkedMultiColumn: checkedMultiColumn,
          checkedModalUseState: checkedModalUseState,
        },
      })
      .then((response) => {
        const sourceInfo = response.data;
        const {
          listComponentContent,
          formStoreContent,
          formViewContent,
          detailViewContent,
          modalFormContent,
          modalViewContent,
        } = sourceInfo;
        setListSourceContent(listComponentContent);
        setFormStoreSourceContent(formStoreContent);
        setFormViewSourceContent(formViewContent);
        setDetailViewSourceContent(detailViewContent);
        setModalFormSourceContent(modalFormContent);
        setModalViewSourceContent(modalViewContent);
      });
  };

  const changeComponentType = (index, value) => {
    setColumnList((draft) => {
      draft[index].componentType = value;
    });
  };

  const columns = [
    {
      title: "컬럼명",
      dataIndex: "column_name_original",
      key: "column_name_original",
    },
    {
      title: "주석",
      dataIndex: "column_comment",
      key: "column_comment",
    },
    {
      title: "컬럼 타입",
      dataIndex: "data_type",
      key: "data_type",
    },
    {
      title: "널허용",
      dataIndex: "is_nullable",
      key: "is_nullable",
    },
    {
      title: "낙타표기법컬럼명",
      dataIndex: "column_name",
      key: "column_name",
    },
    {
      title: "유형",
      dataIndex: "comoonentType",
      key: "comoonentType",
      render: (_, record, index) => {
        const { componentType } = record;
        return (
          <Select
            value={componentType}
            style={{ width: 120 }}
            onChange={(value) => changeComponentType(index, value)}
            options={componentTypeOptions}
          />
        );
      },
    },
  ];

  return (
    <>
      <div>
        <AsyncSelect
          loadOptions={loadOptions}
          defaultOptions
          onChange={onChange}
        />
        <br />
        <Flex wrap gap="small">
          <Select
            value={selectGenerateType}
            style={{ width: 120 }}
            onChange={changeGenerateType}
            options={[
              { value: "all", label: "전체" },
              { value: "list", label: "목록" },
              { value: "formStore", label: "form store" },
              { value: "formView", label: "form view" },
              { value: "detailView", label: "detail view" },
              { value: "modalForm", label: "modal form" },
              { value: "modalView", label: "modal view" },
            ]}
          />
          <Button
            type="primary"
            danger
            onClick={fileDownload}
            disabled={!selectTableName || !selectedRowKeys.length}
          >
            파일다운로드
          </Button>
          <Button
            type="primary"
            danger
            onClick={refreshSource}
            disabled={!selectTableName || !selectedRowKeys.length}
          >
            소스조회
          </Button>
          <Checkbox
            onChange={(checekd) => setCheckedMultiColumn(checekd)}
            value={checkedMultiColumn}
          >
            2열 반영
          </Checkbox>
          <Checkbox
            onChange={(checekd) => setCheckedModalUseState(checekd)}
            value={checkedModalUseState}
          >
            모달 useState 적용
          </Checkbox>
        </Flex>
        <Table
          rowKey={"column_name_original"}
          rowSelection={rowSelection}
          dataSource={columnList}
          columns={columns}
          pagination={false}
        />
        <Tabs
          activeKey={activeTabKey}
          items={tabItems}
          onChange={onTabChange}
        />
      </div>
    </>
  );
}

export default App;
