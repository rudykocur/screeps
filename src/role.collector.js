var profiler = require('./profiler-impl');
var _ = require('lodash');
var stats = require('./stats');

var actionUtils = require('./action.utils');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

class CollectorRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    /**
     * @param income
     */
    registerIncome(income) {
        stats.registerIncome(Room.idToCustomName(this.creep.memory.room), 'collector', this.creep.memory.role, income);
    }

    scheduleTask() {
        let task = this.getFleeTask();

        if(task) {
            this.creep.addTask(task);
            return;
        }

        if(actionUtils.shouldHarvestEnergy(this.creep)) {
            let room = this.creep.workRoom;

            if(!room) {
                return;
            }

            /** @type RoomHandler */
            let handler = this.creep.workRoomHandler;

            let jobs = handler.searchJobs({type: 'pickup'}).filter(job => job.amount > 50 && job.resource == RESOURCE_ENERGY);

            let job = _.first(_.sortBy(jobs, job => job.amount*-1));

            if(job) {
                let pos = RoomPosition.fromDict(job.sourcePos);
                let source = Game.getObjectById(job.sourceId);

                if(this.creep.pos.isNearTo(pos)) {
                    this.creep.setPrespawnTime();

                    if(this.creep.pickup(source) == OK) {
                        if(this.creep.carryTotal >= this.creep.carryCapacity) {
                            this.creep.memory.harvesting = false;

                            let storage = this.getStorage();
                            this.creep.addTask(MoveTask.create(this.creep, storage, 1));
                        }
                    }
                }
                else {
                    this.creep.addTask(MoveTask.create(this.creep, source, 1));
                }
            }
            else {
                var idlePos = this.creep.getIdlePosition();
                if(idlePos) {
                    if(!this.creep.pos.isNearTo(idlePos)) {
                        this.creep.addTask(MoveTask.create(this.creep, idlePos, 1));
                    }
                }
            }
        }
        else {
            let storage = this.getStorage();

            if(this.creep.pos.inRangeTo(storage, 1)) {
                let creepEnergy = this.creep.carry.energy;

                if(this.creep.transfer(storage, RESOURCE_ENERGY) == OK) {
                    this.registerIncome(creepEnergy);
                }
            }
            else {
                this.creep.addTask(MoveTask.create(this.creep, storage, 1));
            }
        }
    }

    getStorage() {
        return Room.byCustomName(this.creep.memory.unloadRoom).getStorage();
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
profiler.registerClass(CollectorRole, 'CollectorRole');
