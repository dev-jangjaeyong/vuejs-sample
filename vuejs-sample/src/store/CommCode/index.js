import Vue from "vue";
import Vuex from "vuex";
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchParameters: {
      dateType:'',
      dates:{
        // start: '',
        // end: '',
        // span:'',
        // weekdays:[],
      }
    },
    datedisabled:[],
    sidos: [],
    citys: [],
    johaps: [],
    danjis: [],
    shops: [],
    sidoValue: '',
    cityValue: '',
    johapValue: '',
    danjiValue: '',
    shopValue: '',
    tableData: [],
    items: [],
    totalItems: [],
    originalItems: [],
    // currentPage: 1,
    // perPage: 20,
    date:'',




  },
    getters,
    mutations,
    actions,
  });
