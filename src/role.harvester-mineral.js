var profiler = require('./profiler-impl');

var HarvesterPureRole = require('./role.harvester-pure').HarvesterPureRole;

class HarvesterMineralRole extends HarvesterPureRole {
    constructor(creep) {
        super(creep);
    }

    searchJobs(handler) {
        return _.first(handler.searchJobs({type: 'harvest', subtype: 'mineral'}));
    }
}

module.exports = (function() {

    return {
        /**
         *
         * @param {Creep} creep
         */
        scheduleTask: function (creep) {
            new HarvesterMineralRole(creep).scheduleTask();
        }
    }
})();

profiler.registerClass(HarvesterMineralRole, 'role-harvester-mineral-class');