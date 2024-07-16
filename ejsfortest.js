const fs = require("fs");
const ejs = require("ejs");

// 템플릿 문자열
const template = `
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
<% articles.forEach((article)=> { %>
<li>
    <h2>
        <%= article.title %>
    </h2>
    <p>
        <%= article.body %>
    </p>
</li>
<hr />
<% }) %>
`;

// 템플릿에서 대체할 변수들
const data = {
  name: "World",
  framework: "express", // 'express' 또는 다른 값을 설정 가능
  articles: [
    {
      title: "test1",
      body: "test1body",
    },
    {
      title: "test2",
      body: "test2body",
    },
  ],
};

// ejs.render를 사용하여 템플릿을 컴파일하고 변수 값을 대체
const content = ejs.render(template, data);

// 파일 생성
fs.writeFile("generatedFile.js", content, (err) => {
  if (err) {
    return console.error("Error writing file:", err);
  }
  console.log("File created successfully!");
});
