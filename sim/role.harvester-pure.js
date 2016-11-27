const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestSource(creep, {
                    structures: bookmarks.getObjects(creep.memory.energySource)
                });
            }
            else {
                actionHarvest.tryTransferToStorage(creep, {maxRange: 10});
            }
        }
    }
})();

