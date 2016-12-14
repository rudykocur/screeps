const profiler = require('./profiler-impl');

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
            let nearThreat = _.first(creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3));
            if(nearThreat) {
                if (creep.pos.isNearTo(nearThreat)) {
                    creep.attack(nearThreat);
                }
                else {
                    let result = creep.moveTo(nearThreat);

                    if (creep.getActiveBodyparts(HEAL) > 0) {
                        creep.heal(creep);
                    }
                }
                return;
            }

            var jobs = creep.workRoomHandler.searchJobs({type: 'combat', subtype: 'defendLair', onlyFree: false});
            var job = _.first(_.sortBy(jobs.filter(j => j.priority < 100), j => j.priority));

            if(!job) {
                job = _.first(jobs.filter(j => j.enemy));
            }

            if(!job) {
                job = _.first(_.sortBy(jobs, j => j.priority));
            }

            if(job) {

                var room = Room.byCustomName(job.room);

                if(room) {

                    let flag = Game.flags[job.flagName];

                    let target = _.first(flag.pos.findInRange(FIND_HOSTILE_CREEPS, 7));

                    if(target) {
                        if (creep.pos.isNearTo(target)) {
                            creep.setPrespawnTime();
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
                            else if(job.priority > 60) {
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

                        if(creep.pos.isNearTo(flag)) {
                            creep.setPrespawnTime();
                        }

                        creep.moveTo(flag.pos);
                    }
                }
                else {
                    let idlePos = RoomPosition.fromDict(job.sourcePos);
                    if(creep.pos.isNearTo(idlePos)) {
                        creep.setPrespawnTime();
                    }

                    creep.moveTo(idlePos);
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-lairDefender');