const profiler = require('screeps-profiler');

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
                var target;

                target = creep.room.getStorage();

                // if we have storage built but not enough energy, then dont try to borrow from containers.
                if(target && _.sum(target.store) < 10000) {
                    return;
                }

                if(!target) {
                    let targets = _(creep.room.getContainers({resource: RESOURCE_ENERGY, amount: creep.carryCapacity}));
                    target = target.sortBy(t => creep.pos.getRangeTo(t)).first();
                }

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

profiler.registerObject(module.exports, 'role-upgrader');