const fs = require("fs");
const ejs = require("ejs");
const { string2 } = require("./sql-string");
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
const { formStoreGenerateString } = require("./generate-string");

async function test() {
  try {
    const users = await db.raw(string2, ["app_airplane", "app_airplane"]);
    const columnList = users.rows;
    // required()
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

    // 템플릿에서 대체할 변수들
    const data = {
      tableColumns: columnList,
      requiredFieldList: requiredFields,
      fileName: "useAirplaneFormStore",
    };

    // ejs.render를 사용하여 템플릿을 컴파일하고 변수 값을 대체
    const content = ejs.render(formStoreGenerateString, data);

    // 파일 생성
    fs.writeFile("generatedFile2.js", content, (err) => {
      if (err) {
        return console.error("Error writing file:", err);
      }
      console.log("File created successfully!");
    });
  } catch (error) {
    console.log(error);
  }
}

test();
