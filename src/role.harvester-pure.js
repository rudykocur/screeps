const profiler = require('screeps-profiler');

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
                creep.addTask(taskMove.task.create(creep, RoomPosition.fromDict(creep.memory.fleePoint)));
                return;
            }

            var hanlder = creep.workRoomHandler;

            var job = creep.memory.job;

            if(!job) {
                job = _.first(hanlder.searchJobs({type: 'harvest', subtype: 'energy'}));

                if (!job) {
                    job = _.first(hanlder.searchJobs({type: 'harvest', subtype: 'mineral'}));
                }

                if (!job) {
                    if (Game.time % 10 == 0) {
                        logger.log(logger.fmt.orange('No job for harvester', creep.name));
                    }

                    return;
                }

                creep.takeJob(job);
            }

            var pos = RoomPosition.fromDict(job.sourcePos);

            if(creep.pos.isNearTo(pos)) {
                let source = Game.getObjectById(job.sourceId);

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

profiler.registerObject(module.exports, 'role-harvester');
