import Vue from "vue";
import Vuex from "vuex";
import commSido from '@/common-sidocity.js'
import commJohapDanjiShop from '@/common-johapdanjishop.js'

Vue.use(Vuex);

const carCodeStore = new Vuex.Store({
  state: {
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
    searchParameters: {
      sidoCode: '',
      cityCode: '',
      johapCode: '',
      danjiCode: '',
      shopCode: '',
      plateNumber: '',
      saleSate: '3',
      cateCode: '',
      // dealerName: '',
      toUseKm: '',
      fromUseKm: '',
      shopNos: '',
      userNos: '',
      order: '',
      orderDesc: '',
      toRegYear: null,
      fromRegYear: null
    },
  },
  mutations: {
    GetSidoSetting: function (state, payload) {
      state.searchParameters.sidoCode = '';
      state.searchParameters.cityCode = '';
      state.searchParameters.johapCode = '';
      state.searchParameters.danjiCode = '';
      state.searchParameters.shopCode = '';
      let sidoArray = new Array();
      let result_map = Object.keys(codeSido).map(function (key) {
        let data = new Object();
        data.VALUE = String(key);
        data.TEXT = codeSido[key];
        sidoArray.push(data);
        // return [String(key), codeSido[key]];
      });
      // console.log(sidoArray);
      state.sidos = sidoArray;
      // console.log(this.sidos);
      // return state.sidos;
    },
    changeSido: function (state, payload) {
      state.searchParameters.sidoCode = payload;
      state.searchParameters.cityCode = '';
      state.searchParameters.johapCode = '';
      state.searchParameters.danjiCode = '';
      state.searchParameters.shopCode = '';
      state.citys = [];
      state.johaps = [];
      state.danjis = [];
      state.shops = [];
      if (payload !== "") {
        let cityArray = new Array();
        let johapArray = new Array();
        let city_map = Object.keys(codeCity[payload]).map(function (key) {
          let data = new Object();
          data.VALUE = String(key);
          data.TEXT = codeCity[payload][key];
          cityArray.push(data);
          //return [String(key), codeCity[e][key]];
        });
        let johap_map = Object.keys(codeJohap[payload]).map(function (key) {
          let data = new Object();
          data.VALUE = String(key);
          data.TEXT = codeJohap[payload][key];
          johapArray.push(data);
          //return [String(key), getCity[e][key]];
        });
        state.citys = cityArray;
        state.johaps = johapArray;
      }
      // state.sidoValue = payload;
      state.cityValue = '';
      state.johapValue = '';
      state.danjiValue = '';
      state.shopValue = '';
    },
    changeCity: function (state, payload) {
      state.searchParameters.cityCode = payload;
      state.searchParameters.danjiCode = '';
      state.searchParameters.shopCode = '';
      state.danjis = [];
      state.shops = [];
      if (payload !== "") {
        let danjiArray = new Array();
        if (codeDanji[payload] !== undefined) {
          let danji_map = Object.keys(codeDanji[payload]).map(function (key) {
            let data = new Object();
            data.VALUE = String(key);
            data.TEXT = codeDanji[payload][key];
            if (data !== null) {
              danjiArray.push(data);
            }
          });
          state.danjis = danjiArray;
        }
      }
      state.danjiValue = '';
      state.shopValue = '';
    },
    changeDanji: function (state, payload) {
      state.searchParameters.danjiCode = payload;
      state.searchParameters.shopCode = '';
      state.shops = [];
      if (payload !== "") {
        let shopArray = new Array();
        if (codeShop[payload] !== undefined) {
          let shop_map = Object.keys(codeShop[payload]).map(function (key) {
            let data = new Object();
            data.VALUE = String(key);
            data.TEXT = codeShop[payload][key];
            shopArray.push(data);
          });
          state.shops = shopArray;
        }
      }
      state.shopValue = '';
    },
    changeJohap: function(state, payload){
      state.searchParameters.johapCode = payload;
    },
    changeShop: function (state, payload) {
      state.searchParameters.shopCode = payload;
    }
  },

  actions: {}
});
export default carCodeStore

