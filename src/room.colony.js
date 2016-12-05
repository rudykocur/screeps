const config = require('config');
const logger = require('logger');
const creepSpawn = require('creepSpawn');
const roomHandlers = require('room.handlers');

const roleCollector = require('role.collector');

module.exports = (function() {
    return {
        handler: class ColonyRoomHandler extends roomHandlers.RoomHander {
            constructor(room, state, config) {
                super(room, state, config);

                this.type = 'colony';
            }
        }
    }
})();