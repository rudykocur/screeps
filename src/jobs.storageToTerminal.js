var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class StorageToTerminalJobGenerator extends JobGenerator {

    generateJobs() {
        var terminal = this.room.getTerminal();
        var storage = this.room.getStorage();

        if(!terminal || !storage) {
            return;
        }

        var requires = _.get(this.config, 'terminal.require', {});
        var reserves = _.get(this.config, 'minerals.reserve', {});
        var jobs = this.state.jobs;

        _.each(storage.store, (storedAmount, resource) => {
            var key = `terminal-require-${this.room.customName}-${resource}`;

            let requiredAmount = requires[resource] || 0;

            let resourceReserve = (RESOURCES_BASE.indexOf(resource) >= 0 ? 10000 : 0);
            if(resource == RESOURCE_ENERGY) {
                resourceReserve = 20000;
            }

            var available = storedAmount - _.get(reserves, resource, resourceReserve);

            let terminalAmount = (terminal.store[resource] || 0);

            let shouldMove = false;
            let moveAmount = 0;
            if(RESOURCES_BASE.indexOf(resource) >= 0) {
                shouldMove = (available > 0 && terminalAmount < requiredAmount);
                moveAmount = Math.max(0, Math.min(available, requiredAmount - terminalAmount));
            }
            else {
                shouldMove = true;
                moveAmount = storedAmount;
            }

            if(shouldMove) {
                if(!(key in jobs)) {
                    jobs[key] = this._getJobTransferDict(key, storage, terminal, resource);
                }

                jobs[key].amount = moveAmount;
            }
            else {
                delete jobs[key];
            }
        })
    }
}

module.exports = (function() {
    return {
        StorageToTerminalJobGenerator: StorageToTerminalJobGenerator
    }
})();

profiler.registerClass(StorageToTerminalJobGenerator, 'StorageToTerminalJobGenerator');