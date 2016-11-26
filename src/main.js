var roleHarvester = require('role.harvester');
var roleHarvesterPure = require('role.harvester-pure');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMover = require('role.mover');
const roleRepairer = require('role.repairer');
var actionFill = require('action.creepFill');

module.exports = {
    loop: function () {

        if (!Game.diagnostics) {
            Game.diagnostics = printDiagnostics;
        }
        memoryClean();

        actionFill.doAction(Game.spawns.Rabbithole);

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];

            var role = creep.memory.role;

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep)
            }
            else if (creep.memory.role == 'harvester-pure') {
                roleHarvesterPure.run(creep)
            }
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep)
            }
            else if (creep.memory.role == 'mover') {
                roleMover.run(creep)
            }
            else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep)
            }
            else if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep)
            }
            else if(role == 'none') {

            }
            else {
                console.log("WARNING!! Creep " + creep.name + " has unknown role: "+role+"!");
            }
        }
    },
}

function memoryClean() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

function printDiagnostics() {
    var room = Game.rooms.E17S66;
    console.log('Power: ' + room.energyAvailable + '/' + room.energyCapacityAvailable);
    console.log(Object.keys(Game.creeps).map(cn => cn+':'+Game.creeps[cn].memory.role+':'+Game.creeps[cn].ticksToLive+' '));
}


