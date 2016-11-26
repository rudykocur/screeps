module.exports = {
    doAction:  function(spawn) {
        var room = spawn.room;

        var rolesMin = {
            builder: 1,
            upgrader: 2,
            repairer: 0,
            harvester: 2
        };
        
        var rolesFactory = {
            builder: function(spawn) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {
                    role: 'builder'
                })
            },
            repairer: function(spawn) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {
                    role: 'repairer'
                })
            },
            upgrader: function(spawn) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                    role: 'upgrader',
                    energySource: '57ef9ddd86f108ae6e60e6dd'
                })
            },
            harvester: function(spawn) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: 'harvester'})
            },
        };

        var currentRolesCount = {
            builder: 0,
            upgrader: 0,
            repairer: 0,
            harvester: 0
        };

        Object.keys(Game.creeps).forEach(function (creepName) {
            var creep = Game.creeps[creepName];
            currentRolesCount[creep.memory.role] += 1;
        });

        Object.keys(rolesMin).forEach(function(role) {
            if(currentRolesCount[role] < rolesMin[role]) {
                console.log("Spawning creep " + role);

                rolesFactory[role](spawn);
            }
        })
    }
}