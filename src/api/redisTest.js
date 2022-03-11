const redis = require("redis");
// const client = redis.createClient();
// 不使用默认连接方式时，使用如下方式创建客户端：
const client = redis.createClient({host:'127.0.0.1', port:6379});
client.auth('zby123456')
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
    console.log(client.server_info)
  }
})

client.on("connect", function(err){
  if(err){
    console.log("Error " + error);
  }else{
    console.log("redis connect");
    console.log(client.server_info)
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






// let list = []
// client.hgetall('hash key', function (err, res) {
//   console.log(res)
//   console.log(555555555555)
//   list = res
//   // console.log(JSON.parse(res))
//
//   console.log(444444444444)
// });
// client.lrange('zbylist', 0 ,-1, function (err, res) {
//   console.log(res)
//   console.log(typeof res)
//   list = res
//   console.log(444444444444)
// });
// console.log(list)
// client.set("string key", "string val", redis.print);
// client.set("string484848", '{\n' +
//   '    "dsdsd": {\n' +
//   '        "dsfdfd": "454545"\n' +
//   '    },\n' +
//   '    "ryrthtyjyj": "sdfsdfs"\n' +
//   '}');
// client.rpush("byzhaolist", [4545,'gfgfg',999999]);
// client.rpush("byzhaolist", 66666);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   console.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });
//
// client.lrange('byzhaolist', 0 ,-1, function (err, res) {
//   console.log(res)
//   console.log(typeof res)
//   res.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
//   list = res
//   console.log(5555555)
// });
//
// var type = ''
// type = 'list'
// console.log('list' === type);
//
// console.log('-----------------------')
// console.log(client.server_info);
// console.log('-----------------------')
// client.set("rtrtrtrtrt", "555555555", redis.print);
// client.expire("rtrtrtrtrt", 2000);
// // -1, 如果key没有到期超时。
// // -2, 如果键不存在。
// client.ttl("rtrtrtrtrt",function (err, res) {
//   console.log(res)
//   list = res
//   console.log(6666666666666)
// })



