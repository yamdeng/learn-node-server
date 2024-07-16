const fs = require("fs");
const ejs = require("ejs");
const { string2 } = require("./sql-string");
const AdmZip = require("adm-zip");
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
const { listComponentGenerateString } = require("./generate-string");

async function test() {
  try {
    const users = await db.raw(string2, ["app_airplane", "app_airplane"]);
    const columnList = users.rows;

    // 템플릿에서 대체할 변수들
    const fileName = "AirplaneList";
    const data = {
      fileName: fileName,
      storeName: "airplaneListStore",
      tableColumns: columnList,
    };

    // ejs.render를 사용하여 템플릿을 컴파일하고 변수 값을 대체
    const content = ejs.render(listComponentGenerateString, data);

    // 파일 생성
    fs.writeFile(`./result/${fileName}.tsx`, content, (err) => {
      if (err) {
        return console.error("Error writing file:", err);
      }
      console.log("File created successfully!");
    });
  } catch (error) {
    console.log(error);
  }

  createZipArchive();
}
async function createZipArchive() {
  try {
    const zip = new AdmZip();
    const outputFile = "test.zip";
    // zip.addLocalFile("./result");
    zip.addLocalFile("./result/AirplaneList.tsx");
    // zip.addLocalFile("./result/AirplaneList2.tsx");
    // zip.addLocalFile("./result/AirplaneList copy.tsx");
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

test();
