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
        createCreep: function(groupName, spawn, memo) {
            var group = config.spawn[groupName];

            memo = _.defaults(memo || {}, group.memo);
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
            if(!spawn) {
                console.log('No spawn given to autospawn');
                return;
            }

            var counts = {};

            Object.keys(Game.creeps).forEach(function (creepName) {
                var creep = Game.creeps[creepName];
                counts[creep.memory.group] = (counts[creep.memory.group] || 0) + 1;
            });

            var needToSpawn = [];

            Object.keys(config.spawn).forEach(function(groupName) {
                var group = config.spawn[groupName];

                if((counts[groupName] || 0) < group.minimum) {
                    needToSpawn.push(groupName);
                }
            });

            var sortedToSpawn = _.sortBy(needToSpawn,name => (config.spawn[name].priority || 0));

            if(sortedToSpawn.length > 0) {
                module.exports.createCreep(sortedToSpawn[0], spawn);
            }
        }
    }
})();