/* eslint-disable react/prop-types */
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Checkbox, Flex, Input, Select, Table, Tabs } from "antd";
import axios from "axios";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AsyncSelect from "react-select/async";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useImmer } from "use-immer";
import "./App.css";

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 0,
        }
      : {}),
  };
  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const componentTypeOptions = [
  { value: "text", label: "text" },
  { value: "number", label: "number" },
  { value: "select", label: "select" },
  { value: "code", label: "code" },
  { value: "textarea", label: "textarea" },
  { value: "editor", label: "editor" },
  { value: "datepicker", label: "datepicker" },
  { value: "timepicker", label: "timepicker" },
  { value: "rangepicker", label: "rangepicker" },
  { value: "checkbox", label: "checkbox" },
  { value: "checkboxgroup", label: "checkboxgroup" },
  { value: "radio", label: "radio" },
  { value: "file", label: "file" },
  { value: "user-select-input", label: "사용자검색 input" },
  { value: "dept-select-input", label: "부서검색 input" },
  { value: "auto-complete", label: "AutoComplete" },
  { value: "tree-select", label: "트리 select" },
  { value: "search-input", label: "search input" },
];

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
  const [searchFormSourceContent, setSearchFormSourceContent] = useState("");
  const [checkedMultiColumn, setCheckedMultiColumn] = useState(false);
  const [checkedModalUseState, setCheckedModalUseState] = useState(false);
  const [checkedInnerFormStore, setCheckedInnerFormStore] = useState(false);
  const [checkedSearchFormDetail, setCheckedSearchFormDetail] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "목록",
      children: (
        <>
          <CopyToClipboard
            text={listSourceContent}
            onCopy={() => alert("목록 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                목록 복사
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
      label: "폼(store)",
      children: (
        <>
          <CopyToClipboard
            text={formStoreSourceContent}
            onCopy={() => alert("폼(store) 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                폼(store) 복사
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
      label: "폼(화면)",
      children: (
        <>
          <CopyToClipboard
            text={formViewSourceContent}
            onCopy={() => alert("폼(화면) 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                폼(화면) 복사
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
      label: "상세(화면)",
      children: (
        <>
          <CopyToClipboard
            text={detailViewSourceContent}
            onCopy={() => alert("상세(화면) 복사 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                상세(화면) 복사
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
      label: "모달폼(화면)",
      children: (
        <>
          <CopyToClipboard
            text={modalFormSourceContent}
            onCopy={() => alert("모달폼(화면) 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                모달폼(화면) 복사
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
      label: "모달상세(화면)",
      children: (
        <>
          <CopyToClipboard
            text={modalViewSourceContent}
            onCopy={() => alert("모달상세(화면) 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                모달상세(화면) 복사
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
    {
      key: "7",
      label: "검색폼",
      children: (
        <>
          <CopyToClipboard
            text={searchFormSourceContent}
            onCopy={() => alert("검색폼 복사 완료")}
          >
            <div style={{ textAlign: "left" }}>
              <Button type="primary" danger>
                검색폼 복사
              </Button>
            </div>
          </CopyToClipboard>
          <SyntaxHighlighter
            language="javascript"
            style={darcula}
            showLineNumbers
            wrapLongLines
          >
            {searchFormSourceContent}
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
        setListSourceContent("");
        setFormStoreSourceContent("");
        setFormViewSourceContent("");
        setDetailViewSourceContent("");
        setModalFormSourceContent("");
        setModalViewSourceContent("");
        setSearchFormSourceContent("");
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
          checkedInnerFormStore: checkedInnerFormStore,
          checkedSearchFormDetail: checkedSearchFormDetail,
        },
        { responseType: "arraybuffer" }
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
      .post(`/api/generate/${selectTableName}`, {
        checkedColumns: checkedColumns,
        checkedMultiColumn: checkedMultiColumn,
        checkedModalUseState: checkedModalUseState,
        checkedInnerFormStore: checkedInnerFormStore,
        checkedSearchFormDetail: checkedSearchFormDetail,
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
          searchFormContent,
        } = sourceInfo;
        setListSourceContent(listComponentContent);
        setFormStoreSourceContent(formStoreContent);
        setFormViewSourceContent(formViewContent);
        setDetailViewSourceContent(detailViewContent);
        setModalFormSourceContent(modalFormContent);
        setModalViewSourceContent(modalViewContent);
        setSearchFormSourceContent(searchFormContent);
      });
  };

  const changeComponentType = (index, value) => {
    setColumnList((draft) => {
      draft[index].componentType = value;
    });
  };

  const changeCodeGroupId = (index, value) => {
    setColumnList((draft) => {
      draft[index].codeGroupId = value;
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
            showSearch
            value={componentType}
            style={{ width: 150 }}
            onChange={(value) => changeComponentType(index, value)}
            options={componentTypeOptions}
          />
        );
      },
    },
    {
      title: "코드그룹ID",
      dataIndex: "codeGroupId",
      key: "codeGroupId",
      render: (_, record, index) => {
        const { codeGroupId, componentType } = record;
        return (
          <Input
            value={codeGroupId}
            style={{ width: 120 }}
            onChange={(event) => changeCodeGroupId(index, event.target.value)}
            disabled={componentType !== "code"}
          />
        );
      },
    },
  ];

  // drag start
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setColumnList((prev) => {
        const activeIndex = prev.findIndex(
          (i) => i.column_name_original === active.id
        );
        const overIndex = prev.findIndex(
          (i) => i.column_name_original === over?.id
        );
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

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
            showSearch
            value={selectGenerateType}
            style={{ width: 120 }}
            onChange={changeGenerateType}
            options={[
              { value: "all", label: "전체" },
              { value: "list", label: "목록" },
              { value: "formStore", label: "폼(store)" },
              { value: "formView", label: "폼(화면)" },
              { value: "detailView", label: "상세(화면)" },
              { value: "modalForm", label: "모달폼(화면)" },
              { value: "modalView", label: "모달상세(화면)" },
              { value: "searchForm", label: "검색폼" },
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
            onChange={(event) => {
              const checked = event.target.checked;
              setCheckedMultiColumn(checked);
            }}
            value={checkedMultiColumn}
          >
            2열 반영
          </Checkbox>
          <Checkbox
            onChange={(event) => {
              const checked = event.target.checked;
              setCheckedInnerFormStore(checked);
            }}
            value={checkedInnerFormStore}
          >
            formstore 같이
          </Checkbox>
          <Checkbox
            onChange={(event) => {
              const checked = event.target.checked;
              setCheckedModalUseState(checked);
            }}
            value={checkedModalUseState}
          >
            모달 useState 적용
          </Checkbox>
          <Checkbox
            onChange={(event) => {
              const checked = event.target.checked;
              setCheckedSearchFormDetail(checked);
            }}
            value={checkedSearchFormDetail}
          >
            상세펼치기
          </Checkbox>
        </Flex>

        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            // rowKey array
            items={columnList.map((i) => i.column_name_original)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey={"column_name_original"}
              rowSelection={rowSelection}
              dataSource={columnList}
              columns={columns}
              pagination={false}
            />
          </SortableContext>
        </DndContext>

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
