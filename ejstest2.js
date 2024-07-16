const fs = require("fs");
const ejs = require("ejs");
const { testGenerateString } = require("./generate-string");

// 템플릿에서 대체할 변수들
const data = {
  name: "World",
  framework: "express", // 'express' 또는 다른 값을 설정 가능
};

// ejs.render를 사용하여 템플릿을 컴파일하고 변수 값을 대체
const content = ejs.render(testGenerateString, data);

// 파일 생성
fs.writeFile("generatedFile.js", content, (err) => {
  if (err) {
    return console.error("Error writing file:", err);
  }
  console.log("File created successfully!");
});
