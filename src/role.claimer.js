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

            var room = Game.rooms[creep.memory.room];

            var ctrl = room.controller;

            if(creep.reserveController(ctrl) == ERR_NOT_IN_RANGE) {
                creep.moveTo(ctrl);
            }
        }
    }
})();