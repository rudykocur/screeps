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

        var sources = creep.room.find(FIND_DROPPED_ENERGY, {
            filter: s => s.amount > 50
        });

        var source = _.first(_.sortBy(sources, s => s.amount * -1));

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
            if(creep.memory.fleePoint) {
                creep.addTask(taskMove.task.create(creep, creep.memory.fleePoint));
                return;
            }

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

        findTargetContainer: function(room) {
            var target = _.first(room.find(FIND_MY_STRUCTURES, {
                filter: {structureType: STRUCTURE_STORAGE}
            }));

            if(!target) {
                target = _.first(room.find(FIND_MY_STRUCTURES, {
                    filter: {structureType: STRUCTURE_CONTAINER}
                }));
            }

            return target;
        }
    }
})();

