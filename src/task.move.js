const profiler = require('./profiler-impl');
const creepExt = require('./creepExt');

const actionUtils = require('./action.utils');

class MoveTask extends creepExt.CreepTask {
    /**
     * @param {Creep} creep
     * @param state
     */
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

        // console.log('OMG PAtH', creep.name, ':;', JSON.stringify(path));
        let isRoomBoudary = false;
        if(path.length > 0) {
            let ls = path[path.length - 1];
            isRoomBoudary = (ls.x == 0 || ls.y == 0 || ls.x == 49 || ls.y == 49);

        }

        return new module.exports.task(creep, {
            path: path,
            range: range,
            // multiroom: (pos.roomName != creep.pos.roomName),
            multiroom: isRoomBoudary,
        })
    }

    run() {
        var result;
        var range = this.state.range || 0;
        var lastError = this.state.lastError;
        delete this.state.lastError;
        // if(this.state.multiroom) {
        //     let step = this.state.path[0];
        //     result = this.creep.move(this.creep.pos.getDirectionTo(step));
        // }
        // else {
        this.creep.repair(_.first(this.creep.pos.lookFor(LOOK_STRUCTURES)));
            result = this.creep.moveByPath(this.state.path);
        // }

        if(result == ERR_TIRED) {
            return;
        }

        if(result == OK) {


            if(this.state.multiroom) {
                range = 0;
            }
            // let lastStep = this.state.path[this.state.path.length - 1];
            // if(this.creep.pos.inRangeTo(lastStep, range)) {
            //     this.finish();
            // }

            this.state.path.splice(0, 1);
            if(this.state.path.length <= range) {
                this.finish();
            }
            return;
        }

        // if(!lastError) {
        //     this.creep.say('ERR temp ' + result);
        //     this.state.lastError = result;
        // }
        // else {
            this.creep.say('ERR M ' + result);
            this.finish();
        // }

    }
}

module.exports = (function() {

    return {
        task: MoveTask,
        MoveTask: MoveTask,

    }
})();

profiler.registerClass(MoveTask, 'task-move-class');