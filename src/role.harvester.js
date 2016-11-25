const actionHarvest = require('action.harvest');

module.exports = {
    run:  function(creep) {
        if(creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = false
        }
        if(!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = true
        }

        if(creep.memory.harvesting) {
            var target = findTargetToTransfer(creep);
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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

function findTargetToTransfer(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => (structure.structureType == STRUCTURE_EXTENSION &&
                                structure.energy < structure.energyCapacity)
    });

    if(!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => (structure.structureType == STRUCTURE_SPAWN &&
                                structure.energy < structure.energyCapacity)
      })
    }

    if(!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => structure.structureType == STRUCTURE_STORAGE
      })
    }

    return target;
}