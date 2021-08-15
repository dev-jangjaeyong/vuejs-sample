export default {
  CAR_TOTAL_CNT: function (state, data) {
    state.totalSize = data.resultCount;
  },
  CAR_LIST: function (state, data) {
    console.log("result", data.resultList);
    state.tableData = data.resultList;
  }
}
