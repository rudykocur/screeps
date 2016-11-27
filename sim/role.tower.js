const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {

    return {
        /**
         *
         * @param {StructureTower} tower
         */
        run:  function(tower) {

            if(tower.energy > 200) {
                var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    /**
                     * @param {Structure} struct
                     */
                    filter: function(struct) {
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

