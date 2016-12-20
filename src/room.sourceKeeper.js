var profiler = require('./profiler-impl');

var config = require('./config');
var logger = require('./logger');
var creepSpawn = require('./creepSpawn');
var roomHandlers = require('./room.handlers');
var spawnQueue = require('./spawnQueue');
var RoomHandler = require('./room.handlers').RoomHandler;

var roleCollector = require('./role.collector');

class SourceKeeperRoom extends RoomHandler {
    constructor(roomName, state, config) {
        super(roomName, state, config);

        this.type = 'sourceKeeper';

        _.defaults(this.state, {
            flags: {},
        });
    }

    process() {
        super.process();

        if(this.state.lairs) {

            this.createMiningJobs();
            this.createDefendJobs();
        }
        else {
            if(this.room) {
                this.discoverRoom();
            }
            else {
                this.sendScout();
            }
        }

        this.maintainPopulation('defender', config.blueprints.lairDefender, spawnQueue.PRIORITY_HIGH);
        this.maintainPopulation('settler', config.blueprints.outpostSettler, spawnQueue.PRIORITY_NORMAL);
        this.maintainPopulation('harvester', config.blueprints.lairHarvester, spawnQueue.PRIORITY_NORMAL);
        this.maintainCollectors();
    }

    getKeeperFlags() {
        var flags = _.groupBy(Game.flags, 'pos.roomName')[this.roomId];
        return flags.filter(/**Flag*/f => f.color == COLOR_RED && f.secondaryColor == COLOR_WHITE);
    }

    maintainCollectors() {
        let storage = this.homeRoom().getStorage();

        if(!storage) {
            logger.mail(this.error("No storage for collector. Not spawning!"), 10);
            return;
        }

        var blueprint = JSON.parse(JSON.stringify(config.blueprints.outpostCollector));
        blueprint.memo.storageId = storage.id;

        this.maintainPopulation('collector', blueprint, spawnQueue.PRIORITY_NORMAL)
    }

    getObjectsAroundFlags() {
        var flags = this.getKeeperFlags();

        this.state.flags = flags.map(/**Flag*/ flag => {
            var source = _.first(this.state.sources.filter(/**{id,pos}*/ src => {
                return flag.pos.getRangeTo(RoomPosition.fromDict(src.pos)) < 6;
            }));

            var lair = _.first(this.state.lairs.filter(/**{id,pos}*/ lair => {
                return flag.pos.getRangeTo(RoomPosition.fromDict(lair.pos)) < 6;
            }));

            var enemy = _.first(flag.pos.findInRange(FIND_HOSTILE_CREEPS, 5));

            return {
                source: source.id,
                sourcePos: source.pos,
                flagPos: flag.pos,
                flagName: flag.name,
                lairId: lair.id,
                lairPos: lair.pos,
                enemyId: _.get(enemy, 'id'),
            }
        });

        return this.state.flags;
    }

    /**
     * Override from base class - completely different logic
     */
    createMiningJobs() {
        var jobs = this.state.jobs;

        var flags = this.getObjectsAroundFlags();

        flags.forEach(/**{source,sourcePos}*/ data => {
            var key = `lair-mining-${data.source}`;

            if(!(key in jobs)) {
                jobs[key] = {
                    key: key,
                    room: this.roomName,
                    type: 'harvest',
                    subtype: 'energy',
                    sourceId: data.source,
                    sourcePos: data.sourcePos,
                    takenBy: null,
                };
            }
        });
    }

    createDefendJobs() {
        var jobs = this.state.jobs;

        var flags = this.getObjectsAroundFlags();

        flags.forEach(/**{flagName,flagPos,enemyId}*/ data => {
            var key = `lair-defend-${data.flagName}`;

            if(!(key in jobs)) {
                jobs[key] = {
                    key: key,
                    room: this.roomName,
                    type: 'combat',
                    subtype: 'defendLair',
                    flagName: data.flagName,
                    sourcePos: data.flagPos,
                    takenBy: null,
                    priority: 1000,
                    enemy: null,
                };
            }

            /** @type StructureKeeperLair */
            var lair = Game.getObjectById(data.lairId);
            if(lair && lair.ticksToSpawn) {
                jobs[key].priority = lair.ticksToSpawn;
            }
            else {
                jobs[key].priority = 1000;
            }

            jobs[key].enemy = data.enemyId;
        });
    }

    discoverRoom() {
        var sources = this.room.find(FIND_SOURCES);

        this.state.sources = sources.map(s => {
            return {
                id: s.id,
                pos: s.pos,
            }
        });

        var lairs = this.room.find(FIND_STRUCTURES).filter(/**Structure*/ struct => struct.structureType == STRUCTURE_KEEPER_LAIR)

        this.state.lairs = lairs.map(/**StructureKeeperLair*/ struct => {
            return {
                id: struct.id,
                pos: struct.pos,
            }
        })
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

    maintainPopulation(type, blueprint, priority) {
        var amount = _.get(this.config, ['creeps', type], 0);
        this.maintainPopulationAmount(type, amount, blueprint, priority);
    }

    maintainPopulationAmount(type, amount, blueprint, priority, ignorePrespawn) {
        if(amount <= 0) {
            return;
        }

        var creeps = this.findCreeps(blueprint.role);
        var spawnTime = blueprint.body.length * CREEP_SPAWN_TIME * 0.9;

        creeps = creeps.filter(c => {
            if(c.spawning) {
                return true;
            }

            let prespawnTime = 0;
            if(!ignorePrespawn) {
                prespawnTime = Math.min(c.memory.prespawnTime || 0, 300) * 0.9;
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

    homeRoom() {
        return Room.byCustomName(this.config.homeRoom);
    }

    getCreepName(type) {
        return 'sk_'+this.roomName+'_'+type+'_';
    }
}


module.exports = (function() {
    return {
        handler: SourceKeeperRoom
    }
})();

profiler.registerClass(SourceKeeperRoom, 'SourceKeeperRoom');