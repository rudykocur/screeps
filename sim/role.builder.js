const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const actionBuild = require('action.build');

module.exports = (function() {

    return {
        run:  function(creep) {

            if(actionUtils.shouldHarvestEnergy(creep)) {
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

                if(actionBuild.actionTryRepair(creep)) {
                    return;
                }

                actionUtils.actionFillController(creep);
            }
        },
    }
})();