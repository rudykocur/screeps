const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = {
    /**
     * @param {Creep} creep
     */
    run:  function(creep) {

        if(actionUtils.shouldHarvestEnergy(creep)) {
            actionHarvest.run(creep);
        }

        else {

            if(!creep.memory.disableSpawn) {
                if(actionHarvest.tryTransferToSpawn(creep)) {
                    return;
                }
            }

            if(!creep.memory.disableBuild) {
                if(actionBuld.actionTryBuild(creep)) {
                    return;
                }
            }

            if(!creep.memory.disableStorage) {
                if(actionHarvest.tryTransferToStorage(creep)) {
                    return
                }
            }

            if(!creep.memory.disableController) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};