const _ = require("lodash");
const profiler = require('./profiler-impl');

require('./prototype.Room');
require('./prototype.RoomPosition');

const creepSpawn = require('./creepSpawn');
const creepExt = require('./creepExt');
const config = require('./config');
const logger = require('./logger');
const spawnQueue = require('./spawnQueue');

const gang = require('./gang');
const combatAction = require('./combatAction');
const roomHanders = require('./room.handlers');

var roleTower = require('./role.tower');

var taskModules = [
    require('./task.withdrawFromStorage'),
    require('./task.upgradeController'),
    require('./task.move'),
    require('./task.harvest'),
];

var roleModules = {
    harvester: require('./role.harvester-pure'),
    mineralHarvester: require('./role.harvester-pure'),
    upgrader: require('./role.upgrader'),
    mover: require('./role.mover'),
    builder: require('./role.builder'),
    brawler: require('./role.brawler'),
    lairDefender: require('./role.lairDefender'),
    transfer: require('./role.transfer'),
    collector: require('./role.collector'),
    claimer: require('./role.claimer'),
    settler: require('./role.settler'),
    scout: require('./role.scout'),
    combatTank: require('./role.combatTank'),
    combatHealer: require('./role.combatHealer'),
    none: {run: function() {}},
};

profiler.enable();

profiler.registerClass(Game, 'Game');

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
            Game.testPath = testPath;
            Game.cleanPath = cleanPath;

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
    var creepsByRoom = _.groupBy(Game.creeps, 'memory.room');

    _.each(_.sortBy(_.keys(creepsByRoom)), roomName => {
        var creeps = creepsByRoom[roomName];
        var room = Game.rooms[roomName];

        var creepsByRole = _.groupBy(creeps, 'memory.role');

        var sources = room.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});
        var total = _.sum(sources.map(s => s.amount));

        if(total < 3000) {
            total = logger.fmt.green(total);
        }
        else if(total < 5000) {
            total = logger.fmt.orange(total);
        }
        else {
            total = logger.fmt.red(total);
        }

        let roles = _.map(_.sortBy(_.keys(creepsByRole)), (roleName) => roleName + ': ' + creepsByRole[roleName].length);

        console.log(Game.rooms[roomName].customName + ': ' + roles.join(', ') + '; Resources on ground: ' + total);
    });

    var spawnsByRoom = _.groupBy(Game.spawns, 'room.name');

    console.log('Power: ' + _.map(_.keys(spawnsByRoom), r => {
            var room = Game.rooms[r];
            return `${room.customName} ${room.energyAvailable}/${room.energyCapacityAvailable}`;
        }).join(', '));
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


function testPath() {
    var src = Game.getObjectById('57ef9ebe86f108ae6e60fd81');
    var dst = Game.flags.holyGrail;

    var flagsByRoom = _.groupBy(Game.flags, 'pos.roomName');

    var blockRange = 5;

    var path = PathFinder.search(src.pos, dst.pos, {
        maxOps: 20000,
        roomCallback: function(roomName) {
            var flags = flagsByRoom[roomName] || [];

            console.log('Got flags in room', roomName, '::', flags.length);

            var keeperFlags = flags.filter(f => f.color == COLOR_RED && f.secondaryColor == COLOR_ORANGE);

            var matrix = new PathFinder.CostMatrix();

            keeperFlags.forEach(/**Flag*/flag => {
                for(let i = blockRange*-1; i <= blockRange; i++) {
                    for(let j = blockRange*-1; j <= blockRange; j++) {
                        matrix.set(flag.pos.x + i, flag.pos.y + j, 255);
                    }
                }
            })
        }
    });

    let lastRoom = path.path[0].roomName;
    let points = [];

    path.path.forEach(coord => {
        let room = coord.roomName;

        if(room != lastRoom) {
            console.log(points.join(', '));
            console.log('Then go to room', room);
            points = [];
        }

        lastRoom = room;

        points.push(`${coord.x}-${coord.y}`);
        // let name = `fff-${coord.roomName}-${coord.x}-${coord.y}`;
        //
        // if(!Game.rooms[coord.roomName]) {
        //     return;
        // }
        // let pos = RoomPosition.fromDict(coord);
        //
        // pos.createFlag(name, COLOR_CYAN, COLOR_WHITE);
    });

    console.log('OMG PATH', path.path.length, '::', path.incomplete);
}

function cleanPath() {
    _.each(Game.flags, /**Flag*/f => {
        if(f.color == COLOR_CYAN && f.secondaryColor == COLOR_WHITE) {
            f.remove();
        }
    })
}