const fs = require('fs');
const p = require('path');
const redis = require('redis');

console.log("preload js loaded")

clientMap = new Map()
let client = '';

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

let getText = async(key)=>{
  const doc = await new Promise((resolve) => {
    client.get(key, function (err, res) {
      console.log('sss' + res)
      return resolve(res);
    });
  });
  console.log(doc)
  return JSON.parse(doc);
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
    redisConnect.on("connect", function(err){
      if(err){
        redisConnect.quit();
        return resolve(err);
      }else{
        redisConnect.quit();
        return resolve(1);
      }
    })
    redisConnect.on("error", function(err){
      console.log(err)
      redisConnect.quit();
      return resolve(err);
    })
  });
  console.log(doc)
  return JSON.parse(doc);
};

window.isRedisConnect = async(port, host, auth) =>{
  return await isConnect(port, host, auth);
};


window.getKey = async(id,key) =>{
  return await getText(id,key);
};

window.getKeys = async(id,key) =>{
  return await getAllKeys(id,key);
};

