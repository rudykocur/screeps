const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');
const bookmarks = require('bookmarks');
const utils = require('utils');

Creep.prototype.debugLog = function(message) {
    if(this.memory.debug) {
        console.log('CREEPER ' + this.name + ':', message);
    }
};

Creep.prototype.addTask = function(task) {
    module.exports.addTask(this, task);
};

Object.defineProperty(Creep.prototype, 'idwithOwner', {get: function() {
    return `${this.id}(${this.owner.username})`;
}});

Creep.prototype.bodypartHpLeft = function(partType) {
    var parts = _(this.body).filter({type: partType});

    var hp = parts.sum(b => b.hits);

    return hp / (parts.size() * 100);
};

module.exports = (function() {

    var getTaskId = _.partial(utils.getNextId, 'taskId');

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

            finish() {
                module.exports.endTask(this.creep);
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