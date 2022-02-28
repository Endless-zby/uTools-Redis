// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axiosApi from '../src/api/axios.js'
import redisApi from '../src/api/redis.js'
import md5 from 'js-md5';
import JsonViewer from 'vue-json-viewer'
import vueJsonEditor from 'vue-json-editor'
Vue.use(JsonViewer)
Vue.use(vueJsonEditor)
Vue.use(axiosApi)
Vue.use(ElementUI)
Vue.use(redisApi)
Vue.prototype.$md5 = md5;
new Vue({
  el: '#app',
  render: h => h(App)
})

