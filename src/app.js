import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueResource from 'vue-resource'
import routerConfig from './router'
import pullToRefresh from './directives/pullToRefresh'
import infiniteScroll from './directives/infiniteScroll'
import * as filters from './filters'
import app from './main'


// Router
Vue.use(VueRouter)

const router = new VueRouter({
  hashbang: true,
  history: true,
  saveScrollPosition: true,
  suppressTransitionError: true
})

routerConfig(router)

// Resource
// Vue.use(VueResource)
// Vue.http.options.root = process.env.NODE_ENV === 'development' ? 'src/assets/data' : '/vue-sui-demo/static/data'
// Vue.http.options.emulateJSON = true

// axios
Vue.use(VueAxios, axios)
// axios.defaults.baseURL = 'http://127.0.0.4:81'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// Directive
Vue.directive('pullToRefresh', pullToRefresh)
Vue.directive('infiniteScroll', infiniteScroll)

// Filters
Vue.filter('date', filters.dateFilter)
Vue.filter('program_status', filters.programStatusFilter)
Vue.filter('fee_type', filters.feeTypeFilter)

router.start(app, '#app')

window.router = router
