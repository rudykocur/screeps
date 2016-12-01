const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        /**
         *
         * @param {StructureTower} tower
         */
        run:  function(tower) {

            var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

            if(hostiles.length > 0) {
                var username = hostiles[0].owner.username;
                tower.attack(hostiles[0]);
                return;
            }

            if(tower.energy > 300) {
                var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    /**
                     * @param {Structure} struct
                     */
                    filter: function(struct) {
                        if(struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) {
                            return struct.hits < 230000;
                        }

                        return (struct.hits / struct.hitsMax) < 0.75;
                    }
                });

                if(target) {
                    tower.repair(target);
                }
            }
        }
    }
})();

