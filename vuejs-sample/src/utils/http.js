import axios from 'axios';
import Raven from 'raven-js';
import $cookie from 'vue-cookie';
import $router from './../router/index';
import GProperties from '../config/g-properties';
import app from '../main';

const getClient = (baseUrl = null) => {
	const options = {
		baseURL: baseUrl == null ? GProperties.API_URL : baseUrl,
		withCredentials: true,
	};

	if ($cookie.get(GProperties.ACCESS_TOKEN_COOKIE_NAME)) {
		options.headers = {
			Authorization: $cookie.get(GProperties.ACCESS_TOKEN_COOKIE_NAME),
			chnnlCode: 'ADM',
			pid: 'BIG_CM',
		};
	}
	axios.defaults.params = {};
	axios.defaults.params['chnnlCode'] = 'ADM';
	axios.defaults.params['pid'] = 'BIG_CM';

	const $http = axios.create(options);

	// Add a request interceptor
	$http.interceptors.request.use(
		(requestConfig) => {
			if (window.routerView !== undefined) {
				window.routerView.$parent._data.loading = true;
			}
			app.$Progress.start();
			return requestConfig;
		},
		(requestError) => {
			Raven.captureException(requestError);

			return Promise.reject(requestError);
		},
	);

	// Add a response interceptor
	$http.interceptors.response.use(
		(response) => {
			if (window.routerView !== undefined) {
				window.routerView.$parent._data.loading = false;
			}
			app.$Progress.finish();
			// console.log(response)
			if (response.data.apiCode === 'E011') {
				$cookie.set(
					GProperties.ACCESS_TOKEN_COOKIE_NAME,
					response.data.tokenId.replace(/"/g, ''),
				);
			}
			return response;
		},
		(error) => {
			if (error.response.status >= 500) {
				// console.log('★★★★★★★★★★★★★★★★★★')
				// console.log(error.response)
				if (error.response.data.message === 'E016') {
					alert(
						'페이지가 만료되었습니다. 로그인페이지로 이동합니다.',
					);
					$router.push({path: '/login'});
					app.$store.dispatch('LOGOUT');
				}
				// console.log('★★★★★★★★★★★★★★★★★★')
				Raven.captureException(error);
			}

			if (error.response.status === 401) {
				// console.log('router.currentRoute.fullPath : ' + $router.currentRoute.fullPath)
				if (!app.$store.getters.getIsLogoutTry) {
					Raven.captureException(error);
					if ($router.currentRoute.fullPath !== '/login') {
						alert('인증이 필요합니다. 인증페이지로 이동합니다.');
						$router.push({path: '/login'});
						app.$store.dispatch('LOGOUT');
					}
					app.$store.dispatch('LOGOUT_TRY_STATE', true);
				} else {
					// app.$store.dispatch('LOGOUT_TRY_STATE', true)
				}
			}

			if (error.response.status === 400) {
				Raven.captureException(error);

				let data = error.response.data;

				if (data.apiStatus === 'NOT_EXISTS_AUTHORITY') {
					alert(
						data.message +
							'\nURI: ' +
							data.resultObject.uri +
							'\nMethod: ' +
							data.resultObject.method,
					);
				}
			}

			if (window.routerView !== undefined) {
				window.routerView.$parent._data.loading = false;
			}

			return Promise.reject(error);
		},
	);

	return $http;
};

class ApiClient {
	constructor(baseUrl = null) {
		this.client = getClient(baseUrl);
	}

	get(url, conf = {}) {
		return this.client
			.get(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	delete(url, conf = {}) {
		return this.client
			.delete(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	head(url, conf = {}) {
		return this.client
			.head(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	options(url, conf = {}) {
		return this.client
			.options(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	post(url, data = {}, conf = {}) {
		console.log(url);
		return this.client
			.post(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	put(url, data = {}, conf = {}) {
		return this.client
			.put(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}

	patch(url, data = {}, conf = {}) {
		return this.client
			.patch(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	}
}

export {ApiClient};

/**
 * Base HTTP Client
 */
export default {
	// Provide request methods with the default base_url
	get(url, conf = {}, method) {
		return getClient()
			.get(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	delete(url, conf = {}) {
		return getClient()
			.delete(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	head(url, conf = {}) {
		return getClient()
			.head(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	options(url, conf = {}) {
		return getClient()
			.options(url, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	post(url, data = {}, conf = {}) {
		return getClient()
			.post(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	put(url, data = {}, conf = {}) {
		return getClient()
			.put(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},

	patch(url, data = {}, conf = {}) {
		return getClient()
			.patch(url, data, conf)
			.then((response) => Promise.resolve(response))
			.catch((error) => Promise.reject(error));
	},
};
