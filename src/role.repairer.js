const actionHarvest = require('action.harvest');

module.exports = {
    run:  function(creep) {
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false
        }
        if(!creep.memory.repairing && creep.carry.energy >= creep.carryCapacity - 2) {
            creep.memory.repairing = true
        }

        // console.log('Repairer ' + creep.name + ' :: ' + creep.memory.repairing);

        if(creep.memory.repairing) {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(struct) {
                    var hpLeft = struct.hits / struct.hitsMax;

                    return struct.structureType == STRUCTURE_ROAD && hpLeft < 0.65;
                }
            });

            //console.log('TARGET FOR REP ' + target);

            if(target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }

                return;
            }

            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }

                return;
            }

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            actionHarvest.run(creep);
        }
    }
};