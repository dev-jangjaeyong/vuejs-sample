import Vue from "vue";
import Vuex from "vuex";

Vue.use(vuex);

export default Vuex.Store({
  state:{
    totalSize: 0,
    perPage: 20,
    currentPage: 1,
    perPageOptions: [10, 20, 30, 40, 50],
    sortDesc: true,
  }
});
