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

        _.each(requires, (amount, resource) => {
            var key = `terminal-require-${this.room.customName}-${resource}`;

            var available = storage.store[resource] - _.get(reserves, resource, 10000);
            let terminalAmount = (terminal.store[resource] || 0);

            if(available > 0 && terminalAmount < amount) {
                if(!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'transfer',
                        sourceId: storage.id,
                        sourcePos: storage.pos,
                        resource: resource,
                        targetId: terminal.id,
                        targetPos: terminal.pos,
                        takenBy: null,
                        amount: 0,
                    }
                }

                jobs[key].amount = Math.max(0, Math.min(available, amount - terminalAmount));
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