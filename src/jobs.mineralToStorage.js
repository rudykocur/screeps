var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class MineralToStorageJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 17;
    }

    generateJobs() {
    }
}

module.exports = (function() {
    return {
        MineralToStorageJobGenerator: MineralToStorageJobGenerator
    }
})();

profiler.registerClass(MineralToStorageJobGenerator, 'MineralToStorageJobGenerator');