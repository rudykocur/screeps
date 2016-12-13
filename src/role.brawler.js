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

            if(creep.memory.room && creep.pos.room != creep.memory.room) {
                var targetRoom = Game.rooms[creep.memory.room];
                if(!targetRoom) {
                    var roomFlag = _.first(_.filter(Game.flags, f => {
                        return f.pos.roomName == creep.memory.room && f.color == COLOR_ORANGE
                    }));

                    if(roomFlag) {
                        creep.moveTo(roomFlag, {
                            costCallback: actionUtils.costCallback
                        });
                        return;
                    }
                }
            }

            if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

            if(creep.getActiveBodyparts(MOVE) == 0 && creep.getActiveBodyparts(HEAL) > 0) {
                creep.heal(creep);
                return;
            }

            var target;

            if(creep.memory.attackTarget) {
                target = Game.getObjectById(creep.memory.attackTarget);
            }
            else if(creep.memory.moveFlag) {
                target = Game.flags[creep.memory.moveFlag];
            }
            else if(creep.memory.guardFlag) {
                let flag = Game.flags[creep.memory.guardFlag];

                target = _.first(flag.pos.findInRange(FIND_HOSTILE_CREEPS, 5));

                if(target) {
                    console.log("GUARD", creep.name, 'found enemy', target);
                }
            }

            if(!target && !creep.memory.guardFlag) {
                target = actionCombat.findAttackTarget(creep);
            }

            if(target) {

                if(creep.pos.isNearTo(target)) {
                    creep.attack(target);
                }
                else {
                    let result = creep.moveTo(target);

                    if(creep.getActiveBodyparts(HEAL) > 0) {
                        creep.heal(creep);
                    }
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

                            return;
                        }
                    }
                }

                let idleFlag;
                if(creep.memory.guardFlag) {
                    idleFlag = Game.flags[creep.memory.guardFlag];
                }
                else {
                    idleFlag = _.first(_.groupBy(Game.flags, 'room.name')[creep.pos.roomName]);
                }

                if(idleFlag) {
                    creep.moveTo(idleFlag.pos);
                }
            }
        }
    }
})();