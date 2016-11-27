const creepExt = require('creepExt');

module.exports = (function() {

    return {
        task: class WithdrawFromStorageTask extends creepExt.CreepTask {
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
                var path = creep.pos.findPathTo(target.pos);

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
                    return;
                }

                if(result == ERR_NOT_IN_RANGE) {
                    return this.move();
                }

                this.creep.say('ERR WST ' + result);
                creepExt.endTask(this.creep);

            }
        },

    }
})();