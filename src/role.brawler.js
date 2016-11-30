const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {

    function hasCombatParts(creep) {
        return creep.getActiveBodyparts(ATTACK) || creep.getActiveBodyparts(RANGED_ATTACK) || creep.getActiveBodyparts(HEAL);
    }

    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

            var target;

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_TOWER
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                    filter: c => hasCombatParts(c) > 0 && creep.pos.getRangeTo(c) > 0
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                    filter: c => creep.pos.getRangeTo(c) > 0
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
            }

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

                if(flags && flags.length > 0) {
                    creep.moveTo(flags[0].pos);
                }
            }
        }
    }
})();