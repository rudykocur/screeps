var profiler = require('./profiler-impl');

var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

class SettlerRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        let task = this.getFleeTask();

        if (task) {
            this.creep.addTask(task);
            return;
        }


    }
}

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

            creep.setPrespawnTime();

            if(actionUtils.shouldHarvestEnergy(creep)) {
                if(actionUtils.tryChangeRoom(creep, creep.memory.harvestRoom, creep.memory.via)) {
                    return;
                }

                if(actionHarvest.tryHarvestDroppedSource(creep)) {
                    return;
                }

                if(actionHarvest.tryHarvestStorage(creep, {reserve: 300, types: [STRUCTURE_CONTAINER]})) {
                    return
                }

                let storage = creep.room.getStorage();

                if(storage && storage.store.energy > 10000 && creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
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

                if(ctrl && ctrl.my && ctrl.ticksToDowngrade < 4000) {
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
                    if(actionHarvest.tryTransferToStorage(creep, {allowContainers: false})) {
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

                    if(ctrl && ctrl.my) {
                        if(creep.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(ctrl);
                        }
                        return;
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
                            return;
                        }
                    }
                    // if(creep.room.controller.my && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    //     creep.moveTo(creep.room.controller);
                    // }
                }

                var idlePos = creep.getIdlePosition();
                if(idlePos) {
                    if(!creep.pos.isNearTo(idlePos)) {
                        creep.moveTo(idlePos);
                    }
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-settler');
profiler.registerClass(SettlerRole, 'SettlerRole');