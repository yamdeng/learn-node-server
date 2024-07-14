document.addEventListener("DOMContentLoaded", function () {
  const columnDefs = [
    { field: "id" },
    { field: "name" },
    { field: "age" },
    { field: "email" },
  ];

  const gridOptions = {
    columnDefs: columnDefs,
    pagination: true,
    paginationPageSize: 10,
    rowModelType: "infinite",
    datasource: {
      getRows: function (params) {
        console.log(JSON.stringify(params, null, 1));

        const page = params.startRow / 10;

        fetch(
          `http://localhost:3000/data?page=${page}&pageSize=${
            params.endRow - params.startRow
          }`
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
