
const profiler = require('./profiler-impl');
const stats = require('./stats');
const creepExt = require('./creepExt');
const CreepTask = require('./creepExt').CreepTask;

const actionUtils = require('./action.utils');

class WithdrawFromStorageTask extends CreepTask {
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
        var path = creep.pos.findPathTo(target.pos, {
                costCallback: actionUtils.costCallback
            });

        return new module.exports.task(creep, {
            target: target.id,
            path: path,
        })
    }

    run() {
        /** @param {StructureStorage} */
        var target = Game.getObjectById(this.state.target);
        var result = this.creep.withdraw(target, RESOURCE_ENERGY);

        if(result == OK) {
            creepExt.endTask(this.creep);

            stats.registerExpense(this.creep.room.customName, 'upgrader', this.creep.memory.role, this.creep.carryCapacity);

            return;
        }

        if(result == ERR_NOT_IN_RANGE) {
            return this.move();
        }

        this.creep.say('ERR WST ' + result);
        creepExt.endTask(this.creep);

    }
}

module.exports = (function() {

    return {
        task: WithdrawFromStorageTask,
        WithdrawFromStorageTask: WithdrawFromStorageTask,

    }
})();

profiler.registerClass(WithdrawFromStorageTask, 'task-withdraw-class');