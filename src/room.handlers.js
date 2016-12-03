const config = require('config');
const logger = require('logger');

var roomHandlers = {
    outpost: require('room.outpost'),
    colony: require('room.colony'),
};

module.exports = (function() {

    return {
        processRoomHandlers: function() {
            Memory.rooms = Memory.rooms || {};

            try {
                _.each(config.rooms, (roomConfig, roomName) => {
                    Memory.rooms[roomName] = Memory.rooms[roomName] || {};

                    var clz = roomHandlers[roomConfig.type].handler;
                    var state = Memory.rooms[roomName];
                    var handler = new clz(Room.byCustomName(roomName), state, roomConfig);

                    handler.process();
                });
            }
            catch(e) {
                logger.error('Failure at processing rooms', e, '::', e.stack);
            }
        }
    }
})();