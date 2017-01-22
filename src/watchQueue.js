var _ = require("lodash");
var profiler = require('./profiler-impl');

var logger = require('./logger');
var F = logger.fmt;
var config = require('./config');

module.exports = (function() {
    var alwaysVisible = [];
    var watchQueue = [];

    return {

        initialize: function() {
            let key = config.monitoring.watch.toString();

            if(!('watchQueue' in Memory)) {
                logger.log(F.orange("Initialized watchQueue."));
                Memory.watchQueue = {
                    key: key,
                    roomQueue: config.monitoring.watch.slice(),
                }
            }

            if(Memory.watchQueue.key != key) {
                logger.log(F.orange("Watch queue changed. Regenerating...", key));
                Memory.watchQueue = {
                    key: key,
                    roomQueue: config.monitoring.watch.slice(),
                    visibleRooms: [],
                }
            }

            alwaysVisible = config.monitoring.alwaysVisible.slice();
            watchQueue = Memory.watchQueue.roomQueue;
        },

        getNextRoom: function() {
            if(alwaysVisible.length > 0) {
                return alwaysVisible.pop();
            }

            let room = watchQueue.shift();
            watchQueue.push(room);
            return room;
        },

        registerRoomVisibleNextTick(roomId) {
            Memory.watchQueue.visibleRooms.push(roomId);
        },

        processVisibleRooms() {
            Memory.watchQueue.visibleRooms.forEach(roomId => {
                // module.exports.inspectRoom(roomId);
            });

            Memory.watchQueue.visibleRooms = [];
        },

        inspectRoom(roomName) {
            /** @type Room */
            let room = Game.rooms[roomName];

            if(!room) {
                this.info(F.orange('Unable to inspect room', roomName));
                return;
            }

            if(room.controller && room.controller.my) {
                console.log('Room', roomName, ':: IZ MINE');
                return;
            }

            if(room.controller) {
                if(room.controller.owner) {
                    console.log('Room', roomName, '::', room.controller.owner.username);
                }
                else if(room.controller.reservation) {
                    console.log('Room', roomName, '::', room.controller.reservation.username, '- reservation');
                }
                else {
                    console.log('Room', roomName, ':: IZ EMPTY');
                }
            }
            else {
                console.log('Room', roomName, '::', room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_KEEPER_LAIR}}))
            }
        }
    }
})();

profiler.registerObject(module.exports, 'watchQueue');