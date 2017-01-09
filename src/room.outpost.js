var profiler = require('./profiler-impl');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logger');
var creepSpawn = require('./creepSpawn');
var roomHandlers = require('./room.handlers');
var spawnQueue = require('./spawnQueue');

var RoomHandler = require('./room.handlers').RoomHandler;

var roleCollector = require('./role.collector');

class OutpostRoomHandler extends RoomHandler {
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

        if(!this.room) {
            this.sendScout();
        }

        if(this.state.sources) {
            this.pingMiners();
        }
        else {
            if(this.room) {
                this.discoverSources();
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

        let needed =  _.get(this.config, ['creeps', 'harvester'], this.state.sources.length);
        this.maintainPopulationAmount('miner', needed, config.blueprints.outpostMiner, spawnQueue.PRIORITY_HIGH, true);
    }

    pingCollectors() {
        if(Game.time % 40 == 0) {
            var resources = this.room.getDroppedResources({resource: RESOURCE_ENERGY});

            this.state.energyOnGround = _.sum(resources, /**Resource*/r => r.amount);
        }

        let needed = _.get(this.config, 'creeps.collector', this.state.sources.length);
        let additional = Math.min(4, Math.floor((this.state.energyOnGround || 0) / 2000));

        needed += additional;

        let storage = this.homeRoom().getStorage();

        if(!storage) {
            logger.mail(this.error("No storage for collector. Not spawning!"), 10);
            return;
        }

        var blueprint = JSON.parse(JSON.stringify(config.blueprints.outpostCollector));
        blueprint.memo.unloadRoom = this.config.homeRoom;

        if(this.config.offroad) {
            blueprint.body = blueprint.bodyOffroad;
        }

        this.maintainPopulationAmount('collector', needed, blueprint,
            spawnQueue.PRIORITY_HIGH);
    }

    pingClaimers() {
        if(!this.room.controller) {
            return;
        }
        var reservation = this.room.controller.reservation;
        if(reservation && reservation.ticksToEnd > 1000) {
            return;
        }

        var amount = _.get(this.config, ['creeps', 'claimer'], 1);

        this.maintainPopulationAmount('claimer', amount, config.blueprints.outpostClaimer, spawnQueue.PRIORITY_CLAIMERS);
    }

    pingSettlers() {
        if(Game.time % 30 == 0) {
            var sites = _.groupBy(Game.constructionSites, 'pos.roomName')[this.room.name];
            this.state.constructionProgressLeft = _.sum(sites, /**ConstructionSite*/ s => s.progressTotal - s.progress);
        }

        let defaultSettlers = 0;
        if(this.state.constructionProgressLeft > 0) {
            defaultSettlers = 1;
        }

        var amount = _.get(this.config, ['creeps', 'settler'], defaultSettlers);
        this.maintainPopulationAmount('settler', amount, config.blueprints.outpostSettler, spawnQueue.PRIORITY_NORMAL);
    }

    spawnDefenders(hostiles) {
        if(this.config.disableDefenders) {
            return;
        }

        var needed = hostiles.length;
        this.maintainPopulationAmount('defender', needed, config.blueprints.outpostDefender,
            spawnQueue.PRIORITY_DEFENCE);
    }

    homeRoom() {
        return Room.byCustomName(this.config.homeRoom);
    }

    maintainPopulationAmount(type, amount, blueprint, priority, ignorePrespawn) {
        if(amount <= 0) {
            return;
        }

        var creeps = this.findCreeps(blueprint.role);
        var spawnTime = blueprint.body.length * CREEP_SPAWN_TIME * 0.75;

        creeps = creeps.filter(c => {
            if(c.spawning) {
                return true;
            }

            let prespawnTime = 0;
            if(!ignorePrespawn) {
                prespawnTime = Math.min(c.memory.prespawnTime || 0, 300) * 0.75;
            }

            let creepSpawnTime = c.memory.spawnTime? c.memory.spawnTime : spawnTime;

            return c.ticksToLive > prespawnTime + creepSpawnTime;
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
}


module.exports = (function() {
    return {
        handler: OutpostRoomHandler
    }
})();

profiler.registerClass(OutpostRoomHandler, 'OutpostRoomHandler');