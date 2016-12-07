const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestStorage(creep, {
                    reserve: 0,
                    structures: bookmarks.getObjects(creep.memory.fromStructures),
                    resource: creep.memory.transferResource || RESOURCE_ENERGY,
                });
            }
            else {
                actionHarvest.tryTransferToStorage(creep, {
                    structures: bookmarks.getObjects(creep.memory.toStructures),
                    allowContainers: false,
                    resource: creep.memory.transferResource || RESOURCE_ENERGY,
                });
            }
        }
    }
})();

