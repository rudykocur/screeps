const creepSpawn = require('creepSpawn');
const creepExt = require('creepExt');

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

module.exports = (function() {

    return {
        loop: function () {
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
        },
    }

})();