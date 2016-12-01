const profiler = require('screeps-profiler');

const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');
const config = require('config');

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

var roomHandlers = {
    outpost: require('room.outpost')
};

// profiler.enable();

module.exports = (function() {

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
                            var roomSettings = config.rooms[room.name] || {};

                            if(roomSettings.panicMode) {
                                Game.notify("Activated safe mode in room " + room);
                                room.controller.activateSafeMode();
                                break;
                            }
                            else {
                                Game.notify("Enemy spotted in room " + room + '. Owner: ' + hostile.owner.username);
                            }
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

            creepSpawn.onTick(Game.spawns.Rabbithole);

            try {
                _.each(Memory.roomHandlers || {}, function (handlerData, roomName) {

                    var clz = roomHandlers[handlerData.type].handler;
                    var handler = new clz(roomName, handlerData);

                    handler.process();
                });
            }
            catch(e) {
                console.log('Failure at processing rooms', e, '::', e.stack);
            }

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
    _.each(_.groupBy(Game.creeps, 'pos.roomName'), function(creeps, roomName) {
        //var room = Game.rooms[roomName];
        console.log(roomName + ': ' + creeps.map(c => c.name+':'+c.memory.group+':'+c.ticksToLive).join(', '));
    })
    var room = Game.spawns.Rabbithole.room;
    console.log('Spawn power: ' + _.map(Game.spawns, s => s.name + ' ' + s.room.energyAvailable + '/' + s.room.energyCapacityAvailable ).join(', '));
}
