import Vue from 'vue'
import Vuex from 'vuex'
import {ApiClient} from '../utils/http'
import VueCookies from 'vue-cookie'
import $global from './../config/g-properties'
import CreatePersistedState from 'vuex-persistedstate'
import VueSession from 'vue-session'
import Router from '@/router/index.js'

/*모듈적용 import*/



Vue.use(Vuex)
Vue.use(VueSession)

const loginPersisted = new CreatePersistedState({
  key: 'loginuser',
  storage: this.$session,
  reducer: state => ({
    accessToken: state.accessToken
  }),
  filter: mutation => (
    mutation.type === 'LOGIN' || mutation.type === 'LOGOUT'
  )
})

export default new Vuex.Store({
  state: {
    accessToken: null,
    isLogoutTry: false,
  },
  plugins: [loginPersisted],
  getters: {
    getAccessToken: function (state) {
      return state.accessToken
    },
    getIsLogoutTry: function (state) {
      return state.isLogoutTry
    }
  },
  mutations: {
    LOGIN (state, accessToken) {
      state.accessToken = accessToken
      // console.log(state)
    },
    LOGOUT (state) {
      state.accessToken = null
    },
    LOGOUT_TRY_STATE (state, value) {
      state.isLogoutTry = value
    }
  },
  actions: {
    LOGIN ({commit}, {username, password, rememberMe}) {
      let credentials = {
        username: username,
        password: password,
        //rememberMe: rememberMe,
        // pid: 'HNC_DRC',
        chnnlCode: 'ADM',
        userTyCd: '200'
      }

      login()

      function login () {
        auth()
          .then(function () { return getUserInfo() })
          .then((e) => console.log(e))
      }

      function auth () {
        return new Promise(function (resolve, reject) {
          // console.log(credentials)
          let client = new ApiClient()
          // console.log(credentials)
          client.post($global.API_URL + '/login', credentials).then((response) => {
            console.log(credentials);
            console.log(response);
            VueCookies.set($global.ACCESS_TOKEN_COOKIE_NAME, response.data.resultObject)
            resolve()
          })
            .catch(function (error) {
              alert(error.response.data.message)
              // reject
            })
        })
      }

      function getUserInfo () {
        return new Promise(function (resolve, reject) {
          let client = new ApiClient()

          client.get('/user/info', {}, {headers: {'_method': 'GET'}})
            .then(
              (response) => {
                // VueCookies.set($global.USER_INFO, JSON.stringify(response.data.resultObject))
                commit('LOGIN', response.data.resultObject)
              }
            )
            .then(function () {
              Router.push({path: '/home'})
            })
            .catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    LOGOUT ({commit}) {
      VueCookies.delete($global.ACCESS_TOKEN_COOKIE_NAME)
      commit('LOGOUT')
    },
    LOGOUT_TRY_STATE ({commit}, loginState) {
      commit('LOGOUT_TRY_STATE', loginState)
    }
  }
})
