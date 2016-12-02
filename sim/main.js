const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');

const gang = require('gang');
const combatAction = require('combatAction');

var taskModules = [
    require('task.withdrawFromStorage'),
    require('task.upgradeController'),
    require('task.move'),
    require('task.harvest'),
];

var roleModules = {
    'harvester-pure': require('role.harvester-pure'),
    harvester: require('role.harvester-pure'),
    upgrader: require('role.upgrader'),
    mover: require('role.mover'),
    builder: require('role.builder'),
    brawler: require('role.brawler'),
    transfer: require('role.transfer'),
    collector: require('role.collector'),
    settler: require('role.settler'),
    combatTank: require('role.combatTank'),
    combatHealer: require('role.combatHealer'),
    none: {run: function() {}},
}

module.exports = (function() {

    return {
        loop: function () {

            Game.foo = foo;

            gang.extendGame();
            combatAction.extendGame();

            creepSpawn.reset();

            Game.combatActions.processCombatActions();

            for (var name in Game.creeps) {
                /** @type Creep */
                var creep = Game.creeps[name];

                if(creep.spawning) {
                    continue;
                }

                var role = creep.memory.role;

                var task = creepExt.getTask(creep);

                var module = roleModules[role];

                if(module) {

                    if(module.scheduleTask) {
                        if(!task) {
                            module.scheduleTask(creep);
                        }
                    }
                    else {
                        module.run(creep);
                    }
                }
                else {
                    console.log("WARNING!! Creep " + creep.name + " has unknown role: "+role+"!");
                }

                task = creepExt.getTask(creep);
                if(task) {
                    task.run()
                }
            }

            Game.gangs.processGangs();
        },
    }

})();

function foo() {
    var gangs = {
        gang1: [
            {
                body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL],
                // count: 1,
                count: 3,
            },
        ],

        gang2: [
            {
                body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK],
                count: 2
            },
            {
                body: [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK,
                    HEAL, HEAL, HEAL],
                count: 1
            },
        ]
    };

    var orders = [
        {
            gang1: {
                action: 'move',
                target: 't1',
            },
            gang2: {
                action: 'move',
                target: 't2'
            }
        },

        {
            gang1: {
                action: 'move',
                target: 't3'
            }
        },

        {
            gang2: {
                action: 'attack',
                range: 5,
                target: 't4',
            }
        }
    ]

    var action = Game.combatActions.get('action1');
    action.spawnGangs(Game.spawns.Spawn1, gangs);
    action.addOrders(orders);
}