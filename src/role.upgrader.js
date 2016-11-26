const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    return {
        run: function(creep){
            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestStorage(creep, {
                    reserve: 300,
                    structures: bookmarks.getObjects(creep.memory.fromStructures)
                });
            }
            else {
                actionUtils.actionFillController(creep);
            }
        }
    }
})();