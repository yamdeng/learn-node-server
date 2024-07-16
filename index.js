// -api/generate-info/{tableName}
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
const db = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "korea1234",
    database: "postgres",
  },
});

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
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
app.get("/api/columns", async (req, res) => {
  const tableName = req.query.tableName;
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
    // TODO : querystring으로 적용할 컬럼 목록 전달하기
    const tableName = req.params.tableName;
    const generateType = req.params.generateType; // all, list, formStore, formView
    const requestColumnList = [];
    let columnList = [];
    try {
      const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
      columnList = dbResponse.rows;
      // TODO : filter 필요
      createListfile(tableName, columnList);
      createFormStorefile(tableName, columnList);
      createFormViewfile(tableName, columnList);
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
    // TODO : querystring으로 적용할 컬럼 목록 전달하기
    const tableName = req.params.tableName;
    const generateType = req.params.generateType; // all, list, formStore, formView
    const requestColumnList = [];
    let columnList = [];
    let downloadFileName = "";
    try {
      const dbResponse = await db.raw(columnSelectSql, [tableName, tableName]);
      columnList = dbResponse.rows;
      // TODO : filter 필요
      const listFileName = await createListfile(tableName, columnList);
      const formStoreFileName = await createFormStorefile(
        tableName,
        columnList
      );
      const formViewFileName = await createFormViewfile(tableName, columnList);
      downloadFileName = await createZipArchive(tableName, [
        listFileName,
        formStoreFileName,
        formViewFileName,
      ]);
    } catch (e) {
      console.log(e);
    }

    res.download(downloadFileName);
  }
);

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
