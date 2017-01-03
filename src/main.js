var _ = require("lodash");
var profiler = require('./profiler-impl');
var stats = require('./stats');
var cache = require('./cache');

require('./prototype.Room');
require('./prototype.RoomPosition');

var creepSpawn = require('./creepSpawn');
var creepExt = require('./creepExt');
var config = require('./config');
var logger = require('./logger');
var spawnQueue = require('./spawnQueue');

var gang = require('./gang');
var combatAction = require('./combatAction');
var roomHanders = require('./room.handlers');

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

global.p = (...args) => {console.log.apply(console, args)};

// profiler.enable();

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

            var timer = {
                begin: Game.cpu.getUsed(),
                init: null,
                combatActions: null,
                rooms: null,
                spawn: null,
                creeps: null,
                towers: null,
                gangs: null,
                end: null,
            };

            Memory; // to kick in memory loading process

            Game.stat = printDiagnostics;
            Game.killBrot = killBrot;
            Game.killDragon2 = killDragoon2;
            Game.testPath = testPath;
            Game.cleanPath = cleanPath;

            gang.extendGame();
            combatAction.extendGame();

            memoryClean();
            stats.manageRegisters();
            cache.pruneCache();

            taskModules.forEach(function(taskModule) {
                creepExt.register(taskModule.task);
            });

            spawnQueue.reset();

            timer.init = Game.cpu.getUsed();

            Game.combatActions.processCombatActions();

            timer.combatActions = Game.cpu.getUsed();

            creepSpawn.autospawn(Game.spawns.Rabbithole);

            roomHanders.processRoomHandlers();

            timer.rooms = Game.cpu.getUsed();

            spawnQueue.spawnCreeps();

            timer.spawn = Game.cpu.getUsed();

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

            timer.creeps = Game.cpu.getUsed();

            _.each(getStructures(STRUCTURE_TOWER), function(tower) {
                roleTower.run(tower);
            });

            timer.towers = Game.cpu.getUsed();

            Game.gangs.processGangs();

            timer.gangs = Game.cpu.getUsed();

            timer.end = Game.cpu.getUsed();

            stats.registerCpuTick(timer);
        },
    }

})();

profiler.registerObject(module.exports, 'main');

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
        if(!room) {
            console.log(config.roomNames[roomName], '::  no access');
            return;
        }

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
                count: 3,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                    HEAL,HEAL,HEAL,HEAL,HEAL]
            }
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
        // {
        //     fighters: {
        //         action: 'attack',
        //         range: 0,
        //         target: 'w4',
        //     },
        // },
    ];

    var action = Game.combatActions.get('dragoon1');
    // action.spawnGangs(Game.spawns.Moria, moriaGangs);
    action.spawnGangs(Room.byCustomName('moria'), gangs);
    action.addOrders(orders);

    logger.log(logger.fmt.orange("Combat action dragoon1 started"));
}

function killDragoon2() {
    var gangsHome = {
        fighters2: [
            {
                count: 3,
                body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
            }
        ],
    };

    var gangsMoria = {
        fighters3: [
            {
                count: 3,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
            }
        ]
    };

    var orders = [
        {
            fighters2: {
                action: 'move',
                target: 'w1'
            },
            fighters3: {
                action: 'move',
                target: 'w11'
            }
        },

        {
            fighters2: {
                action: 'attack',
                range: 0,
                target: 'w3',
            },
            fighters3: {
                action: 'attack',
                range: 0,
                target: 'w3',
            },
        },
        // {
        //     fighters: {
        //         action: 'attack',
        //         range: 0,
        //         target: 'w3',
        //     },
        // },
        // {
        //     fighters: {
        //         action: 'attack',
        //         range: 0,
        //         target: 'w4',
        //     },
        // },
    ];

    var action = Game.combatActions.get('dragoon2');
    // action.spawnGangs(Game.spawns.Moria, moriaGangs);
    action.spawnGangs(Room.byCustomName('home'), gangsHome);
    action.spawnGangs(Room.byCustomName('moria'), gangsMoria);
    action.addOrders(orders);

    logger.log(logger.fmt.orange("Combat action dragoon2 started"));
}


function testPath() {
    var src = Game.getObjectById('57ef9ed286f108ae6e60ffee');
    var dst = Game.flags.holyGrail;

    cleanPath();

    var flagsByRoom = _.groupBy(Game.flags, 'pos.roomName');

    var blockRange = 6;


    // var flags = flagsByRoom['E66N45'] || [];
    // var keeperFlags = flags.filter(f => f.color == COLOR_RED && f.secondaryColor == COLOR_ORANGE);
    // keeperFlags.forEach(/**Flag*/flag => {
    //     // let pos = RoomPosition.fromDict(coord);
    //
    //     for (let i = blockRange * -1; i <= blockRange; i++) {
    //         for (let j = blockRange * -1; j <= blockRange; j++) {
    //             let pos = new RoomPosition(flag.pos.x + i, flag.pos.y + j, 'E66N45');
    //             // matrix.set(flag.pos.x + i, flag.pos.y + j, 255);
    //             let name = `fff-block-${pos.roomName}-${pos.x}-${pos.y}`;
    //             pos.createFlag(name, COLOR_CYAN, COLOR_RED);
    //         }
    //     }
    // });


    let t1 = Game.cpu.getUsed();
    var path = PathFinder.search(src.pos, dst.pos, {
        maxOps: 20000,
        roomCallback: function(roomName) {
            var flags = flagsByRoom[roomName] || [];

            var keeperFlags = flags.filter(f => f.color == COLOR_RED && f.secondaryColor == COLOR_ORANGE);

            var matrix = new PathFinder.CostMatrix();

            console.log('Got keeper flags in room', roomName, '::', keeperFlags.length);

            keeperFlags.forEach(/**Flag*/flag => {
                for(let i = blockRange*-1; i <= blockRange; i++) {
                    for(let j = blockRange*-1; j <= blockRange; j++) {
                        matrix.set(flag.pos.x + i, flag.pos.y + j, 255);
                    }
                }
            });

            return matrix;
        }
    });
    let t2 = Game.cpu.getUsed();




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

        let name = `fff-${coord.roomName}-${coord.x}-${coord.y}`;

        if(!Game.rooms[coord.roomName]) {
            return;
        }
        let pos = RoomPosition.fromDict(coord);

        pos.createFlag(name, COLOR_CYAN, COLOR_WHITE);
    });

    console.log('OMG PATH', path.path.length, '::', path.incomplete, '::', t2-t1);
}

function cleanPath() {
    _.each(Game.flags, /**Flag*/f => {
        if(f.color == COLOR_CYAN && (f.secondaryColor == COLOR_WHITE || f.secondaryColor == COLOR_RED)) {
            f.remove();
        }
    })
}