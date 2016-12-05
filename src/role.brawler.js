const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');
const actionCombat = require('action.combat');

module.exports = (function() {

    return {
        /**
         * test
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

            var target;

            if(creep.memory.attackTarget) {
                target = Game.getObjectById(creep.memory.attackTarget);
            }
            else if(creep.memory.moveFlag) {
                target = Game.flags[creep.memory.moveFlag];
            }
            else {
                target = actionCombat.findAttackTarget(creep);
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
                if(creep.getActiveBodyparts(HEAL) > 0) {
                    if(creep.hits < creep.hitsMax) {
                        creep.heal(creep);
                    }
                    else {
                        var wounded = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                            filter: c => c.hits < c.hitsMax
                        });

                        if(wounded) {
                            if(creep.heal(wounded) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(wounded);
                            }

                            creep.rangedHeal(wounded);
                        }
                    }
                }

                var flags = _.groupBy(Game.flags, 'room.name')[creep.pos.roomName];

                if(flags && flags.length > 0) {
                    creep.moveTo(flags[0].pos);
                }
            }
        }
    }
})();