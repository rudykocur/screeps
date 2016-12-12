const profiler = require('screeps-profiler');

const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const actionBuild = require('action.build');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.tryDespawn(creep)) {
                return
            }

            if(actionUtils.shouldHarvestEnergy(creep)) {
                if(actionHarvest.tryHarvestDroppedSource(creep)) {
                    return;
                }

                if(actionHarvest.tryHarvestStorage(creep, {reserve: 5000, types: [STRUCTURE_STORAGE]})) {
                    return;
                }

                actionHarvest.tryHarvestStorage(creep, {reserve: 300, types: [STRUCTURE_CONTAINER]});
            }
            else {

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

                if(actionBuild.findNewStructureToRepair(creep)) {
                    if(actionBuild.actionTryRepair(creep)) {
                        return false;
                    }
                }

                if(actionBuild.actionTryBuild(creep)) {
                    return;
                }

                if(creep.memory.allowRepair && actionBuild.actionTryRepair(creep)) {
                   return;
                }

                if(!creep.memory.disableController) {
                    actionUtils.actionFillController(creep);
                    return;
                }

                var idlePos = creep.getIdlePosition();

                if(idlePos) {
                    if(!creep.pos.isNearTo(idlePos)) {
                        creep.moveTo(idlePos);
                    }
                }
            }
        },
    }
})();

profiler.registerObject(module.exports, 'role-builder');