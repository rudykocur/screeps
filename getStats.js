'use strict';
const ScreepsAPI = require('screeps-api');
const WebSocket = require('ws');
const fs = require('fs');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  // host: 'localhost:9201',
  host: '192.168.0.3:9200',
  // log: 'trace'
});

let auth = {};

if (process.argv.length == 3) {
  auth = require('./'+process.argv[2])
}

let api = new ScreepsAPI(auth);

Promise.resolve()
    .then(()=>api.connect())
    .then(() => {
        setInterval(() => {
            api.memory.get('stats')
                .then(memory=> {

                    console.log(new Date(), 'Fetched', memory.expenses.length, 'balance events,', memory.cpu.length, 'cpu events');

                    memory.expenses.forEach(data => {
                        var esId = `${data.tick}-${data.eventDate}`;

                        client.exists({
                            index: 'screeps_test',
                            type: 'balance',
                            id: esId,
                            refresh: "wait_for",
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

                    memory.cpu.forEach(data => {
                        var esId = `${data.tick}-cpu-${data.eventDate}`;

                        client.exists({
                            index: 'screeps_test',
                            type: 'cpu',
                            id: esId,
                            refresh: "wait_for",
                        }, (error, exists) => {
                            if(exists === false) {
                                client.create({
                                    index: 'screeps_test',
                                    type: 'cpu',
                                    id: esId,
                                    body: data
                                }, (error, resp) => {
                                    if(error) {
                                        console.log('OMG OMG', error);
                                    }
                                });
                            }
                        })
                    })
                })
        }, 30000);
    })
    .catch(err=>console.error(err));
