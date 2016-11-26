var roleHarvesterPure = require('role.harvester-pure');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMover = require('role.mover');
const roleTransfer = require('role.transfer');
const roleTower = require('role.tower');
var creepSpawn = require('creepSpawn');

module.exports = (function() {
    var roleToAction = {
        'harvester-pure': roleHarvesterPure,
        harvester: roleHarvesterPure,
        upgrader: roleUpgrader,
        mover: roleMover,
        builder: roleBuilder,
        transfer: roleTransfer,
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

            creepSpawn.autospawn(Game.spawns.Rabbithole);

            for (var name in Game.creeps) {
                var creep = Game.creeps[name];

                var role = creep.memory.role;

                if(roleToAction[role]) {
                    roleToAction[role].run(creep);
                }
                else {
                    console.log("WARNING!! Creep " + creep.name + " has unknown role: "+role+"!");
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


