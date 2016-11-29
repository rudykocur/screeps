const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
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

                actionHarvest.tryTransferToStorage(creep, {allowContainers: false});

            }
        }
    }
})();

