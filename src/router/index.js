import Vue from 'vue'
import Router from 'vue-router'
import RedisIndex from '@/components/RedisIndex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RedisIndex',
      component: RedisIndex
    }
  ]
})
