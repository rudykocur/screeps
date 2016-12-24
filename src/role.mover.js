var profiler = require('./profiler-impl');
var _ = require('lodash');
var stats = require('./stats');
var logger = require('./logger');

var actionHarvest = require('./action.harvest');
var actionUtils = require('./action.utils');

var taskMove = require('./task.move');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

class MoverRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        let task = this.getFleeTask();

        if (task) {
            this.creep.addTask(task);
            return;
        }

        let job = this.findDepositJob();

        if(job) {
            if (actionUtils.shouldHarvestEnergy(this.creep)) {
                let source = this.getSourceToHarvest();

                if (source) {

                    if (this.creep.pos.isNearTo(source)) {

                        if (source instanceof Resource) {
                            this.creep.pickup(source);
                        }
                        else {
                            this.creep.withdraw(source, RESOURCE_ENERGY);
                        }
                    }
                    else {
                        this.creep.addTask(MoveTask.create(this.creep, source, 1))
                    }
                }
            }
            else {
                let target = this.findTargetToTransfer();

                if (target) {
                    if (this.creep.pos.isNearTo(target)) {
                        if (target instanceof Flag) {
                            this.creep.drop(RESOURCE_ENERGY);
                        }
                        else {
                            var carryEnergy = this.creep.carry.energy;
                            var transferredEnergy = carryEnergy;
                            if (target instanceof StructureTower) {
                                transferredEnergy = Math.min(transferredEnergy, target.energyCapacity - target.energy);
                            }

                            this.creep.transfer(target, RESOURCE_ENERGY);

                            var roomName = this.creep.room.customName;
                            var creepRole = this.creep.memory.role;

                            if (target instanceof StructureStorage) {
                                stats.registerIncome(roomName, 'mover', creepRole, carryEnergy);
                            }
                            if (target instanceof StructureTower) {
                                stats.registerExpense(roomName, 'tower', creepRole, transferredEnergy);
                            }
                        }

                        this.creep.finishJob();

                    }
                    else {
                        let range = (target instanceof Flag) ? 0 : 1;
                        this.creep.addTask(MoveTask.create(this.creep, target, range))
                    }
                }
            }
        }
        else {
            let idlePos = this.creep.getIdlePosition();
            if(idlePos && !this.creep.pos.isNearTo(idlePos)) {
                this.creep.addTask(MoveTask.create(this.creep, idlePos, 1))
            }
        }
    }

    getSourceToHarvest() {
        let source;

        if(!source) {
            source = this.creep.room.getStorage();
        }

        if(!source) {
            source = this.findContainerWithEnergy();
        }

        return source;
    }

    findContainerWithEnergy() {
        let containers = this.creep.room.getContainers({resource: RESOURCE_ENERGY, amount: this.creep.carryCapacity});
        containers = _.sortBy(containers, /** StructureContainer*/c => _.sum(c.store) * -1);
        return _.first(containers);
    }

    findDepositJob() {
        let job = this.creep.getJob();

        if(!job) {
            let handler = this.creep.workRoomHandler;
            let jobs = handler.searchJobs({type: 'refill', subtype: 'spawn'});
            job = _.first(_.sortBy(jobs, j => this.creep.pos.getRangeTo(RoomPosition.fromDict(j.targetPos))));

            if(!job) {
                jobs = handler.searchJobs({type: 'refill', subtype: 'tower'});
                job = _.first(_.sortBy(jobs, j => this.creep.pos.getRangeTo(RoomPosition.fromDict(j.targetPos))));
            }

            if(job) {
                this.creep.takeJob(job);
            }
        }

        return job;
    }

    findDropFlag() {
        return _.first(_.filter(Game.flags, /**Flag*/f => f.pos.roomName == this.creep.room.name && f.color == COLOR_CYAN));
    }

    findTargetToTransfer() {
        let job = this.findDepositJob();

        if(job) {
            return Game.getObjectById(job.targetId);
        }

        let storage = this.creep.room.getStorage();

        if(this.creep.carryTotal > 0) {
            if(storage) {
                return storage;
            }

            return this.findDropFlag();
        }
    }
}

module.exports = (function() {

    return {
        scheduleTask: function(creep) {
            new MoverRole(creep).scheduleTask();
        }
    }
})();

profiler.registerObject(module.exports, 'role-mover');
profiler.registerClass(MoverRole, 'MoverRole');