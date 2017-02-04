var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class LoadNukeJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 4;
    }

    generateJobs() {
        var jobs = this.state.jobs;

        var nuke = this.room.getNuke();
        var storage = this.room.getStorage();
        var terminal = this.room.getTerminal();

        if(!nuke) {
            return;
        }

        var energyKey = `nuke-load-${this.room.customName}-energy`;
        var ghodiumKey = `nuke-load-${this.room.customName}-G`;

        if(storage.store.energy > 400000 && nuke.energy < nuke.energyCapacity) {
            if(!(energyKey in jobs)) {
                jobs[energyKey] = this._getJobTransferDict(energyKey, storage, nuke, RESOURCE_ENERGY);
            }
            jobs[energyKey].amount = nuke.energyCapacity - nuke.energy;
        }
        else {
            delete jobs[energyKey];
        }

        if(terminal.store[RESOURCE_GHODIUM] > 3000 && nuke.ghodium < nuke.ghodiumCapacity) {
            if(!(ghodiumKey in jobs)) {
                jobs[ghodiumKey] = this._getJobTransferDict(ghodiumKey, terminal, nuke, RESOURCE_GHODIUM);
            }
            jobs[ghodiumKey].amount = nuke.ghodiumCapacity - nuke.ghodium;
        }
        else {
            delete jobs[ghodiumKey];
        }
    }
}

module.exports = (function() {
    return {
        LoadNukeJobGenerator: LoadNukeJobGenerator
    }
})();

profiler.registerClass(LoadNukeJobGenerator, 'LoadNukeJobGenerator');