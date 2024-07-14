document.addEventListener("DOMContentLoaded", function () {
  const columnDefs = [
    { field: "id" },
    { field: "name" },
    { field: "age" },
    { field: "email" },
  ];

  function onPaginationChanged(grid) {
    if (grid.newPage) {
      // grid.api.refreshInfiniteCache();
      // grid.api.purgeInfiniteCache();
    }
  }

  const gridOptions = {
    columnDefs: columnDefs,
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 30],
    cacheBlockSize: 20,
    maxBlocksInCache: 1,
    onPaginationChanged: onPaginationChanged,
    rowModelType: "infinite",
    blockLoadDebounceMillis: false,
    keepDetailRows: false,
    maxConcurrentDatasourceRequests: 1,
    infiniteInitialRowCount: 0,
    datasource: {
      getRows: function (params) {
        console.log(JSON.stringify(params, null, 1));

        const page = params.startRow / 20;

        fetch(
          `http://localhost:3000/data?page=${page}&pageSize=${
            params.endRow - params.startRow
          }`
        )
          .then((response) => response.json())
          .then((data) => {
            params.successCallback(data.rows, data.total, false);
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
