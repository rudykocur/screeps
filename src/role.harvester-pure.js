const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestSource(creep);
            }
            else {
                actionHarvest.tryTransferToStorage(creep, {maxRange: 10});
            }
        }
    }
})();

