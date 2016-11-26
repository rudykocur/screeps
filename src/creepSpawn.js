module.exports = (function() {

    var objects = {
        sourceTop: '57ef9ddd86f108ae6e60e6db',
        sourceBottom: '57ef9ddd86f108ae6e60e6dd',
        containerBottom: '5839a2e6cd1628ec268459e9',
        containersTop: ['5839703ced37cf7c5fae4cff', '583958840ea1511330966adc'],
        containersBottom: ['5839a2e6cd1628ec268459e9', '5839b19c8b3919d7655e0661'],
    };

    var groups = {
        builder: {
            minimum: 2,
            body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'builder'}
        },

        upgrader: {
            minimum: 2,
            body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'upgrader', fromStructures: objects.containersTop}
        },

        harvester: {
            minimum: 2,
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
            memo: {role: 'harvester-pure', energySource: objects.sourceTop}
        },

        harvesterBottom: {
            minimum: 1,
            body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'harvester-pure', energySource: objects.sourceBottom}
        },

        mover: {
            minimum: 1,
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
            memo: {role: 'mover'}
        },

        transfer1: {
            minimum: 2,
            body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            memo: {
                role: 'transfer',
                fromStructures: objects.containersBottom,
                toStructures: objects.containersTop,
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