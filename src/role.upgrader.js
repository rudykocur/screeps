const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');
const creepExt = require('creepExt');
const taskUpgrade = require('task.upgradeController');
const taskWithdraw = require('task.withdrawFromStorage');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(creep.carry.energy == 0) {
                var target = actionHarvest.findStorageToHarvest(creep, {
                    reserveStorage: 10000,
                    reserveContainer: 300,
                    structures: bookmarks.getObjects(creep.memory.fromStructures)
                });

                if(target) {
                    creepExt.addTask(creep, taskWithdraw.task.create(creep, target));
                }
            }
            else {
                creepExt.addTask(creep, taskUpgrade.task.create(creep));
            }
        }
    }
})();