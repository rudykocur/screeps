const config = require('config');
const logger = require('logger');
const creepSpawn = require('creepSpawn');

const roleCollector = require('role.collector');

module.exports = (function() {
    return {
        /**
         * Required data in Memory:
         * Memory.roomHandlers.N01E01 = {type: 'outpost', homeRoom: 'N02E01'}
         */
        handler: class ColonyRoomHandler {
            constructor(room, state, config) {
                this.room = room;
                this.state = state;
                this.config = config;

                // this.state.collectors = this.state.collectors || [];
            }

            debug(...messages) {
                var msg = `ColonyRoomHandler ${this.room.customName}: <span style="color: gray">${messages.join(' ')}</span>`;
                console.log(msg);
            }

            error(...messages) {
                var msg = `ColonyRoomHandler ${this.room.customName}: ${messages.join(' ')}`;
                logger.error(msg);
            }

            process() {
            }
        }
    }
})();