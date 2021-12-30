// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'

import axios from 'axios' // 1、在这里引入axios

Vue.prototype.$axios = axios;

Vue.use(ElementUI);
Vue.use(Router);
Vue.use(Vuex);

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:8088'
// axios.defaults.headers = {'Content-Type':'application/x-www-form-urlencoded'}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
