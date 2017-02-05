var config = require('./config');
var utils = require('./utils');

var spawnQueue = require('./spawnQueue');

module.exports = (function() {
    return {
        /**
         * @param {StructureSpawn} homeSpawn
         */
        autospawn: function(homeSpawn) {

            if(!homeSpawn) {
                console.log('No home spawn given to autospawn');
                return;
            }

            var creepsBySpawn = _.groupBy(Game.creeps, c => c.memory.spawn || homeSpawn.name);

            _.each(Game.spawns, (spawn, spawnName) => {
                var creeps = creepsBySpawn[spawnName] || [];
                var spawnConfig = config.spawn[spawnName];

                if(!spawnConfig) {
                    return;
                }

                var counts = {};

                creeps.forEach((/**Creep*/creep) => {
                    if(creep.ticksToLive < (creep.memory.spawnTime+(creep.memory.prespawnTime||0))) {
                        return;
                    }

                    counts[creep.memory.group] = (counts[creep.memory.group] || 0) + 1;
                });

                Object.keys(spawnConfig).forEach(function(groupName) {
                    var group = spawnConfig[groupName];

                    if((counts[groupName] || 0) < group.minimum) {

                        var memo = _.defaults({}, group.memo);
                        memo.group = groupName;
                        memo.spawn = spawn.name;

                        spawnQueue.enqueueCreep(group.priority, spawn.room, groupName, group.body, memo);
                    }
                });

            });
        }

    }
})();