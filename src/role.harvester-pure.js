const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

const creepExt = require('creepExt');
const taskMove = require('task.move');
const taskHarvest = require('task.harvest');

module.exports = (function() {

    return {
        scheduleTask: function(creep) {
            var source = bookmarks.getObject(creep.memory.energySource);

            if(creep.pos.isNearTo(source)) {
                creepExt.addTask(creep, taskHarvest.task.create(creep, source));
            }
            else {
                var containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: {structureType: STRUCTURE_CONTAINER}
                });

                if(containers.length > 0) {
                    creepExt.addTask(creep, taskMove.task.create(creep, containers[0]));
                }
                else {
                    creepExt.addTask(creep, taskMove.task.create(creep, source));
                }
            }
        },
    }
})();

