var profiler = require('./profiler-impl');
var logger = require('./logger');

var HarvesterPureRole = require('./role.harvester-pure').HarvesterPureRole;

class HarvesterLinkRole extends HarvesterPureRole {
    constructor(creep) {
        super(creep);
    }

    doJob(job) {
        super.doJob(job);

        let creep = this.creep;
        let source = Game.getObjectById(job.sourceId);

        if(creep.carry.energy + 50 > creep.carryCapacity) {
            let link = creep.room.getLinkForSource(source.id);
            if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(link);
            }
        }
    }

    searchJobs(handler) {
        return _.first(handler.searchJobs({type: 'harvest', subtype: 'energy-link'}));
    }
}

module.exports = (function() {

    return {
        /**
         *
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            new HarvesterLinkRole(creep).scheduleTask();
        },
    }
})();

profiler.registerClass(HarvesterLinkRole, 'role-harvester-link-class');

