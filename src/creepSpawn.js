module.exports = (function() {

    var groups = {
        builder: {
            minimum: 2,
            body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'builder'}
        },

        upgrader: {
            minimum: 3,
            body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {
                role: 'upgrader',
                fromStructures: 'containersTop'
            }
        },

        harvester: {
            minimum: 2,
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
            memo: {
                role: 'harvester',
                energySource: 'sourceTop'
            }
        },

        harvesterBottom: {
            minimum: 1,
            body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
            memo: {
                role: 'harvester',
                energySource: 'sourceBottom'
            }
        },

        mover: {
            minimum: 1,
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            memo: {role: 'mover'}
        },

        transfer1: {
            minimum: 2,
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            memo: {
                role: 'transfer',
                fromStructures: 'containersBottom',
                toStructures: 'containersTop',
            }
        }
    };

    return {
        createCreep: function(groupName, spawn) {
            var group = groups[groupName];

            var memo = group.memo;
            memo.group = groupName;

            if(spawn.canCreateCreep(group.body) == OK) {
                var newCreepName = spawn.createCreep(group.body, null, memo);
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

            Object.keys(groups).forEach(function(groupName) {
                var group = groups[groupName];

                if((counts[groupName] || 0) < group.minimum) {
                    module.exports.createCreep(groupName, spawn);

                }
            });
        }
    }
})();