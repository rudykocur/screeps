var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class SpawnRefillJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 8;
    }

    generateJobs() {
        var jobs = this.state.jobs;

        this.room.getSpawns().concat(this.room.getExtensions()).forEach(/**StructureSpawn*/item => {
            var key = `refill-${this.room.customName}-${item.id}`;

            if(item.energy < item.energyCapacity) {
                if(!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'refill',
                        subtype: 'spawn',
                        targetId: item.id,
                        targetPos: item.pos,
                        takenBy: null,
                    }
                }
            }
            else {
                delete jobs[key];
            }
        });

        this.room.getTowers().forEach(/**StructureTower*/ tower => {
            var key = `refill-${this.room.customName}-tower-${tower.id}`;

            if(tower.energy < tower.energyCapacity) {
                if(!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'refill',
                        subtype: 'tower',
                        targetId: tower.id,
                        targetPos: tower.pos,
                        takenBy: null,
                    }
                }
            }
            else {
                delete jobs[key];
            }
        })
    }
}

module.exports = (function() {
    return {
        SpawnRefillJobGenerator: SpawnRefillJobGenerator
    }
})();

profiler.registerClass(SpawnRefillJobGenerator, 'SpawnRefillJobGenerator');