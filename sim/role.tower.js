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
                Game.notify(`User ${username} spotted in room ${roomName}`);
                // var towers = Game.rooms[roomName].find(
                //     FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                tower.attack(hostiles[0]);
                return;
            }

            if(tower.energy > 200) {
                var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    /**
                     * @param {Structure} struct
                     */
                    filter: function(struct) {
                        if(struct.structureType == STRUCTURE_WALL) {
                            return struct.hits < 70000;
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

