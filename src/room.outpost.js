const config = require('config');
const logger = require('logger');
const creepSpawn = require('creepSpawn');
const roomHandlers = require('room.handlers');

const roleCollector = require('role.collector');

module.exports = (function() {
    return {
        handler: class OutpostRoomHandler extends roomHandlers.RoomHander {
            constructor(room, state, config) {
                super(room, state, config);

                this.type = 'outpost';

                this.state.collectors = this.state.collectors || [];
            }

            process() {
                super.process();

                if(!this.room) {
                    return;
                }

                if(!this.state.sources) {
                    this.discoverSources();
                }

                if(this.state.hostiles.length > 0) {
                    this.spawnDefender();
                }

                this.state.sources.forEach(source => {
                    this.pingMinerForSource(source);
                });

                this.pingCollectors();
            }

            discoverSources() {
                var sources = this.room.find(FIND_SOURCES);

                this.state.sources = sources.map(s => {
                    return {
                        id: s.id,
                        minerId: this.findMinerForSource(s.id)
                    }
                });
            }

            findMinerForSource(sourceId) {
                var miner = _.first(_.filter(Game.creeps, creep => creep.memory.energySourceId == sourceId));

                if(miner) {
                    return miner.id;
                }

                return null;
            }

            findDefender() {
                var defenders = _.filter(Game.creeps, creep => {return creep.memory.room == this.room.name &&
                    creep.memory.role == config.blueprints.outpostDefender.role});

                if(defenders.length > 0) {
                    return defenders[0].id;
                }

                return null;
            }

            /**
             * @param {Source} source
             */
            pingMinerForSource(source) {
                if(!source.minerId) {

                    var minerId = this.findMinerForSource(source.id);
                    if(minerId) {
                        source.minerId = minerId;
                        return;
                    }

                    var blueprint = config.blueprints.outpostMiner;
                    var body = blueprint.body;

                    var memo = _.defaults({
                        energySourceId: source.id,
                        role: blueprint.role,
                    }, blueprint.memo);

                    this.trySpawnCreep('miner', body, memo);
                }
                else {
                    var miner = Game.getObjectById(source.minerId);
                    if(!miner && source.minerId) {
                        this.debug('miner for source', source.id, 'died. Will spawn soon.');
                        source.minerId = null;
                    }
                }
            }

            pingCollectors() {
                var needed = this.state.sources.length;
                var blueprint = config.blueprints.outpostCollector;
                var override = blueprint.roomOverride[this.room.name] || {};

                if(typeof override['spawnAmount'] != 'undefined') {
                    // console.log('correcting needed to ', override.spawnAmount, '::', this.roomName);
                    needed = override.spawnAmount;
                }

                if(needed < 1) {
                    return;
                }


                this.state.collectors = this.state.collectors.filter(c => {
                    var creep = Game.getObjectById(c);
                    if(!creep) {
                        // this.debug('collector died. Will spawn soon.');
                    }
                    return !!creep;
                });

                if(this.state.collectors.length < needed) {
                    this.state.collectors = _.filter(Game.creeps, c => {
                        return c.memory.room == this.room.name && c.memory.role == blueprint.role;
                    }).map(c => c.id);
                }

                if(this.state.collectors.length < needed) {
                    var storage = roleCollector.findTargetContainer(this.homeRoom());

                    if(!storage) {
                        logger.mail(this.error("No storage for collector. Not spawning!"), 10);
                        return;
                    }

                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                        storageId: storage.id,
                    }, override.memo || {}, blueprint.memo);

                    this.trySpawnCreep('collector', blueprint.body, memo);
                }
            }

            spawnDefender() {
                var defenderId = this.findDefender();

                if(!defenderId) {
                    var blueprint = config.blueprints.outpostDefender;

                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    }, blueprint.memo);

                    var newDefender = this.trySpawnCreep('defender', blueprint.body, memo);

                    if(newDefender) {
                        logger.mail(this.info(logger.fmt.orange('created defender', newDefender)));
                    }
                }

                this.state.defenderId = defenderId;
            }

            homeRoom() {
                return Room.byCustomName(this.config.homeRoom);
            }

            trySpawnCreep(type, body, memo) {
                var spawns = this.homeRoom().find(FIND_MY_SPAWNS, {
                    filter: s => !s.spawning
                });

                if(spawns.length > 0) {
                    var spawn = spawns[0];

                    return creepSpawn.createCreep(spawn, 'outpost_'+this.room.customName+'_'+type+'_', body, memo);
                }
            }
        }
    }
})();