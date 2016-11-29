const creepExt = require('creepExt');

module.exports = (function() {

    return {
        task: class MoveTask extends creepExt.CreepTask {
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
                    path: path,
                })
            }

            run() {
                var result = this.creep.moveByPath(this.state.path);

                if(result == ERR_TIRED) {
                    return;
                }

                if(result == OK) {
                    this.state.path.splice(0, 1);
                    if(this.state.path.length <= 1) {
                        this.finish();
                    }
                    return;
                }

                this.creep.say('ERR M ' + result);
                this.finish();

            }
        },

    }
})();