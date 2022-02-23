const fs = require('fs');
const p = require('path');
const redis = require('redis');

console.log("preload js loaded")

let client = '';


window.readMarkdownFile = function (path) {
  if (path.match(/\.md$/i)) {
    return fs.readFileSync(path, {
      encoding: "utf-8"
    });
  } else {
    return "";
  }
}

window.writeMarkdownFile = function (path, content) {
  if (fs.existsSync(path)) {
    if (path.match(/\.md$/i)) {
      fs.writeFileSync(path, content)
      return true;
    } else {
      return false;
    }
  } else {
    fs.writeFileSync(path, content)
    return true;
  }
}

window.getFileDirectory = function (path) {
  return p.dirname(path);
}




window.connRedis = function (port, host, auth) {
  client = redis.createClient({host: host, port: port});
  if(auth !== '') {
    client.auth_pass(auth);
  }
  return client;
}

window.getKey=function(key){
  client.get(key, function(err, value) {
    if (err) throw err;
    console.log('Got: ' + value)
    client.quit();
  })
  return 11111
};
