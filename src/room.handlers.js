const config = require('config');
const logger = require('logger');

const actionCombat = require('action.combat');

const roomModules = ['outpost', 'colony'];

module.exports = (function() {

    return {
        RoomHander: class {
            constructor(roomName, state, config) {
                this.roomName = roomName;
                this.room = Room.byCustomName(roomName);
                this.state = state;
                this.config = config;

                this.type = 'unknown';

                _.defaults(this.state, {hostiles: [], creeps: {}, spawns: []});
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

            prepareSpawnQueue() {}

            process() {
                if(!this.room) {
                    return;
                }

                if(Game.time % 50 == 0) {
                    this.updateSpawns();
                }

                if(Game.time % 10 == 0) {
                    this.checkThreats();
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

            updateSpawns() {
                this.state.spawns = this.room.find(FIND_MY_SPAWNS).map(s => s.id);
            }

            getSpawns() {
                return this.state.spawns.map(sId => Game.getObjectById(sId));
            }

            findCreeps(role) {
                var roomId = (this.room ? this.room.name : Room.customNameToId(this.roomName));
                return _.filter(Game.creeps, c => {
                    return c.memory.room == roomId && c.memory.role == role;
                });
            }

            getAllCreeps() {
                return _.filter(Game.creeps, c => {
                    return c.memory.room == Room.customNameToId(this.roomName);
                });
            }

            getFleePoint() {
                if(this.room) {
                    return _.first(_.filter(Game.flags, f => {
                        return f.pos.roomName == this.room.name && f.color == COLOR_GREEN
                    }));
                }
            }
        },

        processRoomHandlers: function() {
            Memory.rooms = Memory.rooms || {};

            var handlers = {};
            roomModules.forEach(modName => {
                handlers[modName] = require('room.' + modName);
            });

            try {
                _.each(config.rooms, (roomConfig, roomName) => {
                    Memory.rooms[roomName] = Memory.rooms[roomName] || {};

                    var clz = handlers[roomConfig.type].handler;
                    var state = Memory.rooms[roomName];
                    var handler = new clz(roomName, state, roomConfig);

                    handler.process();
                });
            }
            catch(e) {
                logger.error('Failure at processing rooms', e, '::', e.stack);
            }
        },

        getRoomHandler: function(roomName) {
            var handlers = {};
            roomModules.forEach(modName => {
                handlers[modName] = require('room.' + modName);
            });

            var room = Room.byCustomName(roomName);

            var roomConfig = config.rooms[room.customName];
            var clz = handlers[roomConfig.type].handler;
            var state = Memory.rooms[room.customName];
            return new clz(roomName, state, roomConfig);
        }
    }
})();