var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class LinkToStorageJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 17;
    }

    generateJobs() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();
        let link = this.room.getLinkForStorage();

        if(!link) {
            return;
        }

        var key = `storageLink-${this.room.customName}-energy`;

        if(link.energy > 0) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, link, storage, RESOURCE_ENERGY);
            }
            jobs[key].amount = link.energy;
        }
        else {
            delete jobs[key];
        }
    }
}

module.exports = (function() {
    return {
        LinkToStorageJobGenerator: LinkToStorageJobGenerator
    }
})();

profiler.registerClass(LinkToStorageJobGenerator, 'LinkToStorageJobGenerator');