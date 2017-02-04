var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class TerminalToStorageJobGenerator extends JobGenerator {

    generateJobs() {
        var requires = _.get(this.config, 'terminal.require', {});

        var terminal = this.room.getTerminal();
        var storage = this.room.getStorage();

        if(!terminal || !storage) {
            return;
        }

        var jobs = this.state.jobs;

        _.each(terminal.store, (amount, resource) => {
            var key = `terminal-withdraw-${this.room.customName}-${resource}`;

            // all non-base resources are left in terminal
            if(RESOURCES_BASE.indexOf(resource) < 0) {
                return;
            }

            var availableAmount = amount - (requires[resource] || 0);

            if(availableAmount > 0) {
                if(!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'transfer',
                        sourceId: terminal.id,
                        sourcePos: terminal.pos,
                        resource: resource,
                        targetId: storage.id,
                        targetPos: storage.pos,
                        takenBy: null,
                        amount: 0,
                    }
                }

                jobs[key].amount = availableAmount;
            }
            else {
                delete jobs[key];
            }
        });
    }
}

module.exports = (function() {
    return {
        TerminalToStorageJobGenerator: TerminalToStorageJobGenerator
    }
})();

profiler.registerClass(TerminalToStorageJobGenerator, 'TerminalToStorageJobGenerator');