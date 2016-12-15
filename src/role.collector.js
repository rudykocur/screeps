const profiler = require('./profiler-impl');
const _ = require('lodash');

const MoveTask = require('./task.move').MoveTask;

const CreepRole = require('./role').CreepRole;

class CollectorRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        let task = this.getFleeTask();

        if(task) {
            this.creep.addTask(task);
            return;
        }

        if(this.creep.carryTotal < this.creep.carryCapacity) {
            let room = this.creep.workRoom;

            if(!room) {
                return;
            }

            /** @type RoomHander */
            let handler = this.creep.workRoomHandler;

            let jobs = handler.searchJobs({type: 'pickup'}).filter(job => job.amount > 50 && job.resource == RESOURCE_ENERGY);

            let job = _.first(_.sortBy(jobs, job => job.amount*-1));

            if(job) {
                let pos = RoomPosition.fromDict(job.sourcePos);
                let source = Game.getObjectById(job.sourceId);

                if(this.creep.pos.isNearTo(pos)) {
                    this.creep.setPrespawnTime();

                    if(this.creep.pickup(source) == OK) {
                        let storage = this.getStorage();
                        this.creep.addTask(MoveTask.create(this.creep, storage, 1));
                    }
                }
                else {
                    this.creep.addTask(MoveTask.create(this.creep, source, 1));
                }
            }
            else {
                var idlePos = this.creep.getIdlePosition();
                if(idlePos) {
                    this.creep.addTask(MoveTask.create(this.creep, idlePos, 1));
                }
            }
        }
        else {
            let storage = this.getStorage();

            if(this.creep.pos.inRangeTo(storage, 1)) {
                this.creep.transfer(storage, RESOURCE_ENERGY);
            }
            else {
                this.creep.addTask(MoveTask.create(this.creep, storage, 1));
            }
        }
    }

    getStorage() {
        var roomName = this.creep.memory.unloadRoom;

        if(roomName) {
            return Room.byCustomName(roomName).getStorage();
        }

        return Game.getObjectById(this.creep.memory.storageId);
    }
}

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            new CollectorRole(creep).scheduleTask();
        }
    }
})();

profiler.registerObject(module.exports, 'role-collector');
profiler.registerClass(CollectorRole, 'role-class-collector');
