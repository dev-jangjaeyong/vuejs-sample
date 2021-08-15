// import VueLocalStorage from './VueLocalStorage.js';
import http from './../utils/http'
import VueCookies from 'vue-cookie'
import global from './g-properties'
import tree from './../utils/tree'
import commons from './../utils/utils'
import commSearch from "../store/CommCode/index";
import carCodeStore from "../store/CarSaleCode/index";


export default {
  install (Vue, name = '$util') {
    Vue.prototype.$cookie = VueCookies;
    Vue.prototype.$http = http;
    Vue.prototype.$tree = tree;
    Vue.prototype.$commSearch = commSearch;
    Vue.prototype.$carCodeStore = carCodeStore;
    Vue.prototype.$global = global;
    Vue.prototype.$commons = commons;
    Vue.prototype.$EventBus = new Vue()
  }
}
