const config = require('config');

module.exports = (function() {
    var spawnTriggered = false;

    function getCreepId() {
        Memory.counters = Memory.counters || {};
        Memory.counters.creepId = Memory.counters.creepId || 1;

        if(Memory.counters.creepId > 100000) {
            Memory.counters.creepId = 1;
        }

        return Memory.counters.creepId++;
    }

    return {
        createCreep: function(spawn, name, body, memo) {
            if(spawnTriggered == true) {return false;}

            if(spawn.canCreateCreep(body) == OK) {
                name = name + getCreepId();
                var newCreepName = spawn.createCreep(body, name, memo);
                console.log('Spawned creep. Name: ' + newCreepName);
                spawnTriggered = true;
                return true;
            }
        },

        createCreepFromGroup: function(groupName, spawn, memo) {
            if(spawnTriggered == true) {return;}

            var group = config.spawn[groupName] || {};

            memo = _.defaults(memo || {}, group.memo);
            memo.group = groupName;

            if(spawn.canCreateCreep(group.body) == OK) {
                var name = groupName + getCreepId();
                var newCreepName = spawn.createCreep(group.body, name, memo);
                console.log('Spawned creep from group ' + groupName + ', name: ' + newCreepName);
                spawnTriggered = true;
                return true;
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

            var sortedToSpawn = _.sortBy(needToSpawn,name => (config.spawn[name].priority || 0)*-1);

            if(sortedToSpawn.length > 0) {
                module.exports.createCreepFromGroup(sortedToSpawn[0], spawn);
            }
        }

    }
})();