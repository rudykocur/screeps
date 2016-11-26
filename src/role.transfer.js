const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestStorage(creep, {structures: creep.memory.fromStructures});
            }
            else {
                actionHarvest.tryTransferToStorage(creep, {structures: creep.memory.toStructures});
            }
        }
    }
})();

