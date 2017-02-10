var profiler = require('./profiler-impl');
var _ = require('lodash');
var logger = require('./logger');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

class TransferRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        let job = this.getJob();
        let creep = this.creep;

        if(job) {
            if(creep.carryTotal > (creep.carry[job.resource] || 0)) {
                this.unloadUnwantedResources(job);
                return;
            }

            if(!creep.carry[job.resource]) {
                this.loadWantedResource(job);
            }
            else {
                this.unloadAtTarget(job);
            }

            return;
        }

        if(_.sum(creep.carry) > 0) {
            this.unloadAllResources();
        }
    }

    getJob() {
        let creep = this.creep;

        var job = creep.getJob();

        if(!job) {
            let jobs = creep.workRoomHandler.searchJobs({type: 'pickup', freeReserve: 200});
            job = _.sample(_.sortByOrder(jobs, j=>j.amount, 'desc'));

            if(!job) {
                job = _.first(creep.workRoomHandler.searchJobs({type: 'transfer', subtype: 'link-storage'}));
            }

            if(!job) {
                job = _.sample(creep.workRoomHandler.searchJobs({type: 'transfer'}));
            }

            if(!job) {
                let jobs = creep.workRoomHandler.searchJobs({type: 'refill', subtype: 'spawn'});
                job = _.first(_.sortBy(jobs, j => this.creep.pos.getRangeTo(RoomPosition.fromDict(j.targetPos))));
            }

            if(job) {
                if(job.type == 'pickup') {
                    creep.takePartialJob(job, creep.carryCapacity);
                }
                else {
                    creep.takeJob(job);
                }
            }
        }

        return job;
    }

    unloadUnwantedResources(job) {
        let creep = this.creep;
        let storage = creep.workRoom.getStorage();

        let toEmpty = _.omit(creep.carry, job.resource);
        if(toEmpty.energy == 0) {
            toEmpty = _.omit(toEmpty, RESOURCE_ENERGY);
        }

        let toEmptyResource = _.keys(toEmpty)[0];
        if(creep.pos.isNearTo(storage)) {
            creep.transfer(storage, toEmptyResource);
        }
        else {
            this.creep.addTask(MoveTask.create(this.creep, storage, 1));
        }
    }

    loadWantedResource(job) {
        let creep = this.creep;

        var sourcePos = RoomPosition.fromDict(job.sourcePos);
        /** type StructureStorage */
        let source = Game.getObjectById(job.sourceId);

        if(!creep.pos.isNearTo(sourcePos)) {
            this.creep.addTask(MoveTask.create(this.creep, sourcePos, 1));
            return;
        }

        let sourceAmount = Infinity;
        if(source instanceof StructureStorage || source instanceof StructureTerminal) {
            sourceAmount = source.store[job.resource];
        }
        if(source instanceof StructureLab) {
            sourceAmount = source.mineralAmount;
        }

        var toWithdraw = Math.min(creep.carryCapacity, job.amount, sourceAmount);

        if(source instanceof Resource) {
            creep.pickup(source);
        }
        else {
            let result = creep.withdraw(source, job.resource, toWithdraw);
            if(result == ERR_NOT_ENOUGH_RESOURCES) {
                creep.finishJob();
            }
        }
    }

    unloadAtTarget(job) {
        let creep = this.creep;
        let target, result;

        target = RoomPosition.fromDict(job.targetPos);

        if(!creep.pos.isNearTo(target)) {
            this.creep.addTask(MoveTask.create(this.creep, target, 1));
            return;
        }

        result = creep.transfer(Game.getObjectById(job.targetId), job.resource);

        if(result == OK) {
            creep.finishJob();
        }
        else if(result != ERR_NOT_IN_RANGE && result != ERR_FULL) {
            logger.mail(logger.error('OMG TRANSFER 22 ERROR', creep, '::', result));
            if(job.type == 'pickup') {
                creep.releasePartialJob()
            }
            else {
                creep.releaseJob();
            }
        }
    }

    unloadAllResources() {
        let creep = this.creep;
        let storage = creep.workRoom.getStorage();

        if(!creep.pos.isNearTo(storage)) {
            this.creep.addTask(MoveTask.create(this.creep, storage, 1));
            return;
        }

        _.each(creep.carry, (amount, resource) => {
            if(amount > 0) {
                creep.transfer(storage, resource);
            }
        });
    }
}

module.exports = (function() {

    return {
        scheduleTask(creep) {
            new TransferRole(creep).scheduleTask();
        },

    }
})();

profiler.registerClass(TransferRole, 'role-transfer-class');