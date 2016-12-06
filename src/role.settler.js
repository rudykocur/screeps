const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

module.exports = (function() {


    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(creep.memory.fleePoint) {
                creep.moveTo(RoomPosition.fromDict(creep.memory.fleePoint));
                return;
            }

            if(actionUtils.tryChangeRoom(creep, creep.memory.room, creep.memory.via)) {
                return;
            }

            if(actionUtils.shouldHarvestEnergy(creep)) {
                if(actionUtils.tryChangeRoom(creep, creep.memory.harvestRoom, creep.memory.via)) {
                    return;
                }

                if(actionHarvest.tryHarvestDroppedSource(creep)) {
                    return;
                }

                actionHarvest.run(creep);
            }

            else {

                if(actionUtils.tryChangeRoom(creep, creep.memory.workRoom, creep.memory.via)) {
                    return;
                }

                var dismantle = creep.memory.dismantleTarget;
                if(dismantle) {
                    var target = Game.getObjectById(dismantle);
                    if(!target) {
                        delete creep.memory.dismantleTarget;
                    }
                    else {
                        if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }

                        return;
                    }
                }

                if(creep.memory.moveFlag) {
                    var target = Game.flags[creep.memory.moveFlag];
                    if(target){
                        creep.moveTo(target);
                        return;
                    }
                }

                var ctrl = creep.room.controller;

                if(ctrl.my && ctrl.ticksToDowngrade < 4000) {
                    if(creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(ctrl);
                        return;
                    }
                }

                if(!creep.memory.disableSpawn) {
                    if(actionHarvest.tryTransferToSpawn(creep)) {
                        return;
                    }
                }

                if(!creep.memory.disableBuild && creep.getActiveBodyparts(WORK) > 0) {
                    if(actionBuld.actionTryBuild(creep)) {
                        return;
                    }
                }

                if(!creep.memory.disableStorage) {
                    if(actionHarvest.tryTransferToStorage(creep)) {
                        return
                    }
                }

                if(creep.memory.enableRepair) {
                    actionBuld.findNewStructureToRepair(creep);
                    if(actionBuld.actionTryRepair(creep)) {
                        return;
                    }
                }

                if(!creep.memory.disableController) {

                    if(ctrl.my) {
                        if(creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(ctrl);
                        }
                    }
                    else {

                        if(creep.getActiveBodyparts(CLAIM) > 0) {

                            if(creep.memory.claimController) {
                                if(creep.claimController(ctrl) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(ctrl);
                                }
                            }
                            else {
                                if(creep.reserveController(ctrl) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(ctrl);
                                }
                            }

                        }
                    }
                    // if(creep.room.controller.my && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    //     creep.moveTo(creep.room.controller);
                    // }
                }
            }
        }
    }
})();