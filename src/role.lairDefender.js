var profiler = require('./profiler-impl');

var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');
var actionCombat = require('./action.combat');

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
                    creep.moveTo(nearThreat);
                    creep.heal(creep);
                }
                return;
            }

            let job = creep.getJob();

            if(!job) {

                var jobs = creep.workRoomHandler.searchJobs({type: 'combat', subtype: 'defendLair'});
                // var jobs = creep.workRoomHandler.searchJobs({type: 'combat', subtype: 'defendLair', onlyFree: false});
                job = _.first(_.sortBy(jobs.filter(j => j.priority < 100), j => j.priority));

                if (!job) {
                    job = _.first(jobs.filter(j => j.enemy));
                }

                if (!job) {
                    job = _.first(_.sortBy(jobs, j => j.priority));
                }

                if(job) {
                    creep.takeJob(job);
                }
            }

            if(job) {
                creep.refreshJob();
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
                            creep.moveTo(target);
                            creep.heal(creep);
                        }
                    }
                    else {
                        if (creep.getActiveBodyparts(HEAL) > 0) {

                            if(creep.hits < creep.hitsMax) {
                                creep.heal(creep);
                            }
                            else if(job.priority > 60) {
                                var wounded = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                                    filter: c => c.hits < c.hitsMax && creep.pos.getRangeTo(c) < 8
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