var profiler = require('./profiler-impl');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logger');

var actionCombat = require('./action.combat');

var roomModules = ['outpost', 'colony', 'sourceKeeper'];

class RoomHandler {
    constructor(roomName, state, config) {
        this.roomName = roomName;
        /**@type Room*/
        this.room = Room.byCustomName(roomName);
        this.state = state;
        this.config = config;

        this.type = 'unknown';

        _.defaults(this.state, {
            hostiles: [],
            creeps: {},
            jobs: {},
        });
    }

    toString() {
        return `[Handler ${this.type} - ${this.roomName}]`;
    }

    get roomId() {
        return Room.customNameToId(this.roomName);
    }

    info(...messages) {
        return logger.log(`${this.type} ${this.roomName}: ${messages.join(' ')}`);
    }

    debug(...messages) {
        var msg = logger.fmt.gray(...messages);
        return logger.log(`${this.type} ${this.roomName}: ${msg}`);
    }

    error(...messages) {
        return logger.error(`${this.type} ${this.roomName}: ${messages.join(' ')}`);
    }

    processRoomTransfers(otherRooms) {}
    processMarket(orders) {}

    process() {
        this.cleanDeadJobs();

        if(!this.room) {
            return;
        }

        if(Game.time % 10 == 0) {
            this.checkThreats();
            this.checkNukes();
        }

        this.prepareJobBoard();
    }

    cleanDeadJobs() {
        var jobs = this.state.jobs;

        _.each(jobs, job => {
            if(job.takenBy && !Game.getObjectById(job.takenBy)) {
                job.takenBy = null;
            }

            if(job.reservations) {
                let creeps = _.keys(job.reservations);
                let toDelete = _.filter(creeps, creepId => Game.getObjectById(creepId) == null);
                if(toDelete.length > 0) {
                    toDelete.forEach(key => delete job.reservations[key]);
                }
            }
        });

        let toDelete = _.filter(jobs, job => {
            if(job.permanent) {
                return false;
            }

            return job.sourceId && Game.getObjectById(job.sourceId) == null;
        }).map(job => job.key);

        if(toDelete.length > 0) {
            toDelete.forEach(key => delete jobs[key]);
        }
    }

    prepareJobBoard() {
        this.createMiningJobs();
        this.createResourcePickupJobs();
    }

    createMiningJobs() {
        var jobs = this.state.jobs;

        var sources = this.room.find(FIND_SOURCES);
        var minerals = this.room.find(FIND_MINERALS, {
            filter: /** @param {Mineral} m */ m => _.first(this.room.lookForAt(LOOK_STRUCTURES, m.pos))
        });

        sources.forEach(s => {
            var key = 'mining-' + s.id;

            if(!(key in jobs)) {
                jobs[key] = {
                    key: key,
                    room: this.room.customName,
                    permanent: true,
                    type: 'harvest',
                    subtype: 'energy',
                    sourceId: s.id,
                    sourcePos: s.pos,
                    takenBy: null,
                };
            }
        });

        minerals.forEach(/**Mineral*/m => {
            var key = 'mining-' + m.id;

            if(m.mineralAmount > 0) {

                if (!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'harvest',
                        subtype: 'mineral',
                        sourceId: m.id,
                        sourcePos: m.pos,
                        takenBy: null,
                    };
                }
            }
            else {
                delete jobs[key];
            }
        });
    }

    createResourcePickupJobs() {
        var resources = this.room.getDroppedResources();
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();

        resources.forEach(/**{id,amount,resourceType,pos}*/ res => {
            var key = `pickup-${res.resourceType}-${res.id}`;

            var flags = RoomPosition.fromDict(res.pos).lookFor(LOOK_FLAGS);
            var isDropPoint = flags.filter(/**Flag*/ f => f.color == COLOR_CYAN).length > 0;

            if(!isDropPoint) {
                if(!(key in jobs)) {
                    jobs[key] = {
                        key: key,
                        room: this.room.customName,
                        type: 'pickup',
                        subtype: 'source',
                        resource:res.resourceType,
                        sourceId: res.id,
                        sourcePos: res.pos,
                        targetId: storage && storage.id,
                        targetPos: storage && storage.pos,
                        reservations: {},
                        amount: 0,
                    }
                }

                jobs[key].amount = res.amount;
            }
            else {
                delete jobs[key];
            }
        })
    }


    searchJobs(options) {
        _.defaults(options, {
            type: null,
            subtype: null,
            onlyFree: true,
            freeReserve: null,
        });

        var jobs = this.state.jobs;

        return _.filter(jobs, job => {
            if(options.type != job.type) {
                return false;
            }

            if(options.subtype && options.subtype != job.subtype) {
                return false;
            }

            if(options.onlyFree && job.takenBy) {
                return false;
            }

            if(options.freeReserve && _.sum(job.reservations) + options.freeReserve > job.amount) {
                return false;
            }

            return true;
        })
    }

    checkNukes() {
        var nukes = this.room.find(FIND_NUKES);

        if(nukes.length > 0) {
            logger.mail(this.error('Detected', nukes.length, '!!!'));
        }
    }

    checkThreats() {
        var creeps = this.room.find(FIND_HOSTILE_CREEPS, {
            filter: c => actionCombat.hasCombatParts(c)
        });

        var creepMap = _.zipObject(creeps.map(c => [c.id, c]));
        var currentCreeps = creeps.map(c => c.id);
        var oldCreeps = this.state.hostiles;

        var newCreeps = _.difference(currentCreeps, oldCreeps);
        var goneCreeps = _.difference(oldCreeps, currentCreeps);

        if(newCreeps.length > 0) {
            logger.mail(this.error('New hostile creeps:', newCreeps.map(cId => creepMap[cId].idwithOwner).join(', ')));

            var fleePoint = this.getFleePoint();

            if(fleePoint) {

                this.info(logger.fmt.orange(`all creeps will go to ${fleePoint.pos}`));

                this.getAllCreeps().forEach(c => {
                    c.memory.tasks = [];
                    c.memory.fleePoint = fleePoint.pos;
                })
            }
            else {
                this.info(logger.fmt.orange(`unable to find fleePoint for room ${this.roomName}. There will be slaughter`))
            }
        }

        if(goneCreeps.length > 0) {
            logger.mail(this.info(logger.fmt.green('Hostile creeps', goneCreeps.join(', '), 'gone')));

            if(currentCreeps.length == 0) {
                this.info(logger.fmt.green('room is safe again'));

                this.getAllCreeps().forEach(c => {
                    c.memory.tasks = [];
                    delete c.memory.fleePoint;
                })
            }
        }

        this.state.hostiles = currentCreeps;
    }

    findCreeps(role) {
        return module.exports.getCreeps(this.roomId, role);
    }

    getAllCreeps() {
        return _.filter(Game.creeps, c => {
            return c.memory.room == this.roomId;
        });
    }

    getFleePoint() {
        if(this.room) {
            return _.first(_.filter(Game.flags, f => {
                return f.pos.roomName == this.room.name && f.color == COLOR_GREEN
            }));
        }
    }

    getResourceTotal(resource) {
        var structures = [this.room.getStorage(), this.room.getTerminal()];

        return _.sum(structures, struct => struct && (struct.store[resource] || 0));
    }
}

module.exports = (function() {

    var creepCache = {};
    var cacheUpdatedTick = 0;

    function refreshCreepsCache() {
        if(cacheUpdatedTick != Game.time) {
            cacheUpdatedTick = Game.time;

            creepCache = {};

            _.each(Game.creeps, c=> {
                let room = c.memory.room;
                let role = c.memory.role;

                if(!(room in creepCache)) {
                    creepCache[room] = {};
                }

                if(!(role in creepCache[room])) {
                    creepCache[room][role] = [];
                }

                creepCache[room][role].push(c);
            });
        }
    }

    return {
        RoomHandler: RoomHandler,

        getCreeps(roomId, role) {
            refreshCreepsCache();

            if(!(roomId in creepCache)) {
                return [];
            }

            return creepCache[roomId][role] || [];
        },

        processRoomHandlers: function() {
            Memory.rooms = Memory.rooms || {};

            var handlerModules = {};
            roomModules.forEach(modName => {
                handlerModules[modName] = require('./room.' + modName);
            });

            var marketOrders = null;

            if(Game.time % config.market.processInterval == 0) {
                marketOrders = Game.market.getAllOrders();
            }

            var handlers = _.map(config.rooms, (roomConfig, roomName) => {
                Memory.rooms[roomName] = Memory.rooms[roomName] || {};

                var clz = handlerModules[roomConfig.type].handler;
                var state = Memory.rooms[roomName];

                return new clz(roomName, state, roomConfig);
            });

            var withTerminal = handlers.filter(/**RoomHandler*/handler => handler.room && handler.room.terminal);

            _.each(handlers, /**RoomHandler*/handler => {
                try {

                    if(marketOrders) {
                        if(handler.room && handler.room.terminal) {
                            handler.processRoomTransfers(_.without(withTerminal, handler));
                        }
                        handler.processMarket(marketOrders);
                    }

                    handler.process();
                }
                catch(e) {
                    logger.error('Failure at processing room', handler.roomName,'-', e, '::', e.stack);
                }
            });

        },

        getRoomHandler: function(roomName) {
            var handlers = {};
            roomModules.forEach(modName => {
                handlers[modName] = require('./room.' + modName);
            });

            var room = Room.byCustomName(roomName);

            var roomConfig = config.rooms[roomName];
            var clz = handlers[roomConfig.type].handler;
            var state = Memory.rooms[roomName];
            return new clz(roomName, state, roomConfig);
        }
    }
})();

profiler.registerClass(RoomHandler, 'RoomHandler');