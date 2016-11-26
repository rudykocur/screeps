module.exports = (function() {

    function tryHarvestSource(creep) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);

        if (creep.memory.energySource) {
            var desirableSource = Game.getObjectById(creep.memory.energySource);
            if (desirableSource) {
                source = desirableSource;
            }
        }

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    function tryHarvestStorage(creep) {
        var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {

            /**
             *
             * @param {StructureContainer} struct
             */
            filter: function(struct) {
                return _.sum(struct.store) > 50;
            }
        });

        if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    return {
        tryHarvestSource: tryHarvestSource,

        tryHarvestStorage: tryHarvestStorage,

        tryTransferToSpawn: function(creep) {
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

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        tryTransferToStorage: function(creep) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                /**
                 * @param {StructureStorage} struct
                 */
                filter: struct => (struct.structureType == STRUCTURE_STORAGE &&
                                        _.sum(struct.store) < struct.storeCapacity)
            });

            if(!target) {
              target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: struct => (struct.structureType == STRUCTURE_CONTAINER &&
                                        _.sum(struct.store) < struct.storeCapacity)
              })
            }

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        run:  function(creep) {
            var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,6);

            if(dropped[0]) {
                if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped[0])
                }
            }
            else {
              var source = creep.pos.findClosestByRange(FIND_SOURCES);
              if(creep.memory.energySource) {
                var desirableSource = Game.getObjectById(creep.memory.energySource);
                if(desirableSource) {
                    source = desirableSource;
                }
              }

              if(source.structureType) {
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

              } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

              }
            }
        }
    }
})();