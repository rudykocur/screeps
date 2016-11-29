const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

            if(target) {
                if(creep.pos.isNearTo(target)) {
                    creep.attack(target);
                }
                else {
                    creep.moveTo(target);
                }
            }
            else {
                var flags = _.groupBy(Game.flags, 'room.name')[creep.pos.roomName];

                creep.moveTo(flags[0].pos);
            }
        }
    }
})();