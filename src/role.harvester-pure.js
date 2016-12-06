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
            if(creep.memory.fleePoint) {
                creep.addTask(taskMove.task.create(creep, creep.memory.fleePoint));
                return;
            }

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

            if(!pos && creep.memory.energyPosition) {
                let p = creep.memory.energyPosition;
                pos = new RoomPosition(p.x, p.y, p.roomName);
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
                var targetRoom = Game.rooms[pos.roomName];
                var container;

                if(targetRoom) {
                    container = _.first(pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: {structureType: STRUCTURE_CONTAINER}
                    }));
                }

                if(container) {
                    creepExt.addTask(creep, taskMove.task.create(creep, container));
                }
                else {
                    creepExt.addTask(creep, taskMove.task.create(creep, pos));
                }
            }
        },
    }
})();

