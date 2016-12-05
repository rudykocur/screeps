const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');
const logger = require('logger');

const creepExt = require('creepExt');
const taskMove = require('task.move');
const taskHarvest = require('task.harvest');

module.exports = (function() {

    return {
        scheduleTask: function(creep) {
            var pos;
            if(creep.memory.energySourceId) {
                let source = Game.getObjectById(creep.memory.energySourceId);
                if(source) {
                    pos = source.pos;
                }
            }
            else if(creep.memory.energySource) {
                let source = bookmarks.getObject(creep.memory.energySource);
                if(source) {
                    pos = source.pos;
                }
            }
            else if(creep.memory.energyPosition) {
                pos = creep.memory.energyPosition;
            }

            if(!pos) {
                console.log('Creep', creep.name, 'cannot find its source');
                return;
            }

            if(creep.pos.isNearTo(pos)) {
                let source = _.first(creep.room.lookForAt(LOOK_SOURCES, pos));
                if(!source) {
                    logger.error('task.harvester: no source at position', pos);
                    return;
                }

                creepExt.addTask(creep, taskHarvest.task.create(creep, source));
            }
            else {
                var containers = pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: {structureType: STRUCTURE_CONTAINER}
                });

                if(containers.length > 0) {
                    creepExt.addTask(creep, taskMove.task.create(creep, containers[0]));
                }
                else {
                    creepExt.addTask(creep, taskMove.task.create(creep, pos));
                }
            }
        },
    }
})();

