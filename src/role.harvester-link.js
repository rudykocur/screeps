var profiler = require('./profiler-impl');

var actionHarvest = require('./action.harvest');
var actionUtils = require('./action.utils');
var bookmarks = require('./bookmarks');
var logger = require('./logger');

var creepExt = require('./creepExt');
var taskMove = require('./task.move');

module.exports = (function() {

    return {
        /**
         *
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(creep.memory.fleePoint) {
                creep.addTask(taskMove.task.create(creep, RoomPosition.fromDict(creep.memory.fleePoint)));
                return;
            }

            var handler = creep.workRoomHandler;
            if(!handler) {
                return;
            }

            var job = creep.memory.job;

            if(!job) {
                job = _.first(handler.searchJobs({type: 'harvest', subtype: 'energy-link'}));

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

                creep.setPrespawnTime();

                creep.harvest(source);

                if(creep.carry.energy + 50 > creep.carryCapacity) {
                    let link = creep.room.getLinkForSource(source.id);
                    if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                }
            }
            else {
                var targetRoom = Game.rooms[pos.roomName];
                var harvestPosition;

                if(targetRoom) {
                    harvestPosition = _.first(pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: {structureType: STRUCTURE_CONTAINER}
                    }));
                }

                if(targetRoom && !harvestPosition) {
                    harvestPosition = _.first(pos.findInRange(FIND_FLAGS, 1, {
                        filter: /**Flag*/flag => flag.color == COLOR_YELLOW
                    }));
                }

                if(harvestPosition) {
                    creepExt.addTask(creep, taskMove.task.create(creep, harvestPosition));
                }
                else {
                    creepExt.addTask(creep, taskMove.task.create(creep, pos));
                }
            }
        },
    }
})();

profiler.registerObject(module.exports, 'role-harvester-link');
