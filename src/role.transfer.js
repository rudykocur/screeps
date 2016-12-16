const profiler = require('./profiler-impl');
const _ = require('lodash');
const logger = require('./logger');

const actionHarvest = require('./action.harvest');
const actionUtils = require('./action.utils');
const bookmarks = require('./bookmarks');

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
                job = _.first(creep.workRoomHandler.searchJobs({type: 'transfer'}));

                if(job) {
                    creep.takeJob(job);
                }
            }


            if(job) {
                // If you have resources other than required for job - empty them to terminal or storage
                if(creep.carryTotal > creep.carry[job.resource]) {
                    let toEmpty = _.omit(creep.carry, job.resource);

                    if(toEmpty.energy > 0) {
                        if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                    else {
                        let toEmptyResource = _.keys(toEmpty)[0];
                        if(creep.transfer(terminal, toEmptyResource) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
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
                    creep.withdraw(Game.getObjectById(job.sourceId), job.resource, toWithdraw);
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
                        creep.releaseJob();
                    }
                }

                return;
            }

            if(_.sum(creep.carry) > 0){

                if(!creep.pos.isNearTo(storage)) {
                    creep.moveTo(storage);
                }


                _.each(creep.carry, (amount, resource) => {
                    if(amount > 0) {
                        creep.transfer(storage, resource);
                    }
                });
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-transfer');