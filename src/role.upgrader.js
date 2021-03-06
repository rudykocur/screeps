var profiler = require('./profiler-impl');

var stats = require('./stats');
var actionHarvest = require('./action.harvest');
var actionUtils = require('./action.utils');
var creepExt = require('./creepExt');
var taskUpgrade = require('./task.upgradeController');
var TaskWithdraw = require('./task.withdrawFromStorage').WithdrawFromStorageTask;
var MoveTask = require('./task.move').MoveTask;

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(creep.ticksToLive > (CREEP_LIFE_TIME - 200)) {
                if(creep.canBoostParts(WORK)) {

                    let lab = creep.workRoomHandler.getLabToBoost(WORK, BOOST_RESULT_UPGRADE_CONTROLLER);
                    if(lab) {
                        console.log('Will try to boost WORK for', creep);

                        if(creep.pos.isNearTo(lab)) {
                            lab.boostCreep(creep);
                        }
                        else {
                            creep.addTask(MoveTask.create(creep, lab, 1));
                            return;
                        }
                    }
                }
            }

            let room = Game.rooms[creep.memory.room];

            if(creep.carry.energy == 0) {
                var target;

                let link = room.getLinkByType('controller');
                if(link && link.energy > 100) {
                    target = link;
                }

                if(!target) {
                    target = room.getStorage();

                    // if we have storage built but not enough energy, then dont try to borrow from containers.
                    if(target && target.store.energy < 10000) {
                        return;
                    }
                }

                if(!target) {
                    let targets = _(room.getContainers({resource: RESOURCE_ENERGY, amount: creep.carryCapacity}));
                    target = targets.sortBy(t => creep.pos.getRangeTo(t)).first();
                }

                if(target) {
                    creepExt.addTask(creep, TaskWithdraw.create(creep, target));
                }
            }
            else {
                creep.setPrespawnTime();
                creepExt.addTask(creep, taskUpgrade.task.create(creep));
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-upgrader');