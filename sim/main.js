
module.exports = {
    loop: function () {

        if (!Game.diagnostics) {
            Game.diagnostics = printDiagnostics;
        }
        memoryClean();

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
    // var room = Game.rooms.E17S66;
    // console.log('Power: ' + room.energyAvailable + '/' + room.energyCapacityAvailable);
    console.log(Object.keys(Game.creeps).map(cn => cn+':'+Game.creeps[cn].memory.role+':'+Game.creeps[cn].ticksToLive+' '));
}


