const config = require('config');
const creepSpawn = require('creepSpawn');

module.exports = (function() {
    return {
        handler: class OutpostRoomHandler {
            constructor(roomName, state) {
                this.roomName = roomName;
                this.state = state;

                this.state.collectors = this.state.collectors || [];
            }

            debug(message) {
                console.log('OutpostRoomHandler '+this.roomName+': ' + message);
            }

            process() {
                if(!this.state.sources) {
                    this.discoverSources();
                }

                if(Game.time % 10 == 0) {
                    this.checkThreats();
                }

                this.state.sources.forEach(source => {
                    this.pingMinerForSource(source);
                });

                this.pingCollectors();
            }

            discoverSources() {
                var room = Game.rooms[this.roomName];
                var sources = room.find(FIND_SOURCES);

                this.state.sources = sources.map(s => {
                    return {
                        id: s.id,
                        minerId: this.findMinerForSource(s.id)
                    }
                });
            }

            findMinerForSource(sourceId) {
                var miners = _.filter(Game.creeps, creep => creep.memory.energySourceId == sourceId);

                if(miners.length > 0) {
                    return miners[0].id;
                }

                return null;
            }

            findDefender() {
                var defenders = _.filter(Game.creeps, creep => {return creep.memory.room == this.roomName &&
                    creep.memory.role == config.blueprints.outpostMiner.role});

                if(defenders.length > 0) {
                    return defenders[0].id;
                }

                return null;
            }

            pingMinerForSource(source) {
                if(!source.minerId) {

                    var minerId = this.findMinerForSource(source.id);
                    if(minerId) {
                        source.minerId = minerId;
                        return;
                    }

                    var blueprint = config.blueprints.outpostMiner;

                    var memo = _.defaults({
                        energySourceId: source.id,
                        role: blueprint.role,
                    }, blueprint.memo);

                    this.trySpawnCreep('miner', blueprint.body, memo);
                }
                else {
                    var miner = Game.getObjectById(source.minerId);
                    if(!miner && source.minerId) {
                        this.debug('miner for source ' + source.id + ' died. Will spawn soon.');
                        source.minerId = null;
                    }
                }
            }

            pingCollectors() {
                var needed = this.state.sources.length;
                var blueprint = config.blueprints.outpostCollector;

                this.state.collectors = this.state.collectors.filter(c => {
                    var creep = Game.getObjectById(c);
                    if(!creep) {
                        // this.debug('collector died. Will spawn soon.');
                    }
                    return !!creep;
                });

                if(this.state.collectors.length < needed) {
                    this.state.collectors = _.filter(Game.creeps, c => {
                        return c.memory.room == this.roomName && c.memory.role == blueprint.role;
                    }).map(c => c.id);
                }

                if(this.state.collectors.length < needed) {
                    var memo = _.defaults({
                        room: this.roomName,
                        role: blueprint.role,
                    }, blueprint.memo);

                    this.trySpawnCreep('collector', blueprint.body, memo);
                }
            }

            checkThreats() {
                var defenderId = this.findDefender();

                if(!defenderId) {
                    var room = Game.rooms[this.roomName];

                    var creeps = room.find(FIND_HOSTILE_CREEPS, {
                        filter: c => this.hasCombatParts(c)
                    });

                    if (creeps.length > 0) {
                        var blueprint = config.blueprints.outpostDefender;

                        var memo = _.defaults({
                            room: this.roomName,
                            role: blueprint.role,
                        }, blueprint.memo);

                        this.trySpawnCreep('defender', blueprint.body, memo);
                    }
                }

                this.state.defenderId = defenderId;
            }

            static hasCombatParts(creep) {
                return creep.getActiveBodyparts(ATTACK) ||
                    creep.getActiveBodyparts(RANGED_ATTACK) ||
                    creep.getActiveBodyparts(HEAL);
            }

            homeRoom() {
                return Game.rooms[this.state.homeRoom];
            }

            trySpawnCreep(type, body, memo) {
                var spawns = this.homeRoom().find(FIND_MY_SPAWNS, {
                    filter: s => !s.spawning
                });

                if(spawns.length > 0) {
                    var spawn = spawns[0];

                    creepSpawn.createCreep(spawn, 'outpost_'+this.roomName+'_'+type+'_', body, memo);
                }
            }
        }
    }
})();