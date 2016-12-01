const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        hasCombatParts: function(creep) {
            return creep.getActiveBodyparts(ATTACK) ||
                creep.getActiveBodyparts(RANGED_ATTACK) ||
                creep.getActiveBodyparts(HEAL);
        },

        findAttackTarget: function(creep) {
            var target;

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_TOWER
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                    filter: c => module.exports.hasCombatParts(c) > 0 && creep.pos.getRangeTo(c) > 0
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

            return target;
        },

        // /**
        //  * @param {Creep} creep
        //  */
        // run:  function(creep) {
        //
        //     if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
        //         return;
        //     }
        //
        //
        //
        //     if(target) {
        //
        //         if(creep.pos.isNearTo(target)) {
        //             creep.attack(target);
        //         }
        //         else {
        //             creep.moveTo(target);
        //         }
        //     }
        //     else {
        //         var flags = _.groupBy(Game.flags, 'room.name')[creep.pos.roomName];
        //
        //         if(flags && flags.length > 0) {
        //             creep.moveTo(flags[0].pos);
        //         }
        //     }
        // }
    }
})();