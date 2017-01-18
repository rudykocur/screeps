var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class MineralToStorageJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 12;
    }

    generateJobs() {
        var extractor = this.room.getExtractor();

        if(!extractor) {
            return;
        }

        var jobs = this.state.jobs;

        let storage = this.room.getStorage();

        var container = extractor.container;

        var key = `mineralMove-${extractor.resource}`;
        if(container && container.store[extractor.mineral] > 400) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, container, storage, extractor.resource);
            }

            jobs[key].amount = container.store[extractor.resource];
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