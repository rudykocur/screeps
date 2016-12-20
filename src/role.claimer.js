var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');

module.exports = (function() {


    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(creep.memory.fleePoint) {
                creep.moveTo(RoomPosition.fromDict(creep.memory.fleePoint));
                return;
            }

            if(actionUtils.tryChangeRoom(creep, creep.memory.room, creep.memory.via)) {
                return;
            }

            var room = Game.rooms[creep.memory.room];

            if(!room) {
                return;
            }

            var ctrl = room.controller;

            if(creep.memory.claim) {
                creep.claimController(ctrl);
                return;
            }

            let result = creep.reserveController(ctrl);

            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(ctrl);
            }
            else if(result == OK) {
                creep.setPrespawnTime();
            }
        }
    }
})();