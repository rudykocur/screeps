const profiler = require('screeps-profiler');

var roleHarvesterPure = require('role.harvester-pure');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMover = require('role.mover');
const roleTransfer = require('role.transfer');
const roleTower = require('role.tower');
const roleSettler = require('role.settler');
const roleCollector = require('role.collector');
const roleBrawler = require('role.brawler');
const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');

const taskWithdrawStorage = require('task.withdrawFromStorage');
const taskUpgrade = require('task.upgradeController');
const taskMove = require('task.move');
const taskHarvest = require('task.harvest');

var taskModules = [
    require('task.withdrawFromStorage'),
    require('task.upgradeController'),
    require('task.move'),
    require('task.harvest'),
];

var roomHandlers = {
    outpost: require('room.outpost')
};

// profiler.enable();

module.exports = (function() {
    var roleToAction = {
        'harvester-pure': roleHarvesterPure,
        harvester: roleHarvesterPure,
        upgrader: roleUpgrader,
        mover: roleMover,
        builder: roleBuilder,
        brawler: roleBrawler,
        transfer: roleTransfer,
        collector: roleCollector,
        settler: roleSettler,
        none: {run: function() {}},
    };

    function getStructures(type) {
        return _.filter(_.values(Game.structures), s => s.structureType == type);
    }

    function runDefence() {

        _.each(Game.rooms, /** @param {Room} room */ function(room) {
            if(Game.time % 20 == 0) {
                var aggresive = false;
                var hostiles = room.find(FIND_HOSTILE_CREEPS);

                for(var i = 0; i < hostiles.length; i++) {
                    /** @type Creep */
                    var hostile = hostiles[i];

                    aggresive = _.any(hostile.body, p => _.contains([ATTACK, RANGED_ATTACK, CLAIM], p.type));

                    if(aggresive) {
                        if(!room.controller.safeMode) {
                            Game.notify("Activated safe mode in room " + room);
                            //room.controller.activateSafeMode();
                            break;
                        }
                    }
                }
            }
        });
    }

    return {
        loop: function() {
            // profiler.wrap(function() {
            //     module.exports.runLoop();
            // });
            module.exports.runLoop();
        },

        runLoop: function () {

            Game.stat = printDiagnostics;

            memoryClean();
            runDefence();

            taskModules.forEach(function(taskModule) {
                creepExt.register(taskModule.task);
            });

            creepSpawn.autospawn(Game.spawns.Rabbithole);

            try {
                _.each(Memory.roomHandlers || {}, function (handlerData, roomName) {

                    var clz = roomHandlers[handlerData.type].handler;
                    var handler = new clz(roomName, handlerData);

                    handler.process();
                });
            }
            catch(e) {
                console.log('Failure at processing rooms', e);
            }

            for (var name in Game.creeps) {
                /** @type Creep */
                var creep = Game.creeps[name];

                if(creep.spawning) {
                    continue;
                }

                var role = creep.memory.role;

                var task = creepExt.getTask(creep);

                if(roleToAction[role]) {

                    if(roleToAction[role].scheduleTask) {
                        if(!task) {
                            roleToAction[role].scheduleTask(creep);
                        }
                    }
                    else {
                        roleToAction[role].run(creep);
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

            _.each(getStructures(STRUCTURE_TOWER), function(tower) {
                roleTower.run(tower);
            });
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
    var room = Game.spawns.Rabbithole.room;
    console.log('Power: ' + room.energyAvailable + '/' + room.energyCapacityAvailable);
    console.log(Object.keys(Game.creeps).map(cn => cn+':'+Game.creeps[cn].memory.group+':'+Game.creeps[cn].ticksToLive+' '));
}
