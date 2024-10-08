// -api/tables
// -api/tables/{tableName}/details
// -api/table/{tableName}/fileDownload
// -api/table/{tableName}/fileCreate
// -api/generate-info/{tableName}

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

app.get("/api/tables", (req, res) => {
  const keyword = req.query.keyword;

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
