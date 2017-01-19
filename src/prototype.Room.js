
var config = require('./config');

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

Room.idToCustomName = function(roomId) {
    return config.roomNames[roomId];
};

Room.prototype.sendResources = function(resource, amount, roomName) {
    return this.terminal.send(resource, amount, Room.byCustomName(roomName).name);
};

Room.prototype.refreshStructures = function() {
    var state = this.handlerMemory;

    if(!state.lastRefreshTime || (Game.time - state.lastRefreshTime) > 20) {
        state.lastRefreshTime = Game.time;

        state.structures = {
            storage: null,
            terminal: null,
            observer: null,
            nuke: null,
            extractor: {
                resource: null,
                extractorId: null,
                mineralId: null,
                containerId: null,
            },
            containers: [],
            towers: [],
            spawns: [],
            extensions: [],
            wallsAndRamparts: [],
            toRepair: [],
            rampartsOverStructures: [],
        };

        let ramparts = {};

        let allStructures = this.find(FIND_STRUCTURES);
        allStructures.forEach(/**Structure*/struct => {

            if (struct.structureType == STRUCTURE_STORAGE) {
                state.structures.storage = struct.id;
            }

            if (struct.structureType == STRUCTURE_OBSERVER) {
                state.structures.observer = struct.id;
            }

            if (struct.structureType == STRUCTURE_CONTAINER) {
                state.structures.containers.push(struct.id);
            }

            if (struct.structureType == STRUCTURE_TERMINAL) {
                state.structures.terminal = struct.id;
            }

            if (struct.structureType == STRUCTURE_NUKER) {
                state.structures.nuke = struct.id;
            }

            if (struct.structureType == STRUCTURE_TOWER) {
                state.structures.towers.push(struct.id);
            }

            if (struct.structureType == STRUCTURE_EXTENSION) {
                state.structures.extensions.push(struct.id);
            }

            if (struct.structureType == STRUCTURE_SPAWN) {
                state.structures.spawns.push(struct.id);
            }

            if (struct.structureType == STRUCTURE_EXTRACTOR) {
                let mineral = _.first(struct.pos.lookFor(LOOK_MINERALS));
                state.structures.extractor = {
                    resource: mineral.mineralType,
                    extractorId: struct.id,
                    mineralId: mineral.id,
                    containerId: null,
                }
            }

            if(struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) {
                state.structures.wallsAndRamparts.push(struct.id);
            }
            else {
                if((struct.hits / struct.hitsMax) < 0.75) {
                    state.structures.toRepair.push(struct.id);
                }
            }

            if(struct.structureType == STRUCTURE_RAMPART) {
                ramparts[struct.pos.x+'-'+struct.pos.y] = struct.id;
            }

        });

        allStructures.forEach(/**Structure*/struct => {
            if([STRUCTURE_TOWER, STRUCTURE_SPAWN].indexOf(struct.structureType) >= 0) {
                let rampartId = ramparts[struct.pos.x+'-'+struct.pos.y];
                if(rampartId) {
                    state.structures.rampartsOverStructures.push(rampartId);
                }
            }
        });

        if(state.structures.extractor.mineralId) {
            let mineral = Game.getObjectById(state.structures.extractor.mineralId);
            let containers = mineral.pos.findInRange(state.structures.containers.map(sId => Game.getObjectById(sId)), 1);

            state.structures.extractor.containerId = _.get(_.first(containers), 'id');
        }
    }
};

/**
 * @return {StructureTerminal}
 */
Room.prototype.getTerminal = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.terminal);
};

/**
 * @return {StructureStorage}
 */
Room.prototype.getStorage = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.storage);
};

/**
 * @return {StructureObserver}
 */
Room.prototype.getObserver = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.observer);
};

/**
 * @returns {StructureNuker}
 */
Room.prototype.getNuke = function() {
    this.refreshStructures();
    return Game.getObjectById(this.handlerMemory.structures.nuke);
};

/**
 *
 * @returns {{extractor: StructureExtractor, container: StructureContainer, resource:String}}
 */
Room.prototype.getExtractor = function() {
    this.refreshStructures();

    if(!this.handlerMemory.structures.extractor.extractorId) {
        return null;
    }

    return {
        extractor: Game.getObjectById(this.handlerMemory.structures.extractor.extractorId),
        container: Game.getObjectById(this.handlerMemory.structures.extractor.containerId),
        mineral: Game.getObjectById(this.handlerMemory.structures.extractor.mineralId),
        resource: this.handlerMemory.structures.extractor.resource,
    }
};

/**
 * @return {Array<StructureSpawn>}
 */
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

/**
 * @return {Array<StructureWall>}
 */
Room.prototype.getWallsAndRamparts = function() {
    this.refreshStructures();
    return this.handlerMemory.structures.wallsAndRamparts.map(sId => Game.getObjectById(sId));
};

/**
 * @return {Array<OwnedStructure>}
 */
Room.prototype.getStructuresToRepair = function() {
    this.refreshStructures();
    return this.handlerMemory.structures.toRepair.map(sId => Game.getObjectById(sId));
};

/**
 * @return {Array<String>}
 */
Room.prototype.getRampartsOverStructures = function() {
    this.refreshStructures();
    return this.handlerMemory.structures.rampartsOverStructures;
};

/**
 *
 * @param {Object} [options]
 * @param {String} options.resource
 * @returns {Array.<Resource>}
 */
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

/**
 *
 * @param options
 * @returns {Array<StructureContainer>}
 */
Room.prototype.getContainers = function(options) {
    options = options || {};
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
