const creepExt = require('creepExt');

const actionUtils = require('action.utils');

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
                var path;
                var pos;

                if(target.pos) {
                    pos = target.pos;
                }
                else {
                    pos = target;
                }

                // if(pos.roomName == creep.pos.roomName) {
                    path = creep.pos.findPathTo(pos);
                // }
                // else {
                //     path = actionUtils.findRoomRoute(creep, pos).path;
                // }

                return new module.exports.task(creep, {
                    path: path,
                    // multiroom: (pos.roomName != creep.pos.roomName),
                    multiroom: false,
                })
            }

            run() {
                var result;
                // if(this.state.multiroom) {
                //     let step = this.state.path[0];
                //     result = this.creep.move(this.creep.pos.getDirectionTo(step));
                // }
                // else {
                    result = this.creep.moveByPath(this.state.path);
                // }

                if(result == ERR_TIRED) {
                    return;
                }

                if(result == OK) {
                    this.state.path.splice(0, 1);
                    if(this.state.path.length <= 0) {
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