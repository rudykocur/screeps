const profiler = require('./profiler-impl');

require('prototype.Room');
require('prototype.RoomPosition');

const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');
const config = require('config');
const logger = require('logger');
const spawnQueue = require('spawnQueue');

const gang = require('gang');
const combatAction = require('combatAction');
const roomHanders = require('room.handlers');

var roleTower = require('role.tower');

var taskModules = [
    require('task.withdrawFromStorage'),
    require('task.upgradeController'),
    require('task.move'),
    require('task.harvest'),
];

var roleModules = {
    'harvester-pure': require('role.harvester-pure'),
    harvester: require('role.harvester-pure'),
    mineralHarvester: require('role.harvester-pure'),
    upgrader: require('role.upgrader'),
    mover: require('role.mover'),
    builder: require('role.builder'),
    brawler: require('role.brawler'),
    lairDefender: require('role.lairDefender'),
    transfer: require('role.transfer'),
    collector: require('role.collector'),
    claimer: require('role.claimer'),
    settler: require('role.settler'),
    scout: require('role.scout'),
    combatTank: require('role.combatTank'),
    combatHealer: require('role.combatHealer'),
    none: {run: function() {}},
};

profiler.enable();

module.exports = (function() {

    function getStructures(type) {
        return _.filter(_.values(Game.structures), s => s.structureType == type);
    }

    return {
        loop: function() {
            profiler.wrap(function() {
                module.exports.runLoop();
            });

            // if(profiler.print) {
            //     profiler.print();
            // }
            // module.exports.runLoop();
        },

        runLoop: function () {
            Game.stat = printDiagnostics;
            Game.killBrot = killBrot;

            gang.extendGame();
            combatAction.extendGame();

            memoryClean();

            taskModules.forEach(function(taskModule) {
                creepExt.register(taskModule.task);
            });

            spawnQueue.reset();

            Game.combatActions.processCombatActions();

            creepSpawn.autospawn(Game.spawns.Rabbithole);

            roomHanders.processRoomHandlers();

            spawnQueue.spawnCreeps();

            for (var name in Game.creeps) {
                /** @type Creep */
                var creep = Game.creeps[name];

                if(creep.spawning) {
                    continue;
                }

                try {

                    var role = creep.memory.role;

                    var task = creepExt.getTask(creep);

                    var module = roleModules[role];

                    if (module) {

                        if (module.scheduleTask) {
                            if (!task) {
                                module.scheduleTask(creep);
                            }
                        }
                        else {
                            module.run(creep);
                        }
                    }
                    else {
                        console.log("WARNING!! Creep " + creep.name + " has unknown role: " + role + "!");
                    }

                    task = creepExt.getTask(creep);
                    if (task) {
                        task.run()
                    }
                }
                catch(e) {
                    logger.error('Failure at processing creep', creep, '::', e, '::', e.stack);
                }
            }

            _.each(getStructures(STRUCTURE_TOWER), function(tower) {
                roleTower.run(tower);
            });


            Game.gangs.processGangs();
        },
    }

})();

function memoryClean() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

function printDiagnostics() {
    _.each(_.groupBy(Game.creeps, 'pos.roomName'), function(creeps, roomName) {
        //var room = Game.rooms[roomName];
        console.log(roomName + ': ' + creeps.map(c => c.name+':'+c.memory.group+':'+c.ticksToLive).join(', '));
    })
    var room = Game.spawns.Rabbithole.room;
    console.log('Spawn power: ' + _.map(Game.spawns, s => s.name + ' ' + s.room.energyAvailable + '/' + s.room.energyCapacityAvailable ).join(', '));
}

function killBrot() {
    var gangs = {
        fighters: [
            {
                count: 2,
                body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]            }
        ]
    };

    var orders = [
        {
            fighters: {
                action: 'move',
                target: 'w1'
            }
        },

        {
            fighters: {
                action: 'attack',
                range: 0,
                target: 'w2',
            },
        },
        {
            fighters: {
                action: 'attack',
                range: 0,
                target: 'w3',
            },
        },
        {
            fighters: {
                action: 'attack',
                range: 0,
                target: 'w4',
            },
        },
    ];

    var action = Game.combatActions.get('killBrot');
    // action.spawnGangs(Game.spawns.Moria, moriaGangs);
    action.spawnGangs(Room.byCustomName('home'), gangs);
    action.addOrders(orders);

    logger.log(logger.fmt.orange("Combat action killBrot started"));
}
