var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class LinkToStorageJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 6;
    }

    generateJobs() {
        this.generateStorageInboundLinkJob();
        this.generateStorageOutboundLinkJob();
    }

    generateStorageInboundLinkJob() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();
        let link = this.room.getLinkForStorage();

        if(!link) {
            return;
        }

        var key = `storageLink-${this.room.customName}-energy`;

        if(link.energy > 0) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, link, storage, RESOURCE_ENERGY, 'link-storage');
            }
            jobs[key].amount = link.energy;
        }
        else {
            delete jobs[key];
        }
    }

    generateStorageOutboundLinkJob() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();
        let link = this.room.getLinkByType('storage-out');

        if(!link) {
            return;
        }

        var key = `storageLinkOut-${this.room.customName}-energy`;

        if(link.energy < link.energyCapacity * 0.5 && storage.store.energy > 20000) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, storage, link, RESOURCE_ENERGY);
            }
            jobs[key].amount = link.energyCapacity - link.energy;
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