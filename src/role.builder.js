const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const actionBuild = require('action.build');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
                if(actionHarvest.tryHarvestDroppedSource(creep)) {
                    return;
                }

                actionHarvest.tryHarvestStorage(creep, {reserve: 300});
            }
            else {

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