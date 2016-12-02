const creepSpawn = require('creepSpawn');
const creepGang = require('gang');

module.exports = (function() {

    class CombatAction {
        constructor(name, state) {
            this.name = name;
            this.state = state;

            _.defaults(this.state, {
                spawnQueue: [],
                spawningCreeps: [],
                orders: [],
                workingGangs: {},
            });
        }

        debug(...messages) {
            console.log.apply(console.log, ['CombatAction', this.name].concat(messages));
        }

        /**
         *
         * @param {StructureSpawn} spawn
         * @param data
         */
        spawnGangs(spawn, data) {
            _.each(data, (groups, gangName) => {

                groups.forEach(group => {
                    for(var i = 0; i < group.count; i++) {
                        this.state.spawnQueue.push({
                            body: group.body,
                            memo: {role: 'none'},
                            gang: gangName,
                            name: 'ca_'+this.name+'_'+gangName+'_',
                            spawnName: spawn.name,
                        })
                    }
                })
            })
        }

        addOrders(orders) {
            this.state.orders = orders;
        }

        process() {
            if(this.processSpawnQueue()) {
                return true;
            }

            _.keys(this.state.workingGangs).forEach(gangName => {

                var gang = creepGang.getGang(gangName);

                if(gang.isOrderCompleted()) {
                    this.debug('Gang', gangName, 'finished order');
                    delete this.state.workingGangs[gangName];
                }
            });

            if(_.keys(this.state.workingGangs).length == 0) {

                if(this.state.orders.length == 0) {
                    // console.log('All combat orders completed. Have a nice day!');
                    return;
                }

                console.log('All orders completed. Scheduling next step');
                var step = this.state.orders[0];
                this.state.orders.splice(0, 1);

                _.each(step, (order, gangName) => {
                    var gang = creepGang.getGang(gangName);
                    gang.setOrder(order);
                    this.state.workingGangs[gangName] = true;
                });
            }
        }

        processSpawnQueue() {
            var queue = this.state.spawnQueue;

            if(this.state.spawningCreeps.length > 0) {
                var spawningData = this.state.spawningCreeps[0];
                var creep = Game.creeps[spawningData.name];
                if(creep.id) {
                    var g = creepGang.getGang(spawningData.gang);
                    g.addCreep(creep);
                    this.state.spawningCreeps.splice(0, 1);
                }
            }

            if(queue.length > 0) {
                var toSpawn = queue[0];
                var spawn = Game.spawns[toSpawn.spawnName];

                var newCreep = creepSpawn.createCreep(spawn, toSpawn.name, toSpawn.body, toSpawn.memo);

                if(newCreep) {
                    queue.splice(0, 1);
                    this.state.spawningCreeps.push({name: newCreep, gang: toSpawn.gang});
                    var g = creepGang.getGang(toSpawn.gang); // just to create gang in memory
                    // g.addCreep(newCreep);
                }

                // return true;
            }
        }
    }

    return {
        extendGame: function() {
            Game.combatActions = module.exports;
        },

        processCombatActions: function() {
            try {
                for (var name in Memory.combatActions) {
                    var action = module.exports.get(name);
                    action.process();
                }
            }
            catch(e) {
                console.log('Failed to process combat actions:', e, '::', e.stack);
            }
        },

        get: function(name) {
            Memory.combatActions = Memory.combatActions|| {};
            Memory.combatActions[name] = Memory.combatActions[name] || {};

            return new CombatAction(name, Memory.combatActions[name]);
        }
    }
})();