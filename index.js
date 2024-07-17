require("dotenv").config();
const _ = require("lodash");
const ejs = require("ejs");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { tableSelectSql, columnSelectSql } = require("./sql-string");
const {
  listComponentGenerateString,
  formStoreGenerateString,
  formViewGenerateString,
} = require("./generate-string");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, SERVER_PORT } =
  process.env;

const db = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
});

const express = require("express");
const app = express();
const cors = require("cors");
const port = SERVER_PORT;
app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);
app.use(express.static("public"));

// 테이블 조회 : /api/tables
app.get("/api/tables", async (req, res) => {
  const keyword = req.query.keyword;
  let tableList = [];
  try {
    const dbResponse = await db.raw(tableSelectSql, {
      keyword: `%${keyword}%`,
    });
    tableList = dbResponse.rows;
    console.log(tableList);
  } catch (e) {
    console.log(e);
  }

  res.json({
    list: tableList,
  });
});

// 테이블명 기준으로 컬럼 정보 조회 : /api/columns
app.get("/api/columns/:tableName", async (req, res) => {
  const tableName = req.params.tableName;
  let columnList = [];
  try {
    const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
    columnList = dbResponse.rows;
    console.log(columnList);
  } catch (e) {
    console.log(e);
  }

  res.json({
    list: columnList,
  });
});

// 파일 생성하기 : /api/generate/:tableName/:generateType/fileCreate
app.get(
  "/api/generate/:tableName/:generateType/fileCreate",
  async (req, res) => {
    const tableName = req.params.tableName;
    const generateType = req.params.generateType || "all"; // all, list, formStore, formView
    const checkedColumns = req.query.checkedColumns || [];
    let columnList = [];
    try {
      const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
      columnList = dbResponse.rows.filter((info) => {
        if (checkedColumns.length) {
          const searchIndex = checkedColumns.findIndex(
            (checkedColumnName) =>
              checkedColumnName === info.column_name_original
          );
          if (searchIndex !== -1) {
            return true;
          }
        } else {
          return true;
        }
      });
      if (generateType === "all") {
        createListfile(tableName, columnList);
        createFormStorefile(tableName, columnList);
        createFormViewfile(tableName, columnList);
      } else if (generateType === "list") {
        createListfile(tableName, columnList);
      } else if (generateType === "formStore") {
        createFormStorefile(tableName, columnList);
      } else if (generateType === "formView") {
        createFormViewfile(tableName, columnList);
      }
      console.log(columnList);
    } catch (e) {
      console.log(e);
    }

    res.json({
      list: columnList,
    });
  }
);

// 파일 다운로드하기 : /api/generate/:tableName/:generateType/fileDownload
app.get(
  "/api/generate/:tableName/:generateType/fileDownload",
  async (req, res) => {
    const tableName = req.params.tableName;
    const generateType = req.params.generateType || "all"; // all, list, formStore, formView
    const checkedColumns = req.query.checkedColumns || [];
    let columnList = [];
    let downloadFileName = "";
    try {
      const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
      columnList = dbResponse.rows.filter((info) => {
        if (checkedColumns.length) {
          const searchIndex = checkedColumns.findIndex(
            (checkedColumnName) =>
              checkedColumnName === info.column_name_original
          );
          if (searchIndex !== -1) {
            return true;
          }
        } else {
          return true;
        }
      });
      let listFileName = "";
      let formStoreFileName = "";
      let formViewFileName = "";
      if (generateType === "all" || generateType === "list") {
        listFileName = await createListfile(tableName, columnList);
        if (generateType === "list") {
          downloadFileName = listFileName;
        }
      }
      if (generateType === "all" || generateType === "formStore") {
        formStoreFileName = await createFormStorefile(tableName, columnList);
        if (generateType === "formStore") {
          downloadFileName = formStoreFileName;
        }
      }
      if (generateType === "all" || generateType === "formView") {
        formViewFileName = await createFormViewfile(tableName, columnList);
        if (generateType === "formView") {
          downloadFileName = formViewFileName;
        }
      }
      if (generateType === "all") {
        downloadFileName = await createZipArchive(tableName, [
          listFileName,
          formStoreFileName,
          formViewFileName,
        ]);
      }
    } catch (e) {
      console.log(e);
    }

    res.download(downloadFileName);
  }
);

// generate 문자열 반환 : /api/generate/:tableName
app.get("/api/generate/:tableName", async (req, res) => {
  const tableName = req.params.tableName;
  let columnList = [];
  let result = {};
  const checkedColumns = req.query.checkedColumns || [];
  try {
    const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
    columnList = dbResponse.rows.filter((info) => {
      if (checkedColumns.length) {
        const searchIndex = checkedColumns.findIndex(
          (checkedColumnName) => checkedColumnName === info.column_name_original
        );
        if (searchIndex !== -1) {
          return true;
        }
      } else {
        return true;
      }
    });

    columnList.map((info) => {
      let yupType = "string";
      let formInitValue = '""';
      if (info.java_type === "Double" || info.java_type === "Long") {
        yupType = "number";
        formInitValue = "null";
      } else if (info.java_type === "Boolean") {
        yupType = "boolean";
        formInitValue = "false";
      }
      info.yupType =
        yupType + "()" + (info.is_nullable === "YES" ? ".required()" : "");
      info.formInitValue = formInitValue;
      return info;
    });

    const requiredFields = columnList
      .filter((info) => info.is_nullable !== "YES")
      .map((info) => info.column_name);

    let fileName = _.camelCase(tableName);
    const applyFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const listData = {
      fileName: `${applyFileName}List`,
      storeName: `${applyFileName}ListStore`,
      tableColumns: columnList,
    };
    const listComponentContent = ejs.render(
      listComponentGenerateString,
      listData
    );

    const formStoreData = {
      fileName: `use${applyFileName}FormStore`,
      requiredFieldList: requiredFields,
      tableColumns: columnList,
    };

    const formStoreContent = ejs.render(formStoreGenerateString, formStoreData);

    const formViewData = {
      fileName: `${applyFileName}Form`,
      storeName: `use${applyFileName}FormStore`,
      tableColumns: columnList,
    };

    const formViewContent = ejs.render(formViewGenerateString, formViewData);
    result.listComponentContent = listComponentContent;
    result.formStoreContent = formStoreContent;
    result.formViewContent = formViewContent;
  } catch (e) {
    console.log(e);
  }

  res.json(result);
});

// 테이블 목록 파일 생성
async function createListfile(tableName, columnList) {
  // 템플릿에서 대체할 변수들
  let fileName = _.camelCase(tableName);
  const applyFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const data = {
    fileName: `${applyFileName}List`,
    storeName: `${applyFileName}ListStore`,
    tableColumns: columnList,
  };
  const content = ejs.render(listComponentGenerateString, data);
  fs.writeFileSync(`./result/${applyFileName}List.tsx`, content);
  return `./result/${applyFileName}List.tsx`;
}

// form store 파일 생성
async function createFormStorefile(tableName, columnList) {
  // 템플릿에서 대체할 변수들
  let fileName = _.camelCase(tableName);
  const applyFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  // yup 가공 start
  columnList.map((info) => {
    let yupType = "string";
    let formInitValue = '""';
    if (info.java_type === "Double" || info.java_type === "Long") {
      yupType = "number";
      formInitValue = "null";
    } else if (info.java_type === "Boolean") {
      yupType = "boolean";
      formInitValue = "false";
    }
    info.yupType =
      yupType + "()" + (info.is_nullable === "YES" ? ".required()" : "");
    info.formInitValue = formInitValue;
    return info;
  });

  const requiredFields = columnList
    .filter((info) => info.is_nullable !== "YES")
    .map((info) => info.column_name);
  // yup 가공 end

  const data = {
    fileName: `use${applyFileName}FormStore`,
    requiredFieldList: requiredFields,
    tableColumns: columnList,
  };
  const content = ejs.render(formStoreGenerateString, data);
  fs.writeFileSync(`./result/${applyFileName}FormStore.ts`, content);
  return `./result/${applyFileName}FormStore.ts`;
}

// form view 파일 생성
async function createFormViewfile(tableName, columnList) {
  // 템플릿에서 대체할 변수들
  let fileName = _.camelCase(tableName);
  const applyFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  const data = {
    fileName: `${applyFileName}Form`,
    storeName: `use${applyFileName}FormStore`,
    tableColumns: columnList,
  };
  const content = ejs.render(formViewGenerateString, data);
  fs.writeFileSync(`./result/${applyFileName}Form.tsx`, content);
  return `./result/${applyFileName}Form.tsx`;
}

// 파일 압축
async function createZipArchive(tableName, fileNameList) {
  let zipFileName = `./result/${tableName}-all.zip`;
  try {
    const zip = new AdmZip();
    fileNameList.forEach((fileName) => {
      zip.addLocalFile(fileName);
    });
    zip.writeZip(zipFileName);
    console.log(`Created ${zipFileName} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
  return zipFileName;
}

// 서버 listen
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
