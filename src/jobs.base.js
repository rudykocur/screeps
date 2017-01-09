var profiler = require('./profiler-impl');
var _ = require('lodash');

class JobGenerator {

    /**
     *
     * @param {RoomHandler} handler
     */
    constructor(handler) {
        this.handler = handler;
        this.room = this.handler.room;
        this.config = this.handler.config;
        this.state = this.handler.state;

        this.interval = 1;
    }

    generate() {
        if(this.interval == 1 || Game.time % this.interval == 0) {
            this.generateJobs();
        }
    }

    generateJobs() {}

    _getJobTransferDict(key, source, target, resource) {
        return {
            key: key,
            room: this.room.customName,
            type: 'transfer',
            sourceId: source.id,
            sourcePos: source.pos,
            resource: resource,
            targetId: target.id,
            targetPos: target.pos,
            takenBy: null,
            amount: 0,
        }
    }
}

module.exports = (function() {
    return {
        JobGenerator: JobGenerator
    }
})();

profiler.registerClass(JobGenerator, 'JobGenerator');