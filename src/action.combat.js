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

    }
})();