var profiler = require('./profiler-impl');
var _ = require('lodash');
var logFmt = require('./logger').fmt;
var CreepTask = require('./creepExt').CreepTask;

var cache = require('./cache');
var actionUtils = require('./action.utils');

class MoveTask extends CreepTask {
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
     * @param {RoomObject|RoomPosition} target
     * @param range
     * @param ignoreDanger
     */
    static create(creep, target, range = 0, ignoreDanger = false) {
        var path;
        var pos;

        if(target.pos) {
            pos = target.pos;
        }
        else {
            pos = target;
        }

        path = cache.getPath(creep.pos, pos, () => {
            if(ignoreDanger) {
                return creep.pos.findPathTo(pos);
            }

            return creep.pos.findPathTo(pos, {
                costCallback: actionUtils.costCallback
            })
        });

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

        var lastPos = this.state.lastPosition ? RoomPosition.fromDict(this.state.lastPosition) : this.creep.pos;

        if(this.state.standingCounter > 5) {
            console.log(logFmt.orange('Creep', this.creep, 'is stuck for', this.state.standingCounter, 'ticks'));
            this.creep.say('ERR MST');
            this.finish();
            return;
        }

        this.creep.repair(_.first(this.creep.pos.lookFor(LOOK_STRUCTURES)));
        result = this.creep.moveByPath(this.state.path);

        if(result == ERR_TIRED) {
            return;
        }

        if(this.creep.pos.isEqualTo(lastPos)) {
            this.state.standingCounter = (this.state.standingCounter || 0) + 1;
        }
        else {
            this.state.standingCounter = 0;
        }
        this.state.lastPosition = this.creep.pos;

        if(result == OK) {
            if(this.state.multiroom) {
                range = 0;
            }

            var lastPoint = this.state.path[this.state.path.length-1];

            if(this.creep.pos.inRangeTo(lastPoint.x, lastPoint.y, range+1)) {
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

profiler.registerClass(MoveTask, 'task-move-class');