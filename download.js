'use strict';
const ScreepsAPI = require('screeps-api');
const WebSocket = require('ws');
const fs = require('fs');

let auth = {};
let api = new ScreepsAPI();

if (process.argv.length == 3) {
  auth = require('./'+process.argv[2])
}

Promise.resolve(auth)
  .then(connect)
  .then(start)
  .catch(() => {
    process.exit(1)
  });

function connect (auth) {
  return new Promise((resolve, reject) => {
    console.log('Authenticating...');
    api.auth(auth.email, auth.password, (err, result) => {
      if (result) {
        console.log('Authentication succeeded');
        resolve()
      }else {
        console.log('Authentication failed');
        reject()
      }
    })
  })
}

function start () {
  return new Promise((resolve, reject) => {
    run();
    api.socket(() => {
      console.log('start');
    })
  })
}

function run () {
    api.on('message', (msg) => {
        // console.log('MSG', msg)
        if (msg.slice(0, 7) == 'auth ok') {
            api.subscribe('/code')
        }
    });
}

api.on('code', (msg)=>{
    console.log('OMG CODE');
  let [user, data] = msg;
    if(!fs.existsSync(data.branch)) {
        fs.mkdirSync(data.branch);
    }

  for(let mod in data.modules){
    let file = `${data.branch}/${mod}.js`;
    fs.writeFileSync(file,data.modules[mod]);
    console.log('Wrote',file)
  }
});