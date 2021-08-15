import CommSidoCity from '@/common-sidocity.js';
import CommJohapDanjiShop from '@/common-johapdanjishop.js';

export default {
	SIDO_SETTING: function (state, payload) {
	  let commSidoCity = new CommSidoCity();
	  const __codeSido = commSidoCity.codeSido;

		let sidoArray = [];
		Object.keys(__codeSido).map(function (key) {
			let data = {};
			data.VALUE = String(key);
			data.TEXT = __codeSido[key];
			sidoArray.push(data);
		});
		state.sidos = sidoArray;
	},
	CHANGE_SIDO: function (state, payload) {
    let commSidoCity = new CommSidoCity();
    let commJohapDanjiShop = new CommJohapDanjiShop();

    const __codeCity = commSidoCity.codeCity;
    const __codeJohap = commJohapDanjiShop.codeJohap;

		state.sidoCode = payload;
		if (payload !== '') {
			let cityArray = [];
			let johapArray = [];
			Object.keys(__codeCity[payload]).map(function (key) {
				let data = {};
				data.VALUE = String(key);
				data.TEXT = __codeCity[payload][key];
				cityArray.push(data);
				//return [String(key), codeCity[e][key]];
			});
			Object.keys(__codeJohap[payload]).map(function (key) {
				let data = {};
				data.VALUE = String(key);
				data.TEXT = __codeJohap[payload][key];
				johapArray.push(data);
				//return [String(key), getCity[e][key]];
			});
			state.citys = cityArray;
			state.johaps = johapArray;
		}
	},
	CHANGE_CITY: function (state, payload) {
		state.areaCode = payload;
    let commJohapDanjiShop = new CommJohapDanjiShop();
    const __codeDanji = commJohapDanjiShop.codeDanji;

		if (payload !== '') {
			let danjiArray = [];
			if (__codeDanji[payload] !== undefined) {
				Object.keys(__codeDanji[payload]).map(function (
					key,
				) {
					let data = {};
					data.VALUE = String(key);
					data.TEXT = __codeDanji[payload][key];
					if (data !== null) {
						danjiArray.push(data);
					}
				});
				state.danjis = danjiArray;
			}
		}
	},
	CHANGE_DANJI: function (state, payload) {
		state.danjiCode = payload;
		state.shops = [];
    let commJohapDanjiShop = new CommJohapDanjiShop();
    const __codeShop = commJohapDanjiShop.codeShop;

		if (payload !== '') {
			let shopArray = [];
			if (__codeShop[payload] !== undefined) {
				Object.keys(__codeShop[payload]).map(function (
					key,
				) {
					let data = {};
					data.VALUE = String(key);
					data.TEXT = __codeShop[payload][key];
					shopArray.push(data);
				});
				state.shops = shopArray;
			}
		}
	},
	CHANGE_JOHAP: function (state, payload) {
		state.johapCode = payload;
	},
	CHANGE_SHOP: function (state, payload) {
		state.shopCode = payload;
	},
};
