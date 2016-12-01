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
                console.log('Spawn '+spawn.name+': created creep. Name: ' + newCreepName);
                spawnTriggered = true;
                return true;
            }
        },

        createCreepFromGroup: function(groupName, group, spawn, memo) {
            if(spawnTriggered == true) {return;}

            memo = _.defaults(memo || {}, group.memo);
            memo.group = groupName;
            memo.spawn = spawn.name;

            if(spawn.canCreateCreep(group.body) == OK) {
                var name = groupName + getCreepId();
                var newCreepName = spawn.createCreep(group.body, name, memo);
                console.log('Spawn ' + spawn.name +': created creep from group ' + groupName + ', name: ' + newCreepName);
                spawnTriggered = true;
                return true;
            }
        },

        /**
         * @param {StructureSpawn} homeSpawn
         */
        onTick:  function(homeSpawn) {
            spawnTriggered = false;

            if(!homeSpawn) {
                console.log('No home spawn given to autospawn');
                return;
            }

            var creepsBySpawn = _.groupBy(Game.creeps, c => c.memory.spawn || homeSpawn.name);

            _.each(Game.spawns, (spawn, spawnName) => {
                var creeps = creepsBySpawn[spawnName] || [];
                var spawnConfig = config.spawn[spawnName];

                var counts = {};

                creeps.forEach((creep) => {
                    counts[creep.memory.group] = (counts[creep.memory.group] || 0) + 1;
                });

                var needToSpawn = [];

                Object.keys(spawnConfig).forEach(function(groupName) {
                    var group = spawnConfig[groupName];

                    if((counts[groupName] || 0) < group.minimum) {
                        if(group.condition && !group.condition({creep, spawn})) {
                            return;
                        }

                        needToSpawn.push(groupName);
                    }
                });

                var sortedToSpawn = _.sortBy(needToSpawn, name => (spawnConfig[name].priority || 0)*-1);

                if(sortedToSpawn.length > 0) {
                    var groupName = sortedToSpawn[0];
                    var configData = spawnConfig[groupName];
                    module.exports.createCreepFromGroup(groupName, configData, spawn);
                }
            });
        }

    }
})();