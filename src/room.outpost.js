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
                this.pingClaimers();
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
                var defenders = this.findCreeps(config.blueprints.outpostDefender.role);

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
                if(this.config.creeps && this.config.creeps.collector !== undefined) {
                    needed = this.config.creeps.collector;
                }

                var blueprint = config.blueprints.outpostCollector;

                if(needed < 1) {
                    return;
                }

                var collectors = this.findCreeps(blueprint.role);

                if(collectors.length < needed) {
                    var storage = roleCollector.findTargetContainer(this.homeRoom());

                    if(!storage) {
                        logger.mail(this.error("No storage for collector. Not spawning!"), 10);
                        return;
                    }

                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                        storageId: storage.id,
                    }, blueprint.memo);

                    this.trySpawnCreep('collector', blueprint.body, memo);
                }
            }

            pingClaimers() {
                if(!this.config.creeps || !this.config.creeps.claimer) {
                    return;
                }

                var reservation = this.room.controller.reservation;
                if(reservation && reservation.ticksToEnd > 1000) {
                    return;
                }

                var blueprint = config.blueprints.outpostClaimer;
                var claimers = this.findCreeps(blueprint.role);

                if(claimers.length < this.config.creeps.claimer) {
                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    });

                    var newCreep = this.trySpawnCreep('claimer', blueprint.body, memo);

                    if(newCreep) {
                        this.debug('created claimer', newCreep);
                    }
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