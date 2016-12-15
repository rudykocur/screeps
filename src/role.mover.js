const profiler = require('./profiler-impl');
const _ = require('lodash');

const logger = require('./logger');

const actionHarvest = require('./action.harvest');
const actionUtils = require('./action.utils');

const taskMove = require('./task.move');

const MoveTask = require('./task.move').MoveTask;
const CreepRole = require('./role').CreepRole;

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

        let job = this.creep.getJob();
        let shouldHarvest;
        if(job) {
            shouldHarvest = job.type == 'pickup';
        }
        else {
            shouldHarvest = actionUtils.shouldHarvestEnergy(this.creep);
        }

        if(shouldHarvest) {
            let source = this.getSourceToHarvest();

            if(source) {

                if(this.creep.pos.isNearTo(source)) {

                    if(source instanceof Resource) {
                        this.creep.pickup(source);
                    }
                    else {
                        this.creep.withdraw(source, RESOURCE_ENERGY);
                    }

                    this.creep.finishJob();

                    let target = this.findTargetToTransfer();
                    if(target) {
                        let range = (target instanceof Flag) ? 0 : 1;
                        this.creep.addTask(MoveTask.create(this.creep, target, range));
                    }
                }
                else {
                    this.creep.addTask(MoveTask.create(this.creep, source, 1))
                }
            }
        }
        else {
            let target = this.findTargetToTransfer();

            if(target) {
                if(this.creep.pos.isNearTo(target)) {
                    if(target instanceof Flag) {
                        this.creep.drop(RESOURCE_ENERGY);
                    }
                    else {
                        this.creep.transfer(target, RESOURCE_ENERGY);
                    }

                    this.creep.finishJob();

                    if(this.willHaveLeftoverEnergy(target)) {
                        let nextTarget = this.findTargetToTransfer();
                        if(!this.creep.pos.isNearTo(nextTarget)) {
                            this.creep.addTask(MoveTask.create(this.creep, target, 1));
                        }
                    }
                    else {
                        let source = this.getSourceToHarvest();
                        if(source) {
                            this.creep.addTask(MoveTask.create(this.creep, source, 1));
                        }
                    }

                }
                else {
                    let range = (target instanceof Flag) ? 0 : 1;
                    this.creep.addTask(MoveTask.create(this.creep, target, range))
                }
            }
        }
    }

    willHaveLeftoverEnergy(target) {
        if(target instanceof Flag) {
            return false;
        }

        if(target instanceof StructureStorage) {
            return false;
        }

        if(target instanceof StructureSpawn || target instanceof StructureExtension) {
            return this.creep.carry.energy > (target.energyCapacity - target.energy);
        }

        return false;
    }

    getSourceToHarvest() {
        let job = this.findEnergyJob();
        let source;

        if(job) {
            source = Game.getObjectById(job.sourceId);
        }

        if(!source) {
            source = this.findContainerWithEnergy();
        }

        if(!source) {
            source = this.findStorage();
        }

        return source;
    }

    findEnergyJob() {
        let job = this.creep.getJob();
        if(!job) {
            let handler = this.creep.workRoomHandler;
            let jobs = handler.searchJobs({type: 'pickup', freeReserve: 200});
            job = _.first(_.sortBy(jobs.filter(j => !j.resource || j.resource == RESOURCE_ENERGY), job => job.amount * -1));

            if(job) {
                this.creep.takePartialJob(job, this.creep.carryCapacity);
            }
        }

        if(job) {
            if (job.type != 'pickup') {
                logger.error('OMG CREEP', this.creep.name, 'HAS JOB HERE', JSON.stringify(this.creep.carry), '::', JSON.stringify(job));
                this.creep.releaseJob();
            }

            let source = Game.getObjectById(job.sourceId);

            if (!source) {
                this.creep.releasePartialJob();
            }
        }

        return job;
    }

    findContainerWithEnergy() {
        let containers = this.creep.room.getContainers({resource: RESOURCE_ENERGY, amount: this.creep.carryCapacity});
        containers = _.sortBy(containers, /** StructureContainer*/c => _.sum(c.store) * -1);
        return _.first(containers);
    }

    findStorage() {
        if(this.creep.room.energyAvailable < this.creep.room.energyCapacityAvailable) {
            return this.creep.room.getStorage();
        }
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

        if(job && job.type == 'pickup') {
            logger.error('OMG CREEP', this.creep.name, '::', this.creep.memory.harvesting, 'HAS PICKUP JOB HERE', JSON.stringify(job));
            this.creep.releasePartialJob();
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