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

const data = [];
for (let i = 1; i <= 1000; i++) {
  data.push({
    id: i,
    name: `Name ${i}`,
    age: Math.floor(Math.random() * 100),
    email: `email${i}@example.com`,
  });
}

app.get("/api/v1/data", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const rows = data.slice(start, end);

  res.json({
    rows: rows,
    total: data.length,
  });
});

app.get("/data", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const rows = data.slice(start, end);

  res.json({
    rows: rows,
    total: data.length,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
