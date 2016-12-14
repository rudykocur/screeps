const profiler = require('./profiler-impl');

const actionHarvest = require('./action.harvest');
const actionUtils = require('./action.utils');
const bookmarks = require('./bookmarks');

const creepExt = require('./creepExt');
const taskMove = require('./task.move');

module.exports = (function() {
    function queueTaskForDroppedEnergy(creep) {

        var targetRoom = Game.rooms[creep.memory.room];

        if(!targetRoom) {
            return;
        }

        var sources = targetRoom.find(FIND_DROPPED_RESOURCES, {
            filter: s => s.resourceType == RESOURCE_ENERGY && s.amount > 50
        });

        var source = _.first(_.sortBy(sources, s => s.amount * -1));

        if(source) {
            if(creep.pos.inRangeTo(source, 1)) {
                creep.setPrespawnTime();

                creep.pickup(source);
            }
            else {
                creepExt.addTask(creep, taskMove.task.create(creep, source));
            }
        }
        else {
            var idlePos = creep.getIdlePosition();
            if(idlePos) {
                creepExt.addTask(creep, taskMove.task.create(creep, idlePos));
            }
        }
    }

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(creep.memory.fleePoint) {
                creep.addTask(taskMove.task.create(creep, RoomPosition.fromDict(creep.memory.fleePoint)));
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

        /**
         * @param {Room} room
         */
        findTargetContainer: function(room) {
            var target = room.getStorage();

            if(!target) {
                target = _.first(room.getContainers());
            }

            return target;
        }
    }
})();

profiler.registerObject(module.exports, 'role-collector');
