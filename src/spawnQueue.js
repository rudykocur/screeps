const logger = require('logger');
const utils = require('utils');
const bodyConfig = require('config.body');

const roomHandlers = require('room.handlers');

module.exports = (function() {
    var queues = {};

    var getCreepId = _.partial(utils.getNextId, 'creepId');

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

        enqueueCreep: function(priority, room, name, body, memo) {
            var queue = queues[priority] = queues[priority] || [];

            var request = {
                roomName: room.customName,
                name: name + getCreepId(),
                body: body,
                memo: memo,
            };

            queue.push(request);

            return request.name;
        },

        spawnCreeps: function() {
            var e = module.exports;

            var fullRooms = [];
            var blockedSpawns = [];
            var handlers = {};

            var priorities = [e.PRIORITY_CRITICAL, e.PRIORITY_DEFENCE, e.PRIORITY_CLAIMERS, e.PRIORITY_HIGH,
                e.PRIORITY_NORMAL, e.PRIORITY_LOW];

            for(var priority of priorities) {

                for(var request of _.shuffle(queues[priority] || [])) {
                    if(fullRooms.indexOf(request.roomName) >= 0) {
                        continue;
                    }

                    if(!handlers[request.roomName]) {
                        handlers[request.roomName] = roomHandlers.getRoomHandler(request.roomName);
                    }

                    var handler = handlers[request.roomName];
                    var freeSpawn = _.first(handler.getSpawns().filter(s => !s.spawning && blockedSpawns.indexOf(s.id) < 0));

                    if(!freeSpawn) {
                        fullRooms.push(request.roomName);
                        continue;
                    }

                    var body = request.body;

                    if(typeof body == "string") {
                        var rcl = bodyConfig.getEffectiveRcl(handler.room);
                        var bodyName = body;
                        body = bodyConfig.getBody(bodyName, rcl);

                        if(!body) {
                            logger.mail(logger.error(`Spawn ${freeSpawn.name} - cant find body for ${bodyName}`));
                            continue;
                        }
                    }

                    if(freeSpawn.canCreateCreep(body) != OK ) {
                        fullRooms.push(request.roomName);
                        continue;
                    }

                    request.memo.room = request.memo.room || handler.room.name;

                    var newCreepName = freeSpawn.createCreep(body, request.name, request.memo);

                    console.log('Spawn '+freeSpawn.name+': created creep. Name: ' + newCreepName+'. Queues:', module.exports.getSpawnStats());

                    blockedSpawns.push(freeSpawn.id);
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