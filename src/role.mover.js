const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestStorage(creep);
            }

            else {
                if(actionHarvest.tryTransferToSpawn(creep)) {
                    return;
                }

                if(actionHarvest.tryTransferToTower(creep)) {
                    return;
                }

                actionUtils.actionFillController(creep);
            }
        }
    }
})();

