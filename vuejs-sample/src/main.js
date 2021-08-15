/* eslint-disable import/first */
import router from './router';
import store from './store';

import BootstrapVue from 'bootstrap-vue';
import BlockUI from 'vue-blockui';
import Popper from 'popper.js';
import globals from '@/globals';
// vue prototype은 이곳에 모아둡니다.
import util from './config/vue-exlib';
// validator 입니다. ex:https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fform&module=%2Fsrc%2Fcomponents%2FForm.vue
import VeeValidate from 'vee-validate';
// validator locale ko로 등록하기위한 js입니다.
import ko from 'vee-validate/dist/locale/ko.js';

import MoonLoader from 'vue-spinner/src/MoonLoader.vue';
import MoonLoading from '@/components/common/loading/MoonLoading';
import VueProgressBar from 'vue-progressbar';

import Vue from 'vue';
import App from './App';
require('es6-promise').polyfill();
window.$ = window.jQuery = require('jquery');
// 프로토타입
import prototype from '@/prototype/prototype';
Vue.use(prototype);
// 시간관련
import vueMoment from 'vue-moment';
Vue.use(vueMoment);
// 캘린더
import DatePicker from 'v-calendar';



// import 'v-calendar/lib/v-calendar.min.css'
Vue.use(DatePicker);
Vue.use(util, '$util');
Vue.use(VeeValidate, {
	locale: 'ko',
	dictionary: {
		ko,
	},
	fieldsBagName: 'formFields',
	// ,inject: false
});

Vue.use(VueProgressBar, {
	color: '#bffaf3',
	failedColor: 'red',
	height: '2px',
	thickness: '5px',
	transition: {
		speed: '0.2s',
		opacity: '0.6s',
		termination: 300,
	},
	autoRevert: true,
	location: 'top',
	inverse: false,
});

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BlockUI);

// globals RTL flag
Vue.mixin({
	data: globals,
	components: {
		'moon-loader': MoonLoader,
		'moon-loading': MoonLoading
	},
});

/* eslint-disable no-new */
export default new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {App},
});
