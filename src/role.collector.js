const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

const creepExt = require('creepExt');
const taskMove = require('task.move');

module.exports = (function() {
    function queueTaskForDroppedEnergy(creep) {
        var outExit = actionUtils.findRoomExit(creep, creep.memory.room);

        if(outExit) {
            creepExt.addTask(creep, taskMove.task.create(creep, outExit));
            return;
        }

        var source = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);

        if(source) {
            if(creep.pos.inRangeTo(source, 1)) {
                creep.pickup(source);
            }
            else {
                creepExt.addTask(creep, taskMove.task.create(creep, source));
            }
        }
    }

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(_.sum(creep.carry) < creep.carryCapacity) {

                queueTaskForDroppedEnergy(creep);
            }
            else {
                var target = Game.getObjectById(creep.memory.storageId);

                if(creep.pos.inRangeTo(target, 1)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                    queueTaskForDroppedEnergy(creep)
                }
                else {
                    creepExt.addTask(creep, taskMove.task.create(creep, target));
                }
            }
        },
    }
})();

