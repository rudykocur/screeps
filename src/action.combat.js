var profiler = require('./profiler-impl');
var _ = require('lodash');


var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');

module.exports = (function() {

    return {
        hasCombatParts: function(creep) {
            return creep.getActiveBodyparts(ATTACK) ||
                creep.getActiveBodyparts(RANGED_ATTACK) ||
                creep.getActiveBodyparts(HEAL);
        },
        
        findTargetInRange: function(obj, range) {
            var target = [];

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_STRUCTURES, range, {
                    filter: s => s.structureType == STRUCTURE_TOWER
                });
            }

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_CREEPS, range, {
                    filter: c => module.exports.hasCombatParts(c)
                });
            }

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_SPAWNS, range);
            }

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_CREEPS, range);
            }

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_STRUCTURES, range);
            }

            if(!target.length) {
                target = obj.pos.findInRange(FIND_HOSTILE_CONSTRUCTION_SITES, range);
            }

            if(target.length > 0) {
                return target[0];
            }
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
                    filter: c => creep.pos.getRangeTo(c) > 0
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_EXTENSION
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                    filter: c => creep.pos.getRangeTo(c) > 0
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: s => s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
            }

            return target;
        },

    }
})();

profiler.registerObject(module.exports, 'action-combat');