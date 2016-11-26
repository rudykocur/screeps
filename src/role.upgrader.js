const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = {
    run: function(creep){
        if(actionUtils.shouldHarvestEnergy(creep)) {
            var sources;

            if(creep.memory.energySource) {
                sources = [creep.memory.energySource];
            }
            else {
                sources = creep.memory.fromStructures
            }

            actionHarvest.tryHarvestStorage(creep, {reserve: 300, structures: sources});
        }
        else {
            actionUtils.actionFillController(creep);
        }       
    }
};