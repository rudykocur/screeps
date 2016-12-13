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
            if(actionUtils.shouldHarvestEnergy(creep)) {

                let source;

                let job = creep.getJob();
                if(!job) {
                    let handler = creep.workRoomHandler;
                    let jobs = handler.searchJobs({type: 'pickup', freeReserve: 200});
                    job = _.first(_.sortBy(jobs, job => job.amount * -1));

                    if(job) {
                        creep.takePartialJob(job, creep.carryCapacity);
                    }
                }

                if(job) {
                    if(job.type != 'pickup') {
                        logger.error('OMG CREEP', creep.name, 'HAS JOB HERE', JSON.stringify(job));
                    }

                    source = Game.getObjectById(job.sourceId);

                    if(!source) {
                        creep.releasePartialJob();
                    }
                }

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

                        if(job) {
                            if(result == OK || result == ERR_FULL) {
                                creep.finishJob();
                            }
                        }
                }
            }
            else {
                let job = creep.getJob();

                if(!job) {
                    let handler = creep.workRoomHandler;
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
                    if(job.type == 'pickup') {
                        logger.error('OMG CREEP', creep.name, 'HAS PICKUP JOB HERE', JSON.stringify(job))
                    }

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
                else {
                    let storage = creep.room.getStorage();

                    if(_.sum(creep.carry) > 0) {
                        if(storage) {
                            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage);
                            }
                        }

                        var dropFlag = _.first(_.filter(Game.flags, /**Flag*/f => f.pos.roomName == creep.room.name && f.color == COLOR_CYAN));

                        if(dropFlag) {
                            if(creep.pos.isEqualTo(dropFlag)) {
                                creep.drop(RESOURCE_ENERGY);
                            }
                            else {
                                creep.moveTo(dropFlag);
                            }
                        }
                    }
                }
            }
        },
    }
})();

profiler.registerObject(module.exports, 'role-mover');