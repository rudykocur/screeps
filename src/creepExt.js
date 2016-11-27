const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');

module.exports = (function() {

    function getTaskId() {
        Memory.counters = Memory.counters || {};
        Memory.counters.taskId = Memory.counters.taskId || 1;

        if(Memory.counters.taskId > 100000) {
            Memory.counters.taskId = 1;
        }

        return Memory.counters.taskId++;
    }

    return {

        tasks: {},

        CreepTask: class CreepTask {
            move() {
                var moveResult = this.creep.moveByPath(this.state.path);

                if(moveResult == ERR_TIRED) {
                    return true;
                }

                if(moveResult == OK) {
                    this.state.path.splice(0, 1);
                    return true;
                }

                this.creep.say('ERR M ' + moveResult);
                module.exports.endTask(this.creep);
                return false;
            }
        },

        register: function(taskClass) {
            module.exports.tasks[taskClass.name] = taskClass;
        },

        getTask: function(creep){
            if(!creep.memory.tasks || creep.memory.tasks.length < 1) {
                return null;
            }

            var taskData = creep.memory.tasks[0];
            var clz = module.exports.tasks[taskData.type];
            var obj = new clz(creep, taskData.data);
            obj.taskId = taskData.id;

            return obj;
        },

        /**
         * @param {Creep} creep
         * @param task
         */
        addTask: function(creep, task) {
            var taskKey = task.constructor.name;
            var taskData = {
                type: taskKey,
                id: getTaskId(),
                data: task.state,
            };

            creep.memory.tasks = creep.memory.tasks || [];
            creep.memory.tasks.push(taskData);
        },

        endTask: function(creep) {
            if(!creep.memory.tasks || creep.memory.tasks.length < 1) {
                console.log('Tried to finish task, but no tasks in queue!!');
                return null;
            }

            creep.memory.tasks.splice(0, 1);
        }
    }
})();