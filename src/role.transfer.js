var profiler = require('./profiler-impl');
var _ = require('lodash');
var logger = require('./logger');

var actionHarvest = require('./action.harvest');
var actionUtils = require('./action.utils');
var bookmarks = require('./bookmarks');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {
            if(actionUtils.tryDespawn(creep)) {
                return
            }

            var resource = creep.memory.transferResource || RESOURCE_ENERGY;

            var storage = creep.room.getStorage();
            var terminal = creep.room.getTerminal();

            var job = creep.getJob();

            if(!job) {
                let jobs = creep.workRoomHandler.searchJobs({type: 'pickup', freeReserve: 200});
                job = _.first(_.sortBy(jobs, j=>j.amount * -1));

                if(!job) {
                    job = _.first(creep.workRoomHandler.searchJobs({type: 'transfer'}));
                }

                if(job) {
                    if(job.type == 'pickup') {
                        creep.takePartialJob(job, creep.carryCapacity);
                    }
                    else {
                        creep.takeJob(job);
                    }
                }
            }


            if(job) {
                // If you have resources other than required for job - empty them to storage

                if(creep.carryTotal > (creep.carry[job.resource] || 0)) {
                    let toEmpty = _.omit(creep.carry, job.resource);

                    let toEmptyResource = _.keys(toEmpty)[0];
                    if(creep.transfer(storage, toEmptyResource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }

                    return;
                }

                if(!creep.carry[job.resource]) {
                    var sourcePos = RoomPosition.fromDict(job.sourcePos);
                    /** type StructureStorage */
                    let source = Game.getObjectById(job.sourceId);

                    if(!creep.pos.isNearTo(sourcePos)) {
                        creep.moveTo(sourcePos);
                    }

                    let sourceAmount = Infinity;
                    if(source instanceof StructureStorage || source instanceof StructureTerminal) {
                        sourceAmount = source.store[job.resource];
                    }
                    if(source instanceof StructureLab) {
                        sourceAmount = source.mineralAmount;
                    }

                    var toWithdraw = Math.min(creep.carryCapacity, job.amount, sourceAmount);

                    if(source instanceof Resource) {
                        creep.pickup(source);
                    }
                    else {
                        let result = creep.withdraw(source, job.resource, toWithdraw);
                        if(result == ERR_NOT_ENOUGH_RESOURCES) {
                            creep.finishJob();
                        }
                    }
                }
                else {
                    var target = RoomPosition.fromDict(job.targetPos);

                    if(!creep.pos.isNearTo(target)) {
                        creep.moveTo(target);
                    }

                    let result = creep.transfer(Game.getObjectById(job.targetId), job.resource);

                    if(result == OK) {
                        creep.finishJob();
                    }
                    else if(result != ERR_NOT_IN_RANGE) {
                        logger.mail(logger.error('OMG TRANSFER 22 ERROR', creep, '::', result));
                        if(job.type == 'pickup') {
                            creep.releasePartialJob()
                        }
                        else {
                            creep.releaseJob();
                        }
                    }
                }

                return;
            }

            if(_.sum(creep.carry) > 0){

                if(!creep.pos.isNearTo(storage)) {
                    creep.moveTo(storage);
                    return;
                }


                _.each(creep.carry, (amount, resource) => {
                    if(amount > 0) {
                        creep.transfer(storage, resource);
                    }
                });
            }

            var idlePos = creep.getIdlePosition();
            if(idlePos) {
                if(!creep.pos.isNearTo(idlePos)) {
                    creep.moveTo(idlePos);
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-transfer');