module.exports = {
    run:  function(creep) {
        var dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES,6);

        if(dropped[0]) {
            if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped[0])
            }
        } else {
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
};