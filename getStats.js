'use strict';
const ScreepsAPI = require('screeps-api');
const WebSocket = require('ws');
const fs = require('fs');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9201',
  // log: 'trace'
});

let auth = {};

if (process.argv.length == 3) {
  auth = require('./'+process.argv[2])
}

let api = new ScreepsAPI(auth);

Promise.resolve()
    .then(()=>api.connect())
    .then(()=>api.memory.get('stats'))
    .then(memory=> {
        fs.writeFileSync('memory.json', JSON.stringify(memory));
        console.log(JSON.stringify(memory, null, '\t'));

        memory.expenses.forEach(data => {
            var esId = `${data.tick}-${data.eventDate}`;

            client.exists({
                index: 'screeps_test',
                type: 'balance',
                id: esId,
            }, (error, exists) => {
                if(exists === false) {
                    client.create({
                        index: 'screeps_test',
                        type: 'balance',
                        id: esId,
                        body: data
                    }, (error, resp) => {
                        if(error) {
                            console.log('OMG OMG', error);
                        }
                    });
                }
            })


        });
    })
    .catch(err=>console.error(err));
