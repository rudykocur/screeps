var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class MineralToStorageJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 12;
    }

    generateJobs() {
        /** @type Mineral */
        var mineral = _.first(this.room.find(FIND_MINERALS));
        var jobs = this.state.jobs;

        let storage = this.room.getStorage();

        var container = _.first(mineral.pos.findInRange(this.room.getContainers(), 1));

        var key = `mineralMove-${mineral.mineralType}`;
        if(container && container.store[mineral.mineralType] > 400) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, container, storage, mineral.mineralType);
            }

            jobs[key].amount = container.store[mineral.mineralType];
        }
        else {
            delete jobs[key];
        }
    }
}

module.exports = (function() {
    return {
        MineralToStorageJobGenerator: MineralToStorageJobGenerator
    }
})();

profiler.registerClass(MineralToStorageJobGenerator, 'MineralToStorageJobGenerator');