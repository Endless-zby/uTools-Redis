console.info('sssssssssssss')

function creareRedis() {
  const redis = require('redis');
  console.info(redis)
  // const client = redis.RedisClient({'port': 6379, 'host': '172.16.192.211'})
  const client = redis.createClient({port: 6379, host: '172.16.192.211'});
  console.info(111)

  console.info(client.get('zby'))
  console.info(222)
}


export default {
  install: function (Vue) {
    Vue.prototype.creareRedis = () => creareRedis()
  }
}
