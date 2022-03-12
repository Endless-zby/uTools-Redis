const fs = require('fs');
const p = require('path');
const redis = require('redis');

console.log("preload js loaded")

clientMap = new Map()

let getClient = async(id) => {
  const doc = await new Promise((resolve) => {
    console.log(id)
    const client = clientMap.get(id)
    console.log(client)
    if(client){
      return resolve(client);
    }else {
      const config = utools.db.get('config/' + id).data
      console.log(11111)
      console.log(config)
      const client = redis.createClient({host: config.host, port: config.port});
      if(config.auth !== ''){
        // 密码
        console.log("需要密码")
        client.auth(config.auth)
      }
      client.on("error", function(err){
        console.log(err.toString())
        return resolve(err.toString());
      })
      clientMap.set(id,client)
      return resolve(client);
    }
  });
  console.log(doc)
  return doc;
}

let getText = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.get(key, function (err, res) {
        console.log('value :  ' + res)
        return resolve(res);
      });
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let getKeyLists = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.lrange(key,0,-1, function (err, res) {
        console.log(typeof res)
        return resolve(res);
      });
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let getHashKeys = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.hgetall(key, function (err, res) {
        console.log(typeof res)
        return resolve(res);
      });
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let getkeyType = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.type(key, function (err, res) {
        console.log('value :  ' + res)
        return resolve(res);
      });
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let getkeyTTls = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.ttl(key, function (err, res) {
        console.log('ttl :  ' + res)
        return resolve(res);
      });
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};
let expire = async(id,key,seconds)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.expire(key, seconds);
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let setStringKeys = async(id,key,value,seconds)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      console.log(key + '---' + value)
      client.set(key, value);
      console.log(33333333333)
      if(seconds !== -1){
        client.expire(key, seconds);
      }
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};


let setListKeys = async(id,key,value,seconds)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.rpush(key, value);
      if(seconds !== -1){
        client.expire(key, seconds);
      }
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};


let updateListValues = async(id,key,index,value)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.lset(key, index ,value)
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let updateHashValues = async(id,key,field,value)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.hset(key, field ,value)
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};


let del = async(id,key)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.del(key);
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let updateKeys = async(id,oldKey,newKey)=>{
  const doc = await new Promise((resolve) => {
    getClient(id).then((client) => {
      client.rename(oldKey,newKey);
      return resolve(true);
    }).catch((error) => {
      console.log(error)
    });
  });
  console.log(doc)
  return doc;
};

let getAllKeys = async(id,key)=>{
  const doc = await new Promise((resolve) => {
   getClient(id).then((client) => {
     console.log('rrrrr' + client)
     client.keys(key + '*', function (err, res) {
       console.log('sss' + res)
       return resolve(res);
     });
   }).catch((error) => {
     console.log(error)
   });
  });
  return doc;
};

let isConnect = async(port, host, auth)=>{
  const doc = await new Promise((resolve) => {
   const redisConnect = redis.createClient({host: host, port: port, auth: auth});
    if(auth !== ''){
      // 密码
      console.log("需要密码")
      redisConnect.auth(auth)
    }
    redisConnect.on("ready", function(err){
      if(err){
        redisConnect.quit();
        return resolve({"status":"-1","error":err});
      }else{
        console.log(redisConnect.server_info)
        console.log("redis ready");
        redisConnect.quit();
        return resolve(redisConnect.server_info);
      }
    })
  });
  console.log(doc)
  return doc;
};

window.isRedisConnect = async(port, host, auth) =>{
  return await isConnect(port, host, auth);
};


window.getKey = async(id,key) =>{
  return await getText(id,key);
};
window.getKeyTTl = async(id,key) =>{
  return await getkeyTTls(id,key);
};
window.getKeyList = async(id,key) =>{
  return await getKeyLists(id,key);
};

window.getkeyType = async(id,key) =>{
  return await getkeyType(id,key);
};

window.getKeys = async(id,key) =>{
  return await getAllKeys(id,key);
};

window.updateTTl = async(id,key,seconds) =>{
  return await expire(id,key,seconds);
};

window.delKey = async(id,key) =>{
  return await del(id,key);
};

window.setStringKey = async(id,key,value,seconds) =>{
  return await setStringKeys(id,key,value,seconds);
};

window.setListKey = async(id,key,value,seconds) =>{
  return await setListKeys(id,key,value,seconds);
};

window.getHashKey = async(id,key) =>{
  return await getHashKeys(id,key);
};


window.updateKey = async(id,oldKey,newKey) =>{
  return await updateKeys(id,oldKey,newKey);
};

window.updateListValue = async(id,key,index,value) =>{
  return await updateListValues(id,key,index,value);
};

window.updateHashValue = async(id,key,field,value) =>{
  return await updateHashValues(id,key,field,value);
};

