const config = require('config');
const logger = require('logger');
const creepSpawn = require('creepSpawn');
const roomHandlers = require('room.handlers');
const spawnQueue = require('spawnQueue');

const roleCollector = require('role.collector');

module.exports = (function() {
    return {
        handler: class OutpostRoomHandler extends roomHandlers.RoomHander {
            constructor(roomName, state, config) {
                super(roomName, state, config);

                this.type = 'outpost';

                this.state.collectors = this.state.collectors || [];
            }

            process() {
                super.process();

                if(!this.room) {
                    if(!this.state.sources) {
                        this.sendScout();
                    }
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
                        pos: s.pos,
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

            sendScout() {
                var blueprint = config.blueprints.outpostScout;
                var scout = _.first(this.findCreeps(blueprint.role));

                if(!scout) {
                    var memo = _.defaults({
                        room: Room.customNameToId(this.roomName),
                        role: blueprint.role,
                    });

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_LOW, this.homeRoom(),
                        this.getCreepName('scout'), blueprint.body, memo);
                }
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

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_HIGH, this.homeRoom(), this.getCreepName('miner'),
                        body, memo);

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

                    var body = blueprint.body;
                    if(this.config.offroad) {
                        body = blueprint.bodyOffroad;
                    }

                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                        storageId: storage.id,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_HIGH, this.homeRoom(), this.getCreepName('collector'),
                        body, memo);
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

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_NORMAL, this.homeRoom(), this.getCreepName('claimer'),
                        blueprint.body, memo);
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

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_HIGH, this.homeRoom(),
                        this.getCreepName('defender'), blueprint.body, memo);
                }
                else {
                    if(!this.state.defenderId) {
                        logger.mail(this.info(logger.fmt.orange('created defender', defenderId)));
                    }
                }

                this.state.defenderId = defenderId;
            }

            homeRoom() {
                return Room.byCustomName(this.config.homeRoom);
            }

            getCreepName(type) {
                return 'outpost_'+this.roomName+'_'+type+'_';
            }
        }
    }
})();