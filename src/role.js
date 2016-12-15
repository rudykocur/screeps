const taskMove = require('./task.move');

class CreepRole {

    /**
     * @param {Creep} creep
     */
    constructor(creep) {
        this.creep = creep;
    }

    scheduleTask() {}

    getFleeTask() {
        if(this.creep.memory.fleePoint) {
            return taskMove.task.create(this.creep, RoomPosition.fromDict(this.creep.memory.fleePoint));
        }
    }
}

module.exports = {
    CreepRole: CreepRole
};