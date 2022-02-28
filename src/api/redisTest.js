const redis = require("redis");
// const client = redis.createClient();
// 不使用默认连接方式时，使用如下方式创建客户端：
const client = redis.createClient({host:'127.0.0.1', port:6379});

// 如果想要选择第3个而不是第0个(默认)的数据库，调用方式如下：
// client.select(3, function() { /* ... */ });

// 注册事件，注意 ready 事件在 connect 事件前面
client.on("error", function(error){
  console.log("Error " + error);
  console.log("redis error");
});

client.on("ready", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis ready");
  }
})

client.on("connect", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis connect");
  }
})

client.on("reconnecting", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis reconnecting");
  }
})

client.on("end", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis end");
  }
})

client.on("warning", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis warning");
  }
})
let list = []
client.hgetall('hash key', function (err, res) {
  console.log(res)
  list = res
  console.log(444444444444)
});
client.lrange('zbylist', 0 ,-1, function (err, res) {
  console.log(res)
  console.log(typeof res)
  list = res
  console.log(444444444444)
});
console.log(list)
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
  console.log(replies.length + " replies:");
  replies.forEach(function (reply, i) {
    console.log("    " + i + ": " + reply);
  });
  client.quit();
});

var type = ''
type = 'list'
console.log('list' === type);
