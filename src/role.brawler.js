var profiler = require('./profiler-impl');

var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');
var actionCombat = require('./action.combat');

module.exports = (function() {

    /**
     * @param {Creep} creep
     */
    function tryBoostSelf(creep) {
        var toBoostParts = creep.memory.boost;

        if(!toBoostParts) {
            return;
        }

        var toBoost = null;

        // toBoost.forEach(/**{part,resource,amount}*/boostData => {
        for(let i = 0; i < toBoostParts.length; i++) {
            let boostData = toBoostParts[i];
            var boostedParts = _.filter(creep.body, part => part.type == boostData.part && part.boost == boostData.resource);

            var neededAmount = boostData.amount - boostedParts.length;

            if(neededAmount > 0) {
                toBoost = {
                    resource: boostData.resource,
                    amount: neededAmount,
                };
                break;
            }
        }

        if(toBoost) {
            let lab = _.first(creep.room.find(FIND_STRUCTURES).filter(/**StructureLab*/ struct => {
                if(!struct instanceof StructureLab) {
                    return false;
                }

                return struct.mineralType == toBoost.resource;
            }));

            if(!lab) {
                console.log('No lab to boost', creep.name, '::', JSON.stringify(toBoost));
            }

            if(creep.pos.isNearTo(lab)) {
                console.log('trying to boost', lab, '::', lab.mineralType, '::', toBoost.amount);
                lab.boostCreep(creep, toBoost.amount);
            }
            else {
                creep.moveTo(lab);
            }

            return true;
        }

        return false;
    }

    return {
        /**
         * test
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(tryBoostSelf(creep)) {
                return;
            }

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

profiler.registerObject(module.exports, 'role-brawler');