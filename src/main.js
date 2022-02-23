// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axiosApi from '../src/api/axios.js'
import redisApi from '../src/api/redis.js'
Vue.use(axiosApi)
Vue.use(ElementUI)
Vue.use(redisApi)

new Vue({
  el: '#app',
  render: h => h(App)
})

