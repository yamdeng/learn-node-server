document.addEventListener("DOMContentLoaded", function () {
  const columnDefs = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "age", headerName: "Age" },
    { field: "email", headerName: "Email" },
  ];

  const gridOptions = {
    columnDefs: columnDefs,
    pagination: true,
    paginationPageSize: 20,
    rowModelType: "infinite",
    cacheBlockSize: 20,
    maxBlocksInCache: 2,
    datasource: {
      getRows: function (params) {
        console.log(
          "Requesting rows from " + params.startRow + " to " + params.endRow
        );

        const page = params.startRow / gridOptions.paginationPageSize;

        fetch(
          `http://localhost:3000/data?page=${page}&pageSize=${gridOptions.paginationPageSize}`
        )
          .then((response) => response.json())
          .then((data) => {
            params.successCallback(data.rows, data.total);
          })
          .catch((error) => {
            console.error(error);
            params.failCallback();
          });
      },
    },
  };

  const eGridDiv = document.querySelector("#myGrid");
  new agGrid.Grid(eGridDiv, gridOptions);
});
