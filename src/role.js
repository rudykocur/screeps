var taskMove = require('./task.move');

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

    tryBoostSelf(part, effect) {
        let creep = this.creep;

        if(creep.ticksToLive > (CREEP_LIFE_TIME - 200)) {
            if(creep.canBoostParts(MOVE)) {

                let lab = creep.workRoomHandler.getLabToBoost(MOVE, BOOST_RESULT_FATIGUE);
                if(lab) {
                    console.log('Will try to boost', part,' for', creep);

                    if(creep.pos.isNearTo(lab)) {
                        lab.boostCreep(creep);
                    }
                    else {
                        creep.addTask(MoveTask.create(creep, lab, 1));
                        return true;
                    }
                }
            }
        }
    }
}

module.exports = {
    CreepRole: CreepRole
};