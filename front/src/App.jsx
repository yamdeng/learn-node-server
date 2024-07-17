import { useState } from "react";
import { Table, Flex, Button, Select, Tabs } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

const getQueryStringByArray = (parameterName, arr) => {
  let result = "";
  if (arr && arr.length) {
    for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
      const stringValue = arr[arrIndex];
      if (arrIndex === 0) {
        result =
          result + `?${encodeURIComponent(parameterName)}=` + stringValue;
      } else {
        result =
          result + `&${encodeURIComponent(parameterName)}=` + stringValue;
      }
    }
  }

  return result;
};

const loadOptions = (inputValue, callback) => {
  console.log("on load options function");
  axios
    .get(`http://localhost:3000/api/tables`, {
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
  const [columnList, setColumnList] = useState([]);

  const [activeTabKey, setActiveTabKey] = useState("1");
  const [listSourceContent, setListSourceContent] = useState("");
  const [formStoreSourceContent, setFormStoreSourceContent] = useState("");
  const [formViewSourceContent, setFormViewSourceContent] = useState("");

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
      .get(`http://localhost:3000/api/columns/${optionInfo.value}`, {
        params: {},
      })
      .then((response) => {
        const list = response.data.list;
        setColumnList(list);
        const tableCheckKeyList = list.map((info) => info.column_name_original);
        setSelectedRowKeys(tableCheckKeyList);
      });
  };

  const fileCreate = () => {
    axios
      .get(
        `http://localhost:3000/api/generate/${selectTableName}/${selectGenerateType}/fileCreate`,
        {
          params: {
            checkedColumns: selectedRowKeys,
          },
        }
      )
      .then(() => {
        alert("파일 생성 완료!");
      });
  };

  const fileDownload = () => {
    const checkedColumnParameters = getQueryStringByArray(
      "checkedColumns",
      selectedRowKeys
    );
    window.open(
      `http://localhost:3000/api/generate/${selectTableName}/${selectGenerateType}/fileDownload${checkedColumnParameters}`
    );
  };

  const changeGenerateType = (value) => {
    setSelectGenerateType(value);
  };

  const refreshSource = () => {
    axios
      .get(`http://localhost:3000/api/generate/${selectTableName}`, {
        params: {
          checkedColumns: selectedRowKeys,
        },
      })
      .then((response) => {
        const sourceInfo = response.data;
        const { listComponentContent, formStoreContent, formViewContent } =
          sourceInfo;
        setListSourceContent(listComponentContent);
        setFormStoreSourceContent(formStoreContent);
        setFormViewSourceContent(formViewContent);
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
            ]}
          />
          <Button
            type="primary"
            danger
            onClick={fileCreate}
            disabled={!selectTableName || !selectedRowKeys.length}
          >
            파일생성
          </Button>
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
