module.exports = {
    shouldHarvestEnergy:  function(creep) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        return creep.memory.harvesting;
    },

    actionTryBuild: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                creep.build(target);
            }

            return true;
        }

        return false
    },

    actionTryRepairRoad: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struct) {
                var hpLeft = struct.hits / struct.hitsMax;

                return struct.structureType == STRUCTURE_ROAD && hpLeft < 0.65;
            }
        });

        if(target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                creep.repair(target);
            }

            return true;
        }

        return false;
    },

    actionFillController: function(creep) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};