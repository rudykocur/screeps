
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
    this.refreshStructures();
    return this.handlerMemory.structures.spawns.map(sId => Game.getObjectById(sId));
};

Room.prototype.getExtensions = function() {
    this.refreshStructures();
    return this.handlerMemory.structures.extensions.map(id => Game.getObjectById(id));
};

Room.prototype.getTowers = function() {
    this.refreshStructures();
    return this.handlerMemory.structures.towers.map(sId => Game.getObjectById(sId));
};

Room.prototype.getDroppedResources = function(options) {
    var state = this.handlerMemory;

    if(!state.refreshTime_droppedResources || (Game.time - state.refreshTime_droppedResources) >5) {
        state.refreshTime_droppedResources = Game.time;

        state.droppedResources = this.find(FIND_DROPPED_RESOURCES).map(r=> {
            return {id: r.id, amount: r.amount, resourceType: r.resourceType, pos: r.pos};
        });
    }

    options = options || {};
    _.defaults(options, {
        resource: null
    });

    let result = state.droppedResources;
    if(options.resource) {
        result = result.filter(r => r.resourceType == options.resource);
    }

    return result.map(r => Game.getObjectById(r.id)).filter(r => r != null);
};

Room.prototype.getContainers = function(options) {
    options = options || {}
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

Room.prototype.getAllSources = function() {
    var state = this.handlerMemory;

    if(!state.refreshTime_sources || (Game.time - state.refreshTime_sources) > 1000) {
        state.refreshTime_sources = Game.time;

        state.allSouces = this.find(FIND_SOURCES).concat(this.find(FIND_MINERALS)).map(r => r.id);
    }

    return state.allSouces.map(id => Game.getObjectById(id));
};
