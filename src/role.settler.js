const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {
    /**
     * @param {Creep} creep
     * @param {String} targetRoom
     */
    function tryChangeRoom(creep, targetRoom) {

        if(targetRoom && creep.pos.roomName != targetRoom) {
            var exitDir = creep.room.findExitTo(targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return true;
        }

        return false;
    }

    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(tryChangeRoom(creep, creep.memory.room)) {
                return;
            }

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
    }
})();