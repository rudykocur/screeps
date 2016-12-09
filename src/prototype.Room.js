
const config = require('config');

var customNameToRoomId = {};
_.each(config.roomNames, (roomName, roomId) => {
    customNameToRoomId[roomName] = roomId;
});

Object.defineProperty(Room.prototype, 'customName', {get: function() {
    return config.roomNames[this.name];
}});

Object.defineProperty(Room.prototype, 'handlerMemory', {get: function() {
    return Memory.rooms[this.customName];
}});

Room.byCustomName = function(roomName) {
    return Game.rooms[customNameToRoomId[roomName]];
};

Room.customNameToId = function(roomName) {
    return customNameToRoomId[roomName];
};

Room.prototype.refreshStructures = function() {
    var state = this.handlerMemory;

    if(!state.lastRefreshTime || (Game.time - state.lastRefreshTime) > 20) {
        state.lastRefreshTime = Game.time;

        state.structures = {
            storage: null,
            terminal: null,
            containers: [],
            towers: [],
            spawns: [],
            extensions: [],
        };

        this.find(FIND_STRUCTURES).forEach(/**Structure*/struct => {
            if(struct.structureType == STRUCTURE_STORAGE) {
                state.structures.storage = struct.id;
            }

            if(struct.structureType == STRUCTURE_CONTAINER) {
                state.structures.containers.push(struct.id);
            }

            if(struct.structureType == STRUCTURE_TERMINAL) {
                state.structures.terminal = struct.id;
            }

            if(struct.structureType == STRUCTURE_TOWER) {
                state.structures.towers.push(struct.id);
            }

            if(struct.structureType == STRUCTURE_EXTENSION) {
                state.structures.extensions.push(struct.id);
            }

            if(struct.structureType == STRUCTURE_SPAWN) {
                state.structures.spawns.push(struct.id);
            }
        });
    }
};

Room.prototype.getTerminal = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.terminal);
};

Room.prototype.getStorage = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.storage);
};

Room.prototype.getSpawns = function() {
    return this.handlerMemory.structures.spawns.map(sId => Game.getObjectById(sId));
};

Room.prototype.getContainers = function(options) {
    _.defaults(options, {
        resource: null,
        amount: 0,
    });

    this.refreshStructures();
    var containers = this.handlerMemory.structures.containers.map(sId => Game.getObjectById(sId));

    if(options.resource) {
        containers = containers.filter(/**StructureContainer*/ c => {
            return c.store[options.resource] > options.amount
        })
    }

    return containers;
};

Room.prototype.searchJobs = function(options) {
    _.defaults(options, {
        type: null,
        subtype: null,
        onlyFree: true,
    });

    var jobs = Memory.rooms[this.customName].jobs;

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

        return true;
    })
};