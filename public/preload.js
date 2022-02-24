const fs = require('fs');
const p = require('path');
const redis = require('redis');

console.log("preload js loaded")

let client = '';

window.connRedis = function (port, host, auth) {
  client = redis.createClient({host: host, port: port});
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

let getAllKeys = async()=>{
  const doc = await new Promise((resolve) => {
    client.keys('*', function (err, res) {
      console.log('sss' + res)
      return resolve(res);
    });
  });
  console.log(doc)
  return JSON.parse(doc);
};

let isConnect = async(port, host, auth)=>{
  const doc = await new Promise((resolve) => {
   const redisConnect = redis.createClient({host: host, port: port, auth: auth});
    redisConnect.on("connect", function(err){
      if(err){
        return resolve(err);
      }else{
        return resolve(1);
      }
    })
    redisConnect.on("error", function(err){
      console.log(err)
      return resolve(err);
    })
  });
  console.log(doc)
  return JSON.parse(doc);
};

window.isRedisConnect = async(port, host, auth) =>{
  return await isConnect(port, host, auth);
};


window.getKey = async(key) =>{
  return await getText(key);
};

window.getKeys = async() =>{
  return await getAllKeys();
};

