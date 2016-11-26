var roleHarvester = require('role.harvester');
var roleHarvesterPure = require('role.harvester-pure');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMover = require('role.mover');
const roleRepairer = require('role.repairer');
var actionFill = require('action.creepFill');

module.exports = (function() {
    var roleToAction = {
        harvester: roleHarvester,
        'harvester-pure': roleHarvesterPure,
        upgrader: roleUpgrader,
        mover: roleMover,
        builder: roleBuilder,
        repairer: roleRepairer,
        none: {run: function() {}},
    };

    return {
        loop: function () {

            if (!Game.diagnostics) {
                Game.stat = printDiagnostics;
            }
            memoryClean();

            actionFill.doAction(Game.spawns.Rabbithole);

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


