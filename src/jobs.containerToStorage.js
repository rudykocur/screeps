var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class ContainerToStorageJobGenerator extends JobGenerator {

    generateJobs() {
        var jobs = this.state.jobs;
        var storage = this.room.getStorage();

        if(storage) {
            this.room.getContainers().forEach(/**StructureContainer*/container => {
                var key = `move-container-${this.room.customName}-${container.id}`;

                if (container.store[RESOURCE_ENERGY] > 400) {
                    if (!(key in jobs)) {
                        jobs[key] = {
                            key: key,
                            room: this.room.customName,
                            type: 'pickup',
                            subtype: 'container',
                            resource: RESOURCE_ENERGY,
                            sourceId: container.id,
                            sourcePos: container.pos,
                            targetId: storage.id,
                            targetPos: storage.pos,
                            reservations: {},
                            amount: 0,
                        }
                    }

                    jobs[key].amount = container.store[RESOURCE_ENERGY];
                }
                else {
                    delete jobs[key];
                }
            });
        }
    }
}

module.exports = (function() {
    return {
        ContainerToStorageJobGenerator: ContainerToStorageJobGenerator
    }
})();

profiler.registerClass(ContainerToStorageJobGenerator, 'ContainerToStorageJobGenerator');