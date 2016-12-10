const actionCombat = require('action.combat');

module.exports = (function() {

    class GangManager {
        constructor(name, state) {
            this.name = name;
            this.state = state;

            _.defaults(this.state, {members: [], order: null});
        }

        addCreep(creep) {
            if(typeof creep == "string") {
                creep = Game.creeps[creep];
            }

            this.state.members.push(creep.id);

            return creep;
        }

        debug(...messages) {
            console.log.apply(console.log, ['Gang', this.name].concat(messages));
        }

        disband() {
            this.debug('disbanded. Bye!');
            delete Memory.gangs[this.name];
        }

        getCreeps() {
            var alive = this.state.members.filter(c => Game.getObjectById(c));

            this.state.members = alive;

            return alive.map(c => Game.getObjectById(c));
        }

        getCreepToHeal(creeps) {
            var mostDamaged = _.sortBy(creeps, c => c.bodypartHpLeft(TOUGH));

            if(mostDamaged.length > 0) {
                var creep = mostDamaged[0];

                if(creep.bodypartHpLeft(TOUGH) < 0.4) {
                    return creep;
                }
            }
        }

        getByType(creeps, type) {
            return creeps.filter(c => c.getActiveBodyparts(type) > 0);
        }

        /**
         * @param wounded
         * @param {Creep} healer
         */
        tryHealCreep(wounded, healer) {
            healer.heal(wounded);

            if(!healer.pos.isNearTo(wounded)) {
                var direction = healer.pos.getDirectionTo(wounded);
                healer.move(direction);
            }
        }

        tryHealAround(healer, gangCreeps) {
            var around = _.sortBy(healer.pos.findInRange(gangCreeps, 3), c => c.bodypartHpLeft(TOUGH));

            if(around.length > 0) {
                healer.rangedHeal(around[0]);
            }
        }

        isOrderCompleted() {
            var order = this.state.order;
            if(!order) {
                return true;
            }

            var creeps = this.getCreeps();

            if(creeps.length < 1) {
                return false;
            }

            var target;
            if(order.action == 'move') {
                target = Game.flags[order.target];
                if(!target.room) {
                    return false;
                }

                var inRange = target.pos.findInRange(creeps, 1);

                return inRange.length == creeps.length;
            }

            if(order.action == 'attack') {
                var point = Game.flags[order.target];

                if(!point.room) {
                    return false;
                }

                target = actionCombat.findTargetInRange(point, order.range || 1);

                return !target;
            }

            this.debug('check for unknown order', order.type);
            return true;
        }

        setOrder(orderData) {
            this.state.order = orderData;
        }

        process() {

            var creeps = this.getCreeps();

            var healers = this.getByType(creeps, HEAL);
            var toHeal = this.getCreepToHeal(creeps);

            if(toHeal) {
                healers.forEach(h => this.tryHealCreep(toHeal, h));
                return;
            }

            var target;
            var order = this.state.order;

            if(order) {
                if (order.action == 'move') {
                    target = Game.flags[order.target];

                    if (target) {
                        creeps.forEach(c => {
                            var x = c.moveTo(target);
                        });
                    }
                }

                if (order.action == 'attack') {
                    var point = Game.flags[order.target];
                    if(!point.room) {
                        creeps.forEach(c => {
                            c.moveTo(point);
                        });

                        return false;
                    }

                    target = actionCombat.findTargetInRange(point, order.range || 1);

                    if (target) {
                        creeps.forEach(c => {
                            if (c.attack(target) == ERR_NOT_IN_RANGE) {
                                c.moveTo(target);
                            }
                        });
                    }
                }
            }

            healers.forEach(h => this.tryHealAround(h, creeps));
        }
    }

    return {
        extendGame: function() {
            Game.gangs = module.exports;
        },

        processGangs: function() {
            try {
                for (var name in Memory.gangs) {
                    var gang = module.exports.getGang(name);
                    gang.process();
                }
            }
            catch(e) {
                console.log('Failed to process gangs', e, '::', e.stack);
            }
        },

        getGang: function(name) {
            Memory.gangs = Memory.gangs || {};
            Memory.gangs[name] = Memory.gangs[name] || {};

            return new GangManager(name, Memory.gangs[name]);
        }
    }
})();