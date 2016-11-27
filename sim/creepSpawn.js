const config = require('config');

module.exports = (function() {

    function getCreepId() {
        Memory.counters = Memory.counters || {};
        Memory.counters.creepId = Memory.counters.creepId || 1;

        if(Memory.counters.creepId > 100000) {
            Memory.counters.creepId = 1;
        }

        return Memory.counters.creepId++;
    }

    return {
        createCreep: function(groupName, spawn) {
            var group = config.spawn[groupName];

            var memo = group.memo;
            memo.group = groupName;

            if(spawn.canCreateCreep(group.body) == OK) {
                var name = groupName + getCreepId();
                var newCreepName = spawn.createCreep(group.body, name, memo);
                console.log('Spawned creep from group ' + groupName + ', name: ' + newCreepName);
            }
        },

        /**
         * @param {StructureSpawn} spawn
         */
        autospawn:  function(spawn) {
            var counts = {};

            Object.keys(Game.creeps).forEach(function (creepName) {
                var creep = Game.creeps[creepName];
                counts[creep.memory.group] = (counts[creep.memory.group] || 0) + 1;
            });

            Object.keys(config.spawn).forEach(function(groupName) {
                var group = config.spawn[groupName];

                if((counts[groupName] || 0) < group.minimum) {
                    module.exports.createCreep(groupName, spawn);

                }
            });
        }
    }
})();