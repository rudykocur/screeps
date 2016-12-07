const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run:  function(creep) {
            var resource = creep.memory.transferResource || RESOURCE_ENERGY;

            if(actionUtils.shouldHarvestEnergy(creep, null, resource)) {
                actionHarvest.tryHarvestStorage(creep, {
                    reserve: 1,
                    types: [STRUCTURE_CONTAINER],
                    structures: bookmarks.getObjects(creep.memory.fromStructures),
                    resource: resource,
                });
            }
            else {
                actionHarvest.tryTransferToStorage(creep, {
                    structures: bookmarks.getObjects(creep.memory.toStructures),
                    allowContainers: false,
                    resource: resource,
                });
            }
        }
    }
})();

