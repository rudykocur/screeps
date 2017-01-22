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

            var room = Game.rooms[creep.memory.room];

            if(!room) {
                return;
            }

            var ctrl = room.controller;

            if(creep.memory.claim) {
                if(creep.claimController(ctrl) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ctrl);
                }
                return;
            }

            let result;
            if(!ctrl.my && ctrl.owner) {
                result = creep.attackController(ctrl)
            }
            else {
                result = creep.reserveController(ctrl);
            }

            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(ctrl);
            }
            else if(result == OK) {
                creep.setPrespawnTime();
            }
        }
    }
})();