const profiler = require('./profiler-impl');
const creepExt = require('./creepExt');

const actionUtils = require('./action.utils');

class MoveTask extends creepExt.CreepTask {
    constructor(creep, state) {
        super();
        this.creep = creep;
        this.state = state;
    }

    /**
     *
     * @param {Creep} creep
     * @param {StructureStorage} target
     * @param range
     */
    static create(creep, target, range = 0) {
        var path;
        var pos;

        if(target.pos) {
            pos = target.pos;
        }
        else {
            pos = target;
        }

        // if(pos.roomName == creep.pos.roomName) {
            path = creep.pos.findPathTo(pos, {
                costCallback: actionUtils.costCallback
            });
        // }
        // else {
        //     path = actionUtils.findRoomRoute(creep, pos).path;
        // }

        return new module.exports.task(creep, {
            path: path,
            range: range,
            // multiroom: (pos.roomName != creep.pos.roomName),
            multiroom: false,
        })
    }

    run() {
        var result;
        var range = this.state.range || 0;
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
            if(this.state.path.length <= range) {
                this.finish();
            }
            return;
        }

        this.creep.say('ERR M ' + result);
        this.finish();

    }
}

module.exports = (function() {

    return {
        task: MoveTask,
        MoveTask: MoveTask,

    }
})();

profiler.registerObject(MoveTask, 'task-move-class');