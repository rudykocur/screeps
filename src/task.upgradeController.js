var profiler = require('./profiler-impl');
var creepExt = require('./creepExt');

var cache = require('./cache');
var actionUtils = require('./action.utils');

module.exports = (function() {

    return {
        task: class UpgradeControllerTask extends creepExt.CreepTask {
            constructor(creep, state) {
                super();
                this.creep = creep;
                this.state = state;
            }

            /**
             *
             * @param {Creep} creep
             */
            static create(creep) {
                var path = cache.getPath(creep.pos, creep.room.controller.pos, () => {
                    return creep.pos.findPathTo(creep.room.controller, {
                        costCallback: actionUtils.costCallback
                    });
                });

                return new module.exports.task(creep, {
                    target: creep.room.controller.id,
                    path: path,
                })
            }

            run() {

                /** @param {StructureController} */
                var target = Game.getObjectById(this.state.target);
                var result = this.creep.upgradeController(target);

                if(result == OK) {
                    return;
                }

                if(result == ERR_NOT_ENOUGH_RESOURCES) {
                    creepExt.endTask(this.creep);

                    return;
                }

                if(result == ERR_NOT_IN_RANGE) {
                    this.creep.repair(_.first(this.creep.pos.lookFor(LOOK_STRUCTURES)));
                    return this.move();
                }

                this.creep.say('ERR U' + result);
                creepExt.endTask(this.creep);
            }
        },

    }
})();

profiler.registerObject(module.exports.task, 'task-upgrade-class');