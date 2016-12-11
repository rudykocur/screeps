const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run:  function(creep) {
            if(actionUtils.tryDespawn(creep)) {
                return
            }

            var resource = creep.memory.transferResource || RESOURCE_ENERGY;

            var storage = creep.room.getStorage();

            var job = creep.getJob();

            if(!job) {
                job = _.first(creep.workRoomHandler.searchJobs({type: 'transfer'}));

                if(job) {
                    creep.takeJob(job);
                }
            }


            if(job) {

                if(!creep.carry[job.resource]) {
                    var source = RoomPosition.fromDict(job.sourcePos);

                    if(!creep.pos.isNearTo(source)) {
                        creep.moveTo(source);
                    }

                    var toWithdraw = Math.min(creep.carryCapacity, job.amount);
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

