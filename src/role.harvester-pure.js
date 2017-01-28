var profiler = require('./profiler-impl');
var logger = require('./logger');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

class HarvesterPureRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        let creep = this.creep;

        if(creep.memory.fleePoint) {
            let fleePos = RoomPosition.fromDict(creep.memory.fleePoint);
            if(!creep.pos.isNearTo(fleePos)) {
                this.creep.addTask(MoveTask.create(this.creep, fleePos, 0));
            }
            return;
        }

        if(!creep.workRoomHandler) {
            return;
        }

        let job = this.getJob();

        if(!job) {
            return;
        }

        var pos = RoomPosition.fromDict(job.sourcePos);

        if(creep.pos.isNearTo(pos)) {
            let source = Game.getObjectById(job.sourceId);

            if(!source) {
                logger.error('task.harvester: no source at position', pos);
                return;
            }

            creep.setPrespawnTime();

            this.doJob(job);
        }
        else {
            this.gotoJob(job);
        }
    }

    getJob() {
        let creep = this.creep;
        let handler = creep.workRoomHandler;

        var job = creep.memory.job;

        if(!job) {
            job = this.searchJobs(handler);

            if (!job) {
                if (Game.time % 10 == 0) {
                    logger.log(logger.fmt.orange('No job for harvester', creep.name));
                }

                return;
            }

            creep.takeJob(job);
        }

        return job;
    }

    /**
     * @param {RoomHandler} handler
     */
    searchJobs(handler) {
        return _.first(handler.searchJobs({type: 'harvest', subtype: 'energy'}));
    }

    doJob(job) {
        let creep = this.creep;
        let source = Game.getObjectById(job.sourceId);
        creep.harvest(source);
    }

    gotoJob(job) {
        var pos = RoomPosition.fromDict(job.sourcePos);
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
            this.creep.addTask(MoveTask.create(this.creep, harvestPosition, 0));
        }
        else {
            this.creep.addTask(MoveTask.create(this.creep, pos, 1));
        }
    }
}

module.exports = (function() {

    return {
        HarvesterPureRole: HarvesterPureRole,

        scheduleTask: function(creep) {
            new HarvesterPureRole(creep).scheduleTask();
        },
    }
})();

profiler.registerClass(HarvesterPureRole, 'role-harvester-pure-class');
