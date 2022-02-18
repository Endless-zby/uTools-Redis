
const redis = require("redis");
const { promisify } = require("util");
import { REDIS_HOST } from './config.js'

// 除了日志队列之外的数据，放到db1中
const redisClient = redis.createClient({
  host:REDIS_HOST,
  port:"6379",
  db: 0
});

console.log(redis.hget('zby'))

// redis 库原生不支持promise，需要处理一下
const hset = promisify(redisClient.hset).bind(redisClient);
const hget = promisify(redisClient.hget).bind(redisClient);
const rpop = promisify(redisClient.rpop).bind(redisClient);
const lpush = promisify(redisClient.lpush).bind(redisClient);
const hvals = promisify(redisClient.hvals).bind(redisClient);
const hdel = promisify(redisClient.hdel).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);

module.exports = {

  SESSION_SET:'session_set',
  INTERCEPTOR_META_SET:'interceptor_meta_set',
  APP_DICT:'app_dict',
  PAGE_ROUTE_DICT:'page_route_dict',
  INTERFACE_DICT:'interface_dict',
  LOG_QUEUE: 'log_queue',


  hset: function(key, field, value) {
    return hset(key, field, JSON.stringify(value))
  },
  hget: function(key, field) {
    return hget(key, field).then(result => {
      try {
        return JSON.parse(result)
      } catch(err) {
        return result
      }
    })
  },
  hvals: function(key) {
    return hvals(key).then(result => {
      try {
        return result.map(item => {
          return JSON.parse(item)
        })
      } catch(err) {
        return []
      }
    })
  },
  hdel: hdel,
  del: del,
  llen: llen,
  rpop: function(key) {
    return rpop(key).then(result => {
      try {
        return JSON.parse(result)
      } catch(err) {
        return result
      }
    })
  },
  lpush: function(key, value) {
    return lpush(key, JSON.stringify(value))
  },
  pushLog:function(key, value) {
    return lpush0(key, JSON.stringify(value))
  },
  popLog: function() {
    return rpop0(this.LOG_QUEUE).then(result => {
      try {
        return JSON.parse(result)
      } catch(err) {
        return result
      }
    })
  },
}

