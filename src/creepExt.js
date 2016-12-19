const _ = require('lodash');

const actionHarvest = require('./action.harvest');
const actionUtils = require('./action.utils');
const bookmarks = require('./bookmarks');
const utils = require('./utils');
const config = require('./config');
const roomHandler = require('./room.handlers');

Creep.prototype.debugLog = function(message) {
    if(this.memory.debug) {
        console.log('CREEPER ' + this.name + ':', message);
    }
};

Creep.prototype.addTask = function(task) {
    module.exports.addTask(this, task);
};

Object.defineProperty(Creep.prototype, 'workRoom', {get: function() {
    return Game.rooms[this.memory.room];
}});


Object.defineProperty(Creep.prototype, 'workRoomHandler', {get: function() {
    return roomHandler.getRoomHandler(config.roomNames[this.memory.room]);
}});

Object.defineProperty(Creep.prototype, 'carryTotal', {get: function() {
    return _.sum(this.carry);
}});

Object.defineProperty(Creep.prototype, 'idwithOwner', {get: function() {
    return `${this.id}(${this.owner.username})`;
}});

Creep.prototype.setPrespawnTime = function() {
    if(!this.memory.prespawnTime) {
        let baseLifetime = this.getActiveBodyparts(CLAIM) > 0 ? CREEP_CLAIM_LIFE_TIME:CREEP_LIFE_TIME;
        this.memory.prespawnTime = baseLifetime - this.ticksToLive;
    }
};

Creep.prototype.getJob = function() {
    var job = this.memory.job;

    if(job) {
        var room = Room.byCustomName(job.room);
        if(!(job.key in this.workRoomHandler.state.jobs)) {
            delete this.memory.job;
            return;
        }
    }

    return job;
};

Creep.prototype.takeJob = function(job) {
    this.memory.job = job;
    job.takenBy = this.id;
};

Creep.prototype.takePartialJob = function(job, amount) {
    this.memory.job = job;
    job.reservations[this.id] = amount;
};

Creep.prototype.releaseJob = function() {
    var job = this.memory.job;
    if(job) {
        var room = Room.byCustomName(job.room);
        room.handlerMemory.jobs[job.key].takenBy = null;
    }

    delete this.memory.job;
    this.memory.tasks = [];
};

Creep.prototype.releasePartialJob = function() {
    var job = this.memory.job;
    if(job) {
        var room = Room.byCustomName(job.room);
        var roomJob = room.handlerMemory.jobs[job.key];
        if(roomJob && roomJob.reservations && this.id in roomJob.reservations) {
            delete room.handlerMemory.jobs[job.key].reservations[this.id];
        }
    }

    delete this.memory.job;
    this.memory.tasks = [];
};

Creep.prototype.finishJob = function() {
    var job = this.memory.job;

    if(!job) {
        return;
    }

    var room = Room.byCustomName(job.room);

    if(room.handlerMemory.jobs[job.key].reservations) {
        delete room.handlerMemory.jobs[job.key].reservations[this.id];
    }
    else {
        delete room.handlerMemory.jobs[job.key];
    }

    delete this.memory.job;
    this.memory.tasks = [];
};

Creep.prototype.bodypartHpLeft = function(partType) {
    var parts = _(this.body).filter({type: partType});

    var hp = parts.sum(b => b.hits);

    return hp / (parts.size() * 100);
};

Creep.prototype.getIdlePosition = function() {
    var flags = _.filter(Game.flags, f => f.color != COLOR_GREY && f.color != COLOR_RED);
    var flag = _.first(_.groupBy(flags, 'pos.roomName')[this.memory.room]);

    if(flag) {
        return flag.pos;
    }
};

class CreepTask {
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
}

module.exports = (function() {

    var getTaskId = _.partial(utils.getNextId, 'taskId');

    return {

        tasks: {},

        CreepTask: CreepTask,

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