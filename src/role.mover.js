const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

            var minEnergy = (creep.carryCapacity > 50 ? 51 : 0);

            if(actionUtils.shouldHarvestEnergy(creep, minEnergy)) {
                if(actionHarvest.tryHarvestDroppedSource(creep)) {
                    return;
                }

                if(actionHarvest.tryHarvestStorage(creep, {types: [STRUCTURE_CONTAINER]})) {
                    return;
                }

                // if all containers empty, but there is spawn need for refill, then try take from storage
                if(actionHarvest.findSpawnToTransfer(creep)) {
                    actionHarvest.tryHarvestStorage(creep, {types: [STRUCTURE_STORAGE]});
                }
            }

            else {
                if(actionHarvest.tryTransferToSpawn(creep)) {
                    return;
                }

                if(actionHarvest.tryTransferToTower(creep)) {
                    return;
                }

                if(actionHarvest.tryTransferToStorage(creep, {allowContainers: false})) {
                    return;
                }

                var storage = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: {structureType: STRUCTURE_STORAGE}
                });

                if(!storage) {
                    actionHarvest.tryTransferToStorage(creep)
                }

            }
        }
    }
})();

