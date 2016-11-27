var roleHarvesterPure = require('role.harvester-pure');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMover = require('role.mover');
const roleTransfer = require('role.transfer');
const roleTower = require('role.tower');
const roleSettler = require('role.settler');
const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');

const taskWithdrawStorage = require('task.withdrawFromStorage');
const taskUpgrade = require('task.upgradeController');

module.exports = (function() {
    var roleToAction = {
        'harvester-pure': roleHarvesterPure,
        harvester: roleHarvesterPure,
        upgrader: roleUpgrader,
        mover: roleMover,
        builder: roleBuilder,
        transfer: roleTransfer,
        settler: roleSettler,
        none: {run: function() {}},
    };

    function getStructures(type) {
        return _.filter(_.values(Game.structures), s => s.structureType == type);
    }

    return {
        loop: function () {

            if (!Game.diagnostics) {
                Game.stat = printDiagnostics;
            }
            memoryClean();

            // Memory.rooms = ['E17S66', 'E17S66'];

            creepExt.register(taskWithdrawStorage.task);
            creepExt.register(taskUpgrade.task);

            if(Game.spawns.Rabbithole) {
                creepSpawn.autospawn(Game.spawns.Rabbithole);
            }

            for (var name in Game.creeps) {
                var creep = Game.creeps[name];

                var role = creep.memory.role;

                if(roleToAction[role]) {
                    if(roleToAction[role].scheduleTask) {
                        roleToAction[role].scheduleTask(creep);
                    }
                    else {
                        roleToAction[role].run(creep);
                    }
                }
                else {
                    console.log("WARNING!! Creep " + creep.name + " has unknown role: "+role+"!");
                }

                var task = creepExt.getTask(creep);
                if(task) {
                    task.run()
                }
            }

            _.each(getStructures(STRUCTURE_TOWER), function(tower) {
                roleTower.run(tower);
            })
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


