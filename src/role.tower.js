var profiler = require('./profiler-impl');

var config = require('./config');
var actionHarvest = require('./action.harvest');
var actionUtils = require('./action.utils');

module.exports = (function() {

    return {
        /**
         *
         * @param {StructureTower} tower
         */
        run:  function(tower) {

            var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if(hostile) {
                tower.attack(hostile);
                return;
            }

            if(tower.energy > 300) {
                var wallsHp = config.rooms[tower.room.customName].wallsHp || 20000;
                var structRampartsHp = config.rooms[tower.room.customName].structRampartsHp || wallsHp;

                let rampartsOverStruct = tower.room.getRampartsOverStructures();

                var toRepair = tower.room.find(FIND_STRUCTURES, {
                    /**
                     * @param {Structure} struct
                     */
                    filter: function(struct) {
                        if(struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) {
                            if(rampartsOverStruct.indexOf(struct.id) >= 0) {
                                return struct.hits < structRampartsHp;
                            }
                            return struct.hits < wallsHp;
                        }

                        return (struct.hits / struct.hitsMax) < 0.75;
                    }
                });

                var target = _.first(_.sortBy(toRepair, struct => {
                    if(rampartsOverStruct.indexOf(struct.id) >= 0) {
                        return struct.hits/structRampartsHp;
                    }

                    if(struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) {
                        return struct.hits/wallsHp;
                    }

                    return struct.hits/struct.hitsMax;
                }));

                if(target) {
                    tower.repair(target);
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-tower');