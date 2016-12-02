module.exports = (function() {

    class GangManager {
        constructor(name, state) {
            this.name = name;
            this.state = state;

            _.defaults(this.state, {members: []});
        }

        addCreep(creep) {
            if(typeof creep == "string") {
                creep = Game.creeps[creep];
            }

            this.state.members.push(creep.id);
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

                if(creep.bodypartHpLeft(TOUGH) < 0.8) {
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

        setMoveTarget(target) {
            if(target.pos) {
                this.state.moveTarget = target.pos;
            }
            else if(target.x && target.y) {
                this.state.moveTarget = {x: target.x, y: target.y}
            }
        }

        getMoveTarget() {
            var target = this.state.moveTarget;

            if(target) {
                return new RoomPosition(target.x, target.y, target.roomName);
            }
        }

        process() {

            var creeps = this.getCreeps();

            var healers = this.getByType(creeps, HEAL);
            var toHeal = this.getCreepToHeal(creeps);

            if(toHeal) {
                // this.debug('will heal', toHeal, 'with', healers);

                healers.forEach(h => this.tryHealCreep(toHeal, h));
                return;
            }

            var target = this.getMoveTarget();

            if(target) {
                creeps.forEach(c => {
                    var x = c.moveTo(target);
                });
            }

            healers.forEach(h => this.tryHealAround(h, creeps));
        }
    }

    return {
        extendGame: function() {
            Game.gangs = module.exports;
        },

        processGangs: function() {
            for(var name in Memory.gangs) {
                var gang = module.exports.getGang(name);
                gang.process();
            }
        },

        getGang: function(name) {
            Memory.gangs = Memory.gangs || {};
            Memory.gangs[name] = Memory.gangs[name] || {};

            return new GangManager(name, Memory.gangs[name]);
        }
    }
})();