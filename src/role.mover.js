const profiler = require('screeps-profiler');

const logger = require('logger');

const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

const taskMove = require('task.move');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        run: function(creep) {
            if(creep.carry.energy == 0) {
                var source = _.first(_.sortBy(creep.room.getDroppedResources({resource: RESOURCE_ENERGY}), r => r.amount * -1));

                if(!source) {
                    let containers = creep.room.getContainers({resource: RESOURCE_ENERGY, amount: creep.carryCapacity});
                    containers = _.sortBy(containers, /** StructureContainer*/c => _.sum(c.store) * -1);
                    source = _.first(containers);
                }

                if(!source && creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    source = creep.room.getStorage();
                }

                if(source) {
                    let result;
                        if(source instanceof Resource) {
                            result = creep.pickup(source);
                        }
                        else {
                            result = creep.withdraw(source, RESOURCE_ENERGY);
                        }

                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                }
            }
            else {
                let job = creep.getJob();

                if(!job) {
                    var handler = creep.workRoomHandler;
                    let jobs = handler.searchJobs({type: 'refill', subtype: 'spawn'});
                    job = _.first(_.sortBy(jobs, j => creep.pos.getRangeTo(RoomPosition.fromDict(j.targetPos))));

                    if(!job) {
                        jobs = handler.searchJobs({type: 'refill', subtype: 'tower'});
                        job = _.first(_.sortBy(jobs, j => creep.pos.getRangeTo(RoomPosition.fromDict(j.targetPos))));
                    }

                    if(job) {
                        creep.takeJob(job);
                    }
                }

                if(job) {
                    let targetPos = RoomPosition.fromDict(job.targetPos);
                    creep.moveTo(targetPos);
                    let result = creep.transfer(Game.getObjectById(job.targetId), RESOURCE_ENERGY);

                    if(result == OK) {
                        creep.finishJob();
                    }
                    else if(result != ERR_NOT_IN_RANGE) {
                        logger.mail(logger.error('OMG TRANSFER ERROR', creep, '::', result));
                        creep.releaseJob();
                    }
                }
            }
        },
    }
})();

profiler.registerObject(module.exports, 'role-mover');