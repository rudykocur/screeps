const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = {
    run:  function(creep) {

        if(actionUtils.shouldHarvestEnergy(creep)) {
            actionHarvest.tryHarvestStorage(creep);
        }
        else {

            if(actionUtils.actionTryBuild(creep)) {
                return;
            }

            if(actionUtils.actionTryRepairRoad(creep)) {
                return;
            }

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};