<template>
  <RedisIndex></RedisIndex>
</template>
<script>
import RedisIndex from "./components/RedisIndex";
export default {
  name: 'App',
  components: {RedisIndex},
}



utools.onPluginEnter(({code, type, payload}) => {
  console.log('用户进入插件', code, type, payload)
})
utools.onPluginReady(() => {
  console.log('插件装配完成，已准备好')
})
utools.onPluginOut(() => {
  console.log('用户退出插件')
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
