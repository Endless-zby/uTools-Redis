const redis = require("redis");
// const client = redis.createClient();
// 不使用默认连接方式时，使用如下方式创建客户端：
const client = redis.createClient({host:'172.16.192.211', port:6379});

// 如果想要选择第3个而不是第0个(默认)的数据库，调用方式如下：
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
  console.log("Error " + err);
});

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
