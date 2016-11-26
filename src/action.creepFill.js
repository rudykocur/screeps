module.exports = {
    doAction:  function(spawn) {
        var room = spawn.room;

        var rolesMin = {
            builder: 1,
            upgrader: 0,
            repairer: 0,
            mover: 1,
            'harvester-pure': 2,
            harvester: 0
        };
        
        var rolesFactory = {
            builder: function(spawn, role) {
                spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                    role: role
                })
            },
            repairer: function(spawn, role) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {
                    role: role
                })
            },
            upgrader: function(spawn, role) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                    role: role,
                    energySource: '57ef9ddd86f108ae6e60e6dd'
                })
            },
            harvester: function(spawn, role) {
                spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: role})
            },
            'harvester-pure': function(spawn, role) {
                spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {
                    role: role,
                    energySource: '57ef9ddd86f108ae6e60e6db'
                })
            },
            mover: function(spawn, role) {
                spawn.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: role})
            }
        };

        var currentRolesCount = {
            builder: 0,
            upgrader: 0,
            repairer: 0,
            mover: 0,
            'harvester-pure': 0,
            harvester: 0
        };

        Object.keys(Game.creeps).forEach(function (creepName) {
            var creep = Game.creeps[creepName];
            currentRolesCount[creep.memory.role] += 1;
        });

        Object.keys(rolesMin).forEach(function(role) {
            if(currentRolesCount[role] < rolesMin[role]) {
                console.log("Spawning creep " + role);

                rolesFactory[role](spawn, role);
            }
        })
    }
}