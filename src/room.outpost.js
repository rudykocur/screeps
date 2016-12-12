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
                    this.spawnDefenders(this.state.hostiles);
                }

                if(this.state.sources) {
                    this.pingMiners();
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

                this.autobuildExtensions();
            }

            discoverSources() {
                var sources = this.room.find(FIND_SOURCES);

                this.state.sources = sources.map(s => {
                    return {
                        id: s.id,
                        pos: s.pos,
                    }
                });
            }

            sendScout() {
                var blueprint = config.blueprints.outpostScout;
                var scout = _.first(this.findCreeps(blueprint.role));

                if(!scout) {
                    var memo = _.defaults({
                        room: this.roomId,
                        role: blueprint.role,
                    });

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_CLAIMERS, this.homeRoom(),
                        this.getCreepName('scout'), blueprint.body, memo);
                }
            }

            pingMiners() {
                if(this.config.disableHarvesting) {
                    return;
                }

                let needed = this.state.sources.length;
                this.maintainPopulationAmount('miner', needed, config.blueprints.outpostMiner, spawnQueue.PRIORITY_HIGH, true);
            }

            pingCollectors() {
                let needed = _.get(this.config, 'creeps.collector', this.state.sources.length);

                let storage = this.homeRoom().getStorage();

                if(!storage) {
                    logger.mail(this.error("No storage for collector. Not spawning!"), 10);
                    return;
                }

                var blueprint = JSON.parse(JSON.stringify(config.blueprints.outpostCollector));
                blueprint.memo.storageId = storage.id;

                if(this.config.offroad) {
                    blueprint.body = blueprint.bodyOffroad;
                }

                this.maintainPopulationAmount('collector', needed, blueprint,
                    spawnQueue.PRIORITY_HIGH);
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

            spawnDefenders(hostiles) {
                var needed = hostiles.length;
                this.maintainPopulationAmount('defender', needed, config.blueprints.outpostDefender,
                    spawnQueue.PRIORITY_DEFENCE);
            }

            homeRoom() {
                return Room.byCustomName(this.config.homeRoom);
            }

            maintainPopulation(type, blueprint, priority) {
                var amount = _.get(this.config, ['creeps', type], 0);
                this.maintainPopulationAmount(type, amount, blueprint, priority);
            }

            maintainPopulationAmount(type, amount, blueprint, priority, ignorePrespawn) {
                if(amount <= 0) {
                    return;
                }

                var creeps = this.findCreeps(blueprint.role);
                var spawnTime = blueprint.body.length * CREEP_SPAWN_TIME;

                creeps = creeps.filter(c => {
                    if(c.spawning) {
                        return true;
                    }

                    let prespawnTime = 0;
                    if(!ignorePrespawn) {
                        prespawnTime = Math.min(c.memory.prespawnTime || 0, 300) * 0.75;
                    }

                    return c.ticksToLive > prespawnTime + spawnTime;
                });

                if(creeps.length < amount) {
                    var memo = _.defaults({
                        room: Room.customNameToId(this.roomName),
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(priority, this.homeRoom(), this.getCreepName(type),
                        blueprint.body, memo, null, this.config.spawnRooms);
                }
            }

            getCreepName(type) {
                return this.type+'_'+this.roomName+'_'+type+'_';
            }

            getFleePoint() {
                var flag = super.getFleePoint();

                if(!flag) {
                    return _.first(_.filter(Game.flags, f => {
                        return f.pos.roomName == this.homeRoom().name && f.color == COLOR_GREEN
                    }));
                }
            }

            autobuildExtensions() {
                var flags = _.groupBy(Game.flags, 'pos.roomName')[this.room.name];
                var autobuildStart = _.first(flags.filter(/**Flag*/f => f.color == COLOR_BROWN && f.secondaryColor == COLOR_YELLOW));
                if(!autobuildStart) {
                    return;
                }

                var markerFlags = flags.filter(/**Flag*/f => f.color == COLOR_PURPLE);
                markerFlags.forEach(f => f.remove());

                return;

                var totalExtensions = 5;
                var width = Math.ceil(Math.sqrt(totalExtensions*2));

                var p = autobuildStart.pos;

                var flagsPut = 0;

                for(let x = 0; x < width; x++) {
                    // let arr = [];
                    for(let y = 0; y < width; y++) {
                        let isRoad = (((x == 0) || (x % 2 == 0)) && ((y > 0) && y % 2 != 0)) ||
                            ( (x > 0 && x % 2 != 0) && ((y == 0) || (y%2 == 0) ));

                        // arr.push(isRoad ? 'x' : ' ');

                        if(!isRoad) {
                            flagsPut ++;
                            this.room.createFlag(p.x + x, p.y + y, `ab_${this.room.name}_${x}_${y}`, COLOR_PURPLE, COLOR_YELLOW);
                        }
                    }

                    // console.log(arr.join(''))
                }

                // console.log('flags', flagsPut);

                // this.debug('autobuild flag set!');
            }
        }
    }
})();

profiler.registerClass(module.exports.handler, 'OutpostRoomHandler');