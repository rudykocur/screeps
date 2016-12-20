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
                var towerHp = config.rooms[tower.room.customName].wallsHp || 230000;

                var toRepair = tower.room.find(FIND_STRUCTURES, {
                    /**
                     * @param {Structure} struct
                     */
                    filter: function(struct) {
                        if(struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) {
                            return struct.hits < towerHp;
                        }

                        return (struct.hits / struct.hitsMax) < 0.75;
                    }
                });

                var target = _.first(_.sortBy(toRepair, struct => (struct.hits/struct.hitsMax)));

                if(target) {
                    tower.repair(target);
                }
            }
        }
    }
})();

profiler.registerObject(module.exports, 'role-tower');