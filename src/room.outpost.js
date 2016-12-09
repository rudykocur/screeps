const profiler = require('screeps-profiler');

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

                if(this.state.hostiles.length > 0) {
                    this.spawnDefender();
                }

                if(this.state.sources) {
                    this.state.sources.forEach(source => {
                        this.pingMinerForSource(source);
                    });
                }
                else {
                    if(this.room) {
                        this.discoverSources();
                    }
                    else {
                        this.sendScout();
                    }
                }

                if(!this.room) {
                    return;
                }

                this.pingCollectors();
                this.pingClaimers();
                this.pingSettlers();
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
                        room: this.roomId,
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
                if(this.config.disableHarvesting) {
                    return;
                }

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
                        energyPosition: source.pos,
                        room: Room.customNameToId(this.roomName),
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
                var reservation = this.room.controller.reservation;
                if(reservation && reservation.ticksToEnd > 1000) {
                    return;
                }

                this.maintainPopulation('claimer', config.blueprints.outpostClaimer, spawnQueue.PRIORITY_CLAIMERS);
            }

            pingSettlers() {
                this.maintainPopulation('settler', config.blueprints.outpostSettler, spawnQueue.PRIORITY_NORMAL);
            }

            maintainPopulation(type, blueprint, priority) {
                if(!this.config.creeps || !this.config.creeps[type]) {
                    return;
                }

                var creeps = this.findCreeps(blueprint.role);

                if(creeps.length < this.config.creeps[type]) {
                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(priority, this.homeRoom(), this.getCreepName(type),
                        blueprint.body, memo);
                }
            }

            spawnDefender() {
                var defenderId = this.findDefender();

                if(!defenderId) {
                    var blueprint = config.blueprints.outpostDefender;

                    var memo = _.defaults({
                        room: this.roomId,
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_DEFENCE, this.homeRoom(),
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

            getFleePoint() {
                var flag = super.getFleePoint();

                if(!flag) {
                    return _.first(_.filter(Game.flags, f => {
                        return f.pos.roomName == this.homeRoom().name && f.color == COLOR_GREEN
                    }));
                }
            }
        }
    }
})();

profiler.registerClass(module.exports.handler, 'OutpostRoomHandler');