var profiler = require('./profiler-impl');

var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');
var actionCombat = require('./action.combat');

module.exports = (function() {

    function stepAway(creep, hostiles) {
        let bestPos = creep.pos;
        let bestScore = 0;

        for(let dx = -1; dx <= 1; dx++) {
            for(let dy = -1; dy <= 1; dy++) {
                let pos = new RoomPosition(creep.pos.x + dx, creep.pos.y + dy, creep.pos.roomName);

                let terrain = pos.lookFor(LOOK_TERRAIN);
                if(terrain == 'wall') {
                    continue;
                }

                if(!pos.isEqualTo(creep.pos) && pos.lookFor(LOOK_CREEPS).length > 0) {
                    continue;
                }

                let score = _.sum(hostiles, /**Creep*/ h => pos.getRangeTo(h)) + (terrain == 'swamp'?1:0);

                if(score > bestScore) {
                    bestPos = pos;
                    bestScore = score;
                }
            }
        }

        creep.move(creep.pos.getDirectionTo(bestPos));
    }

    function keepDistance(creep, target) {
        let distance = creep.pos.getRangeTo(target);
        if(distance >= 4) {
            creep.moveTo(target);
        }
        else
        {
            creep.setPrespawnTime();
            if(distance < 3) {
                stepAway(creep, [target]);
            }
        }
    }

    return {

        /**
         * test
         * @param {Creep} creep
         */
        run:  function(creep) {
            let hostilesAround = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
            let nearThreat = _.first(hostilesAround);
            if(nearThreat) {

                // TODO: use keepDistance or similar
                let range = creep.pos.getRangeTo(nearThreat);
                if(range >= 4) {
                    creep.moveTo(nearThreat);
                }
                else {
                    creep.rangedAttack(nearThreat);

                    if(range < 3) {
                        stepAway(creep, hostilesAround);
                    }
                }

                creep.heal(creep);
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
                        if(creep.pos.getRangeTo(target) > 3) {
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

                        keepDistance(creep, flag);

                    }
                }
                else {
                    let idlePos = RoomPosition.fromDict(job.sourcePos);

                    keepDistance(creep, idlePos);
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-lairDefender');