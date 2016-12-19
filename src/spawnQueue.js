const _ = require("lodash");
const profiler = require('./profiler-impl');

const logger = require('./logger');
const utils = require('./utils');
const bodyConfig = require('./config.body');

const roomHandlers = require('./room.handlers');

module.exports = (function() {
    var queues = {};

    var getCreepId = _.partial(utils.getNextId, 'creepId');

    /**
     *
     * @param {roomName, name, body, memo} request
     */
    function registerCreepExpense(request) {
        var stats = Memory.stats = Memory.stats || {};

        stats.expenses = stats.expenses || [];

        var cost = _.sum(request.body.map(part => BODYPART_COST[part]));
        var roomName = Room.idToCustomName(request.memo.room);

        stats.expenses.push({
            room: roomName,
            expense: cost,
            type: 'spawn',
            tick: Game.time,
            role: request.memo.role,
            eventDate: new Date().toISOString(),
        });
    }

    return {
        // required for colony to function - movers, harvesters
        PRIORITY_CRITICAL: 'critical',
        // creeps for defending rooms
        PRIORITY_DEFENCE: 'defence',
        PRIORITY_CLAIMERS: 'claimers',
        // required for outposts to function - collectors, miners
        PRIORITY_HIGH: 'high',
        // when everythin is normal - upgraders, builders
        PRIORITY_NORMAL: 'normal',
        // helpers - claimers, scouts
        PRIORITY_LOW: 'low',

        reset: function() {
            queues = {};
        },

        enqueueCreep: function(priority, room, name, body, memo, callback, spawnRooms) {
            var queue = queues[priority] = queues[priority] || [];

            var request = {
                roomName: room.customName,
                spawnRooms: spawnRooms,
                name: name + getCreepId(),
                body: body,
                memo: memo,
                callback: callback
            };

            queue.push(request);

            return request.name;
        },

        spawnCreeps: function() {
            var e = module.exports;

            var blockedSpawns = [];
            var handlers = {};

            var priorities = [e.PRIORITY_CRITICAL, e.PRIORITY_DEFENCE, e.PRIORITY_CLAIMERS, e.PRIORITY_HIGH,
                e.PRIORITY_NORMAL, e.PRIORITY_LOW];

            for(var priority of priorities) {

                for(var request of _.shuffle(queues[priority] || [])) {

                    if(!handlers[request.roomName]) {
                        handlers[request.roomName] = roomHandlers.getRoomHandler(request.roomName);
                    }

                    var handler = handlers[request.roomName];

                    var spawnRooms = request.spawnRooms || [request.roomName];

                    spawnRooms.forEach(spawnRoom => {

                        if(request.spawned) {
                            return;
                        }

                        if(!handlers[spawnRoom]) {
                            handlers[spawnRoom] = roomHandlers.getRoomHandler(spawnRoom);
                        }

                        var spawnHandler = handlers[spawnRoom];

                        var freeSpawn = _.first(spawnHandler.room.getSpawns().filter(s => !s.spawning && blockedSpawns.indexOf(s.id) < 0));

                        if(!freeSpawn) {
                            return;
                        }

                        var body = request.body;

                        if(typeof body == "string") {
                            var rcl = bodyConfig.getEffectiveRcl(handler.room);
                            var bodyName = body;
                            body = bodyConfig.getBody(bodyName, rcl);

                            if(!body) {
                                logger.mail(logger.error(`Spawn ${freeSpawn.name} - cant find body for ${bodyName}`));
                                return;
                            }

                            request.body = body;
                        }

                        if(freeSpawn.canCreateCreep(body) != OK ) {
                            return;
                        }

                        request.memo.room = request.memo.room || handler.room.name;
                        request.memo.spawnTime = body.length * CREEP_SPAWN_TIME;

                        var newCreepName = freeSpawn.createCreep(request.body, request.name, request.memo);

                        if(newCreepName != request.name) {
                            logger.error('Failed to spawn creep', request.name);
                        }
                        else {
                            registerCreepExpense(request);
                        }

                        if(request.callback) {
                            request.callback(newCreepName);
                        }

                        console.log('Spawn '+freeSpawn.name+': created creep. Name: ' + newCreepName+'. Queues:', module.exports.getSpawnStats());

                        blockedSpawns.push(freeSpawn.id);

                        request.spawned = true;
                    });
                }
            }
        },

        getSpawnStats: function() {
            var allRequests = _.flatten(_.values(queues));
            var byRoom = _.groupBy(allRequests, 'roomName');
            return _.map(byRoom, (queue, roomName) => `${roomName}: ${queue.length}`).join(', ')
        }
    }
})();

profiler.registerObject(module.exports, 'spawnQueue');