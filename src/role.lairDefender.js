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
            var job = _.first(creep.workRoomHandler.searchJobs({type: 'combat', subtype: 'defendLair'}));

            if(job) {
                var room = Room.byCustomName(job.room);

                if(room) {
                    creep.setPrespawnTime();

                    let flag = Game.flags[job.flagName];

                    let target = _.first(flag.pos.findInRange(FIND_HOSTILE_CREEPS, 7));

                    if(target) {
                        if (creep.pos.isNearTo(target)) {
                            creep.attack(target);
                        }
                        else {
                            let result = creep.moveTo(target);

                            if (creep.getActiveBodyparts(HEAL) > 0) {
                                creep.heal(creep);
                            }
                        }
                    }
                    else {
                        if (creep.getActiveBodyparts(HEAL) > 0) {
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

                        creep.moveTo(flag.pos);
                    }
                }
                else {
                    creep.moveTo(RoomPosition.fromDict(job.sourcePos));
                }
            }
        }
    }
})();