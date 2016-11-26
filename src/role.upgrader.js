const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {
    function getSourcesList(creep) {
        if(creep.memory.energySource) {
            return [creep.memory.energySource];
        }
        else {
            return creep.memory.fromStructures;
        }
    }

    return {
        run: function(creep){
            if(actionUtils.shouldHarvestEnergy(creep)) {
                actionHarvest.tryHarvestStorage(creep, {reserve: 300, structures: getSourcesList(creep)});
            }
            else {
                actionUtils.actionFillController(creep);
            }
        }
    }
})();