const utils = require('utils');

const roomHandlers = require('room.handlers');

module.exports = (function() {
    var queues = {};

    var getCreepId = _.partial(utils.getNextId, 'creepId');

    return {
        // required for colony to function - movers, harvesters
        PRIORITY_CRITICAL: 'critical',
        // creeps for defending rooms
        PRIORITY_DEFENCE: 'defence',
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

            for(var priority of [e.PRIORITY_CRITICAL, e.PRIORITY_DEFENCE, e.PRIORITY_HIGH, e.PRIORITY_NORMAL, e.PRIORITY_LOW]) {

                for(var request of queues[priority] || []) {
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

                    if(freeSpawn.canCreateCreep(request.body) != OK ) {
                        fullRooms.push(request.roomName);
                        continue;
                    }

                    request.memo.room = request.memo.room || handler.room.name;

                    var newCreepName = freeSpawn.createCreep(request.body, request.name, request.memo);

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