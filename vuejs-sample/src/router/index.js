// routes
import dashboardsRoutes from './dashboards'
import loginRoutes from './routers/login'
import homeRoutes from './routers/home'
import userRoutes from './routers/users'
import samples from './routers/samples'
import systems from './routers/systems'
import notfound from './routers/notfound'
import supports from './routers/supports'
import services from './routers/services'
import statistics from './routers/statistics'
import car from './routers/car'
import {ApiClient} from '../utils/http'

import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import VueCookies from 'vue-cookie'
import Notifications from 'vue-notification'
import Toasted from 'vue-toasted'
import globals from '@/globals'
require('es6-promise').polyfill()

Vue.use(Router)
Vue.use(Meta)
Vue.use(Notifications)
Vue.use(Toasted)

const ROUTES = [
  // Default route
  { path: '', redirect: '/login' }
]
  .concat(loginRoutes)
  .concat(dashboardsRoutes)
  .concat(homeRoutes)
  .concat(userRoutes)
  .concat(samples)
  .concat(systems)
  .concat(supports)
  .concat(services)
  .concat(car)
  .concat(statistics)
  .concat(notfound)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: ROUTES
})

const auth = {
  loggedIn: undefined,
  getAuth: function () {
    // localstorage로 가져올 경우 아래 코드 주석 해제
    // console.log(VueLocalStorage.get('_authorization', null, ""));
    // this.loggedIn = VueLocalStorage.get('_authorization', null, "");

    // cookie로 가져올 경우
    VueCookies.install(Vue)

    // console.log(VueCookies.get('_authorization'))
    this.loggedIn = VueCookies.get('_authorization')
  }
}

router.afterEach(() => {
  // On small screens collapse sidenav
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }

  // Scroll to top of the page
  globals().scrollTop(0, 0)
})

let _menuPath = ''

router.beforeEach((to, from, next) => {
  if (auth.loggedIn == null) {
    auth.getAuth()
  }
  // route의 auth확인
  if (to.matched.some(function (routeInfo) {
    // console.log(routeInfo.meta.requiresAuth)
    return routeInfo.meta.requiresAuth
  })) {
    // console.log(auth.loggedIn)
    if (!auth.loggedIn) {
      alert('로그인을 해주세요.')
      next({path: '/login', query: {redirect: to.fullPath}})
    } else {
      // console.log("routing success : '" + to.path + "'")
      _menuPath = to.path
      next()
    }
  } else {
    // console.log("routing success : '" + to.path + "'")
    _menuPath = to.path
    next()
  }

  // Set loading state
  document.body.classList.add('app-loading')

  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10)

  const parameters = {
    params: {'menu-url': _menuPath}
  }

  let client = new ApiClient()
  client.get('/menu-path/log', parameters)
    .then(() => {})
})

export default router
