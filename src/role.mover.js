const profiler = require('screeps-profiler');

const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

const taskMove = require('task.move');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            if(creep.carry.energy == 0) {
                var source = _.first(_.sortBy(creep.room.getDroppedResources({resource: RESOURCE_ENERGY}), r => r.amount * -1));

                if(!source) {
                    let containers = creep.room.getContainers({resource: RESOURCE_ENERGY, amount: creep.carryCapacity});
                    containers = _.sortBy(containers, /** StructureContainer*/c => _.sum(c.store) * -1);
                    source = _.first(containers);
                }

                if(!source && creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    source = creep.room.getStorage();
                }

                if(source) {
                    if(creep.pos.isNearTo(source)) {
                        if(source instanceof Resource) {
                            creep.pickup(source);
                        }
                        else {
                            creep.withdraw(source, RESOURCE_ENERGY);
                        }
                    }
                    else {
                        creep.addTask(taskMove.task.create(creep, source))
                    }
                }
            }
            else {
                let target = _.first(creep.room.getSpawns().filter(/**StructureSpawn*/ s => s.energy < s.energyCapacity));

                if(!target) {
                    let targets = _(creep.room.getExtensions()).filter(e => e.energy < e.energyCapacity);
                    target = targets.sortBy(e => creep.pos.getRangeTo(e)).first();
                }

                if(!target) {
                    let targets = _(creep.room.getTowers()).filter(t => t.energy < t.energyCapacity);
                    target = targets.sortBy(t => creep.pos.getRangeTo(t)).first();
                }

                if(target) {
                    if(creep.pos.isNearTo(target)) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    }
                    else {
                        creep.addTask(taskMove.task.create(creep, target));
                    }
                }
            }
        },
    }
})();

profiler.registerObject(module.exports, 'role-mover');