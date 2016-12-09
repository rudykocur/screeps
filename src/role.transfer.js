const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run:  function(creep) {
            var resource = creep.memory.transferResource || RESOURCE_ENERGY;

            var sourceContainer = _.first(creep.room.getContainers({resource: resource, amount: creep.carryCapacity}));
            var storage = creep.room.getStorage();

            if(sourceContainer) {
                if (actionUtils.shouldHarvestEnergy(creep, null, resource)) {

                    if(!creep.pos.isNearTo(sourceContainer)) {
                        creep.moveTo(sourceContainer);
                    }

                    creep.withdraw(sourceContainer, resource);
                }
                else {
                    if(!creep.pos.isNearTo(storage)) {
                        creep.moveTo(storage);
                    }

                    creep.transfer(storage, resource);
                }
            }
            else {
                var job = _.first(creep.room.searchJobs({type: 'transfer'}));

                if(job) {
                    if (actionUtils.shouldHarvestEnergy(creep, null, resource)) {
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
                }
                else if(creep.carry[resource] > 0){

                    if(!creep.pos.isNearTo(storage)) {
                        creep.moveTo(storage);
                    }

                    creep.transfer(storage, resource);
                }
            }
        }
    }
})();

