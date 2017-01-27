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
                lab.boostCreep(creep);
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

            if(creep.memory.room && creep.pos.roomName != creep.memory.room) {
                var roomFlag = _.first(_.filter(Game.flags, f => {
                    return f.pos.roomName == creep.memory.room && f.color == COLOR_ORANGE
                }));

                if(roomFlag) {
                    creep.heal(creep);
                    creep.moveTo(roomFlag, {
                        costCallback: actionUtils.costCallback
                    });
                    return;
                }
            }

            let canAttack = creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0;

            if(creep.getActiveBodyparts(MOVE) == 0 && creep.getActiveBodyparts(HEAL) > 0) {
                creep.heal(creep);
                return;
            }

            var target;

            if(creep.memory.attackTarget) {
                target = Game.getObjectById(creep.memory.attackTarget);
                if(!target) {
                    console.log(creep,'attack target is no longer existing!');
                    delete creep.memory.attackTarget;
                }
            }

            if(!target && creep.memory.moveFlag) {
                target = Game.flags[creep.memory.moveFlag];
            }

            if(!target && creep.memory.guardFlag) {
                let flag = Game.flags[creep.memory.guardFlag];

                if(flag) {
                    target = _.first(flag.pos.findInRange(FIND_HOSTILE_CREEPS, 5));

                    if (!target) {
                        target = _.first(flag.pos.lookFor(LOOK_STRUCTURES));
                    }

                    if (target) {
                        // console.log("GUARD", creep.name, 'found enemy', target);
                    }
                }
            }

            if(!target && !creep.memory.guardFlag) {
                target = actionCombat.findAttackTarget(creep);
            }

            if(creep.hits > creep.hitsMax * 0.85) {
                let healUnderFactor = canAttack ? 0.6 : 0.9;
                let wounded = _.first(_.filter(creep.pos.findInRange(FIND_MY_CREEPS, 2), /**Creep*/ c=> c.hits < c.hitsMax * healUnderFactor));
                if(wounded) {
                    if(creep.heal(wounded) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wounded);
                    }

                    creep.rangedHeal(wounded);

                    return;
                }
            }

            if(creep.hits < creep.hitsMax * 0.6 && creep.getActiveBodyparts(HEAL)) {
                creep.heal(creep);
                return;
            }

            if(target && canAttack) {

                if(creep.pos.isNearTo(target) && creep.getActiveBodyparts(ATTACK) > 0) {
                    let result = creep.attack(target);

                    if(result != OK) {
                        creep.heal(creep);
                    }
                }
                else {
                    creep.rangedAttack(target);
                    creep.moveTo(target);
                    creep.heal(creep);
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