const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = {
    run:  function(creep) {

        if(actionUtils.shouldHarvestEnergy(creep)) {
            actionHarvest.run(creep);
        }

        else {

            if(actionHarvest.tryTransferToStorage(creep)) {
                return
            }

            if(actionHarvest.tryTransferToSpawn(creep)) {
                return;
            }

            if(actionUtils.actionTryBuild(creep)) {
                return;
            }

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};