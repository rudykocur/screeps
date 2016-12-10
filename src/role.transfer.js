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

            var job = _.first(creep.workRoomHandler.searchJobs({type: 'transfer'}));


            if(job) {

                if(!actionUtils.shouldHarvestEnergy(creep, null, job.resource) && !creep.carry[job.resource]) {
                    if(!creep.pos.isNearTo(storage)) {
                        creep.moveTo(storage);
                    }

                    _.each(creep.carry, (amount, resource) => {
                        if(amount > 0) {
                            creep.transfer(storage, resource);
                        }
                    });

                    return;
                }

                if (actionUtils.shouldHarvestEnergy(creep, null, job.resource)) {
                    var source = RoomPosition.fromDict(job.sourcePos);

                    if(!creep.pos.isNearTo(source)) {
                        creep.moveTo(source);
                    }

                    creep.withdraw(Game.getObjectById(job.sourceId), job.resource);
                }
                else {
                    var target = RoomPosition.fromDict(job.targetPos);

                    if(!creep.pos.isNearTo(target)) {
                        creep.moveTo(target);
                    }

                    creep.transfer(Game.getObjectById(job.targetId), job.resource);
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

