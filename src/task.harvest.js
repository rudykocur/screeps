var profiler = require('./profiler-impl');
var CreepTask = require('./creepExt').CreepTask;

class HarvestTask extends CreepTask {
    constructor(creep, state) {
        super();
        this.creep = creep;
        this.state = state;
    }

    /**
     *
     * @param {Creep} creep
     * @param {StructureStorage} target
     */
    static create(creep, target) {

        return new module.exports.task(creep, {
            target: target.id,
            maxTicks: 3000,
            ticks: 0,
        })
    }

    run() {
        this.state.ticks ++;
        var source = Game.getObjectById(this.state.target);

        var result = this.creep.harvest(source);

        if(result == ERR_NOT_ENOUGH_RESOURCES || result == ERR_TIRED) {
            return;
        }

        if(result == OK) {
            this.creep.drop(RESOURCE_ENERGY);

            if(this.state.ticks > this.state.maxTicks) {
                this.finish();
            }
            return;
        }

        this.creep.say('ERR H ' + result);
        this.finish();

    }
}

module.exports = (function() {

    return {
        task: HarvestTask,
        HarvestTask: HarvestTask,

    }
})();

profiler.registerClass(HarvestTask, 'task-harvest-class');