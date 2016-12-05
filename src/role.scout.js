const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {


    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(actionUtils.tryChangeRoom(creep, creep.memory.room, creep.memory.via)) {
                return;
            }

            var center = new RoomPosition(25, 25, creep.memory.room);
            var point = center.findClosestByRange(FIND_SOURCES);

            creep.moveTo(point);
        }
    }
})();