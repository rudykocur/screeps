const config = require('config');
const utils = require('utils');

module.exports = (function() {
    var spawnerBlocked = {};

    var getCreepId = _.partial(utils.getNextId, 'creepId');

    return {
        createCreep: function(spawn, name, body, memo) {
            if(spawnerBlocked[spawn.name] == true) {return;}

            spawnerBlocked[spawn.name] = true;

            if(spawn.canCreateCreep(body) == OK) {
                name = name + getCreepId();
                var newCreepName = spawn.createCreep(body, name, memo);
                console.log('Spawn '+spawn.name+': created creep. Name: ' + newCreepName);
                return true;
            }
        },

        createCreepFromGroup: function(groupName, group, spawn, memo) {
            if(spawnerBlocked[spawn.name] == true) {return;}

            spawnerBlocked[spawn.name] = true;

            memo = _.defaults(memo || {}, group.memo);
            memo.group = groupName;
            memo.spawn = spawn.name;

            if(spawn.canCreateCreep(group.body) == OK) {
                var name = groupName + getCreepId();
                var newCreepName = spawn.createCreep(group.body, name, memo);
                console.log('Spawn ' + spawn.name +': created creep from group ' + groupName + ', name: ' + newCreepName);
                return true;
            }
        },

        /**
         * @param {StructureSpawn} homeSpawn
         */
        onTick:  function(homeSpawn) {
            spawnerBlocked = {};

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
                        try {
                            if (group.condition && !group.condition({spawn})) {
                                return;
                            }
                        }
                        catch(e) {
                            console.log('Condition failed', e, '::', e.stack);
                            Game.notify('Spawn condition failed: ' + e + ' :: ' + e.stack);
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