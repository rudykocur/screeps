
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
            toRepair: [],
            rampartsOverStructures: [],
        };

        let ramparts = {};
        let allContainers = [];
        let links = [];

        let allStructures = this.find(FIND_STRUCTURES);
        allStructures.forEach(/**Structure*/struct => {

            if (struct.structureType == STRUCTURE_STORAGE) {
                state.structures.storage = struct.id;
            }

            if (struct.structureType == STRUCTURE_OBSERVER) {
                state.structures.observer = struct.id;
            }

            if (struct.structureType == STRUCTURE_CONTAINER) {
                allContainers.push(struct);
            }

            if(struct.structureType == STRUCTURE_LINK) {
                links.push(struct);
            }

            if (struct.structureType == STRUCTURE_TERMINAL) {
                state.structures.terminal = struct.id;
            }

            if (struct.structureType == STRUCTURE_NUKER) {
                state.structures.nuke = struct.id;
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
            let containers = mineral.pos.findInRange(allContainers, 1);

            state.structures.extractor.containerId = _.get(_.first(containers), 'id');
        }

        this.updateLinks(links);
    }
};

/**
 *
 * @param {Array.<StructureLink>} links
 */
Room.prototype.updateLinks = function(links) {
    var state = this.handlerMemory;

    if(!('links' in state)) {
        state.links = {};
    }

    links.forEach(link => {
        if(!(link.id in state.links)) {
            let source = _.first(link.pos.findInRange(FIND_SOURCES, 2));
            if(source) {
                state.links[link.id] = {
                    type: 'source',
                    linkId: link.id,
                    sourceId: source.id,
                }
            }

            let storage = _.first(link.pos.findInRange([this.storage], 4));
            if(storage) {
                state.links[link.id] = {
                    type: 'storage',
                    linkId: link.id,
                }
            }
        }
    })
};

Room.prototype.getLinkForSource = function(sourceId) {
    var state = this.handlerMemory;
    let links = _.values(state.links);
    let link = _.first(links.filter(link => link.type == 'source' && link.sourceId == sourceId));

    if(link) {
        return Game.getObjectById(link.linkId);
    }
};

/**
 *
 * @returns {StructureLink|undefined}
 */
Room.prototype.getLinkForStorage = function() {
    var state = this.handlerMemory;
    let links = _.values(state.links);
    let link = _.first(links.filter(link => link.type == 'storage'));

    if(link) {
        return Game.getObjectById(link.linkId);
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
    /** @type StructureStorage */
    let storage = Game.getObjectById(this.handlerMemory.structures.storage);

    if(storage && storage.my) {
        return storage;
    }
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
    return this.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_SPAWN}
    });
};

Room.prototype.getExtensions = function() {
    return this.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_EXTENSION}
    });
};

Room.prototype.getTowers = function() {
    return this.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
    });
};

/**
 * @return {Array<StructureWall>}
 */
Room.prototype.getWallsAndRamparts = function() {
    return this.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
    });
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

    var containers = this.find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_CONTAINER}
    });

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
