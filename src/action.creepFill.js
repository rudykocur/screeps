module.exports = (function() {
    var groups = {
        builder: {
            minimum: 2,
            body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'builder'}
        },

        upgrader: {
            minimum: 2,
            body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'upgrader', energySource: '57ef9ddd86f108ae6e60e6dd'}
        },

        harvester: {
            minimum: 2,
            body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
            memo: {role: 'harvester-pure', energySource: '57ef9ddd86f108ae6e60e6db'}
        },

        mover: {
            minimum: 1,
            body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            memo: {role: 'mover'}
        },
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
            else {
                logWarning('Not enough energy for creep tye: ' + groupName);
            }
        },

        /**
         * @param {StructureSpawn} spawn
         */
        doAction:  function(spawn) {
            var room = spawn.room;

            var logWarning = _.throttle(function(msg) {console.log(msg)}, 10000);

            var counts = {};

            Object.keys(Game.creeps).forEach(function (creepName) {
                var creep = Game.creeps[creepName];
                counts[creep.memory.group] = (counts[creep.memory.group] || 0) + 1;
            });

            Object.keys(groups).forEach(function(groupName) {
                var group = groups[groupName];

                if(counts[groupName] < group.minimum) {
                    module.exports.createCreep(groupName, spawn);

                }
            });
        }
    }
})();