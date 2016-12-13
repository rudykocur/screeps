const profiler = require('screeps-profiler');

const config = require('config');
const logger = require('logger');
const roomHandlers = require('room.handlers');

const spawnQueue = require('spawnQueue');

module.exports = (function() {
    return {
        handler: class ColonyRoomHandler extends roomHandlers.RoomHander {
            constructor(roomName, state, config) {
                super(roomName, state, config);

                this.type = 'colony';

                _.defaults(this.state, {});

                this.labNameToId = {};
                _.each(_.get(config, 'labs.names', {}), (labName, labId) => {
                    this.labNameToId[labName] = labId;
                });
            }

            process() {
                super.process();

                // if(Game.time % 100) {
                if(true) {
                    this.autobuildExtensions();
                }

                this.runReactions();

                this.maintainHarvesterPopulation();
                this.maintainMovers();
                this.maintainPopulation('builder', config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
                this.maintainPopulation('upgrader', config.blueprints.colonyUpgrader, spawnQueue.PRIORITY_LOW);
                this.maintainPopulation('settler', config.blueprints.outpostSettler, spawnQueue.PRIORITY_NORMAL);
            }

            maintainMovers() {
                var needed = _.get(this.config, ['creeps', 'mover'], 0);

                var movers = this.findCreeps(config.blueprints.colonyMover.role);

                if(needed > 1 && movers.length > 1) {
                    var minTicks = Infinity, maxTicks = 0;

                    movers.forEach(/**Creep*/creep => {
                        if(creep.spawning) {
                            maxTicks = CREEP_LIFE_TIME;
                        }
                        else {
                            if(creep.ticksToLive < minTicks) {
                                minTicks = creep.ticksToLive;
                            }
                            if(creep.ticksToLive > maxTicks) {
                                maxTicks = creep.ticksToLive;
                            }
                        }

                    });

                    if(maxTicks - minTicks < 300 && maxTicks < 600) {
                        needed += 1;
                    }
                }

                this.maintainPopulationAmount('mover', needed, config.blueprints.colonyMover, spawnQueue.PRIORITY_CRITICAL);
            }

            runReactions() {
                _.get(this.config, 'labs.reactions', []).forEach(reaction => {
                    let [in1, in2, /**StructureLab*/ out] = reaction.labs;
                    let [in1Resource, in2Resouce] = reaction.load;

                    in1 = Game.getObjectById(this.labNameToId[in1]);
                    in2 = Game.getObjectById(this.labNameToId[in2]);
                    out = Game.getObjectById(this.labNameToId[out]);

                    if(in1.mineralType != in1Resource) {
                        return;
                    }

                    if(in2.mineralType != in2Resouce) {
                        return;
                    }

                    if(out.mineralAmount < reaction.amount && out.cooldown == 0) {
                        out.runReaction(in1, in2);
                    }
                });
            }

            prepareJobBoard() {
                super.prepareJobBoard();

                this.createRefillEnergyJobs();

                var storage = this.room.getStorage();
                var terminal = this.room.getTerminal();

                if(storage && terminal) {
                    this.processStorageSurplusJobs(storage, terminal);
                    this.createTerminalToStorageJobs(storage, terminal);
                    this.createTerminalRequirementsJobs(storage, terminal);
                }

                this.createLabTransferJobs();
                this.createMoveMineralToStorageJob();
                this.createResourcePickupJobs();
            }

            processStorageSurplusJobs(storage, terminal) {
                var reserves = _.get(this.config, 'minerals.reserve', {});
                var jobs = this.state.jobs;

                _.each(storage.store, (amount, resource) => {
                    var key = `market-${this.room.customName}-${resource}`;

                    if (reserves[resource] >= 0 && amount > reserves[resource]) {
                        if (!(key in jobs)) {
                            jobs[key] = {
                                key: key,
                                room: this.room.customName,
                                type: 'transfer',
                                sourceId: storage.id,
                                sourcePos: storage.pos,
                                resource: resource,
                                targetId: terminal.id,
                                targetPos: terminal.pos,
                                takenBy: null,
                                amount: 0,
                            }
                        }

                        jobs[key].amount = amount - reserves[resource];
                    }
                    else {
                        delete jobs[key];
                    }
                });
            }

            createTerminalToStorageJobs(storage, terminal) {
                var reserves = _.get(this.config, 'minerals.reserve', {});
                var requires = _.get(this.config, 'terminal.require', {});

                var jobs = this.state.jobs;

                _.each(terminal.store, (amount, resource) => {
                    var key = `terminal-withdraw-${this.room.customName}-${resource}`;

                    var storageDemand = (reserves[resource] || 0) - (storage.store[resource] || 0);
                    var availableAmount = amount - (requires[resource] || 0);

                    if(availableAmount > 0 && storageDemand > 0) {
                        if(!(key in jobs)) {
                            jobs[key] = {
                                key: key,
                                room: this.room.customName,
                                type: 'transfer',
                                sourceId: terminal.id,
                                sourcePos: terminal.pos,
                                resource: resource,
                                targetId: storage.id,
                                targetPos: storage.pos,
                                takenBy: null,
                                amount: 0,
                            }
                        }

                        jobs[key].amount = availableAmount;
                    }
                    else {
                        delete jobs[key];
                    }
                });
            }

            createTerminalRequirementsJobs(storage, terminal) {
                var requires = _.get(this.config, 'terminal.require', {});
                var jobs = this.state.jobs;

                _.each(requires, (amount, resource) => {
                    var key = `terminal-require-${this.room.customName}-${resource}`;

                    if(storage.store[resource] > 10000 && (terminal.store[resource] || 0) < amount) {
                        if(!(key in jobs)) {
                            jobs[key] = {
                                key: key,
                                room: this.room.customName,
                                type: 'transfer',
                                sourceId: storage.id,
                                sourcePos: storage.pos,
                                resource: resource,
                                targetId: terminal.id,
                                targetPos: terminal.pos,
                                takenBy: null,
                                amount: 0,
                            }
                        }

                        jobs[key].amount = amount - terminal.store[resource];
                    }
                    else {
                        delete jobs[key];
                    }
                })
            }

            createRefillEnergyJobs() {
                var jobs = this.state.jobs;

                this.room.getSpawns().concat(this.room.getExtensions()).forEach(/**StructureSpawn*/item => {
                    var key = `refill-${this.room.customName}-${item.id}`;

                    if(item.energy < item.energyCapacity) {
                        if(!(key in jobs)) {
                            jobs[key] = {
                                key: key,
                                room: this.room.customName,
                                type: 'refill',
                                subtype: 'spawn',
                                targetId: item.id,
                                targetPos: item.pos,
                                takenBy: null,
                            }
                        }
                    }
                    else {
                        delete jobs[key];
                    }
                });

                this.room.getTowers().forEach(/**StructureTower*/ tower => {
                    var key = `refill-${this.room.customName}-tower-${tower.id}`;

                    if(tower.energy < tower.energyCapacity) {
                        if(!(key in jobs)) {
                            jobs[key] = {
                                key: key,
                                room: this.room.customName,
                                type: 'refill',
                                subtype: 'tower',
                                targetId: tower.id,
                                targetPos: tower.pos,
                                takenBy: null,
                            }
                        }
                    }
                    else {
                        delete jobs[key];
                    }
                })
            }

            createLabTransferJobs() {
                var jobs = this.state.jobs;

                var storage = this.room.getStorage();
                var terminal = this.room.getTerminal();

                _.get(this.config, 'labs.reactions', []).forEach(reaction => {

                    reaction.load.forEach((resource, index) => {
                        var labName = reaction.labs[index];
                        var labId = this.labNameToId[labName];
                        /** @type StructureLab */
                        var lab = Game.getObjectById(labId);

                        let emptyJobKey = `labs-${labName}-empty-${lab.mineralType}`;

                        if(lab.mineralType && lab.mineralType != resource) {

                            if(!(emptyJobKey in jobs)) {

                                jobs[emptyJobKey] = {
                                    key: emptyJobKey,
                                    room: this.room.customName,
                                    type: 'transfer',
                                    sourceId: lab.id,
                                    sourcePos: lab.pos,
                                    resource: lab.mineralType,
                                    targetId: terminal.id,
                                    targetPos: terminal.pos,
                                    takenBy: null,
                                    amount: 0,
                                }
                            }

                            jobs[emptyJobKey].amount = lab.mineralAmount;
                        }
                        else {
                            delete jobs[emptyJobKey];

                            [storage, terminal].forEach(struct => {
                                var key = `labs-${labName}-withdraw-${struct.structureType}-${resource}`;
                                if (lab.mineralAmount < 2000 && struct.store[resource] > 0) {

                                    if (!(key in jobs)) {
                                        jobs[key] = {
                                            key: key,
                                            room: this.room.customName,
                                            type: 'transfer',
                                            sourceId: struct.id,
                                            sourcePos: struct.pos,
                                            resource: resource,
                                            targetId: lab.id,
                                            targetPos: lab.pos,
                                            takenBy: null,
                                            amount: 0,
                                        }
                                    }

                                    jobs[key].amount = lab.mineralCapacity - lab.mineralAmount;
                                }
                                else {
                                    delete jobs[key];
                                }
                            });
                        }
                    });

                    var outLabName = reaction.labs[2];
                    /** @type StructureLab */
                    var outLab = Game.getObjectById(this.labNameToId[outLabName]);

                    var resultResource = REACTIONS[reaction.load[0]][reaction.load[1]];

                    let emptyJobKey = `labs-${outLabName}-empty-${outLab.mineralType}`;

                    if(outLab.mineralType && outLab.mineralType != resultResource ) {
                        if(!(emptyJobKey in jobs)) {

                            jobs[emptyJobKey] = {
                                key: emptyJobKey,
                                room: this.room.customName,
                                type: 'transfer',
                                sourceId: outLab.id,
                                sourcePos: outLab.pos,
                                resource: outLab.mineralType,
                                targetId: terminal.id,
                                targetPos: terminal.pos,
                                takenBy: null,
                                amount: 0,
                            }
                        }

                        jobs[emptyJobKey].amount = outLab.mineralAmount;
                    }
                    else {
                        delete jobs[emptyJobKey];
                    }
                })
            }

            createMoveMineralToStorageJob() {
                /** @type Mineral */
                var mineral = _.first(this.room.find(FIND_MINERALS));
                var jobs = this.state.jobs;

                var target = this.room.getTerminal();
                if(!target) {
                    target = this.room.getStorage();
                }

                var container = _.first(mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: {structureType: STRUCTURE_CONTAINER}
                }));

                var key = `mineralMove-${mineral.mineralType}`;
                if(container && container.store[mineral.mineralType] > 400) {
                    if(!(key in jobs)) {
                        jobs[key] = {
                            key: key,
                            room: this.room.customName,
                            type: 'transfer',
                            sourceId: container.id,
                            sourcePos: container.pos,
                            resource: mineral.mineralType,
                            targetId: target.id,
                            targetPos: target.pos,
                            takenBy: null,
                            amount: 0,
                        }
                    }

                    jobs[key].amount = container.store[mineral.mineralType];
                }
                else {
                    delete jobs[key];
                }
            }

            createResourcePickupJobs() {
                var resources = this.room.getDroppedResources();
                var jobs = this.state.jobs;

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
                                sourceId: res.id,
                                sourcePos: res.pos,
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

            maintainPopulation(type, blueprint, priority) {
                var amount = _.get(this.config, ['creeps', type], 0);
                this.maintainPopulationAmount(type, amount, blueprint, priority);
            }

            maintainHarvesterPopulation() {
                var sources = this.room.getAllSources().filter(source => source instanceof Source);
                var minerals = this.room.getAllSources().filter(source => {
                    if(source instanceof Mineral) {
                        if(source.ticksToRegeneration) {
                            return false;
                        }

                        return source.pos.lookFor(LOOK_STRUCTURES).length > 0;
                    }
                    return false;
                });

                this.maintainPopulationAmount('harvester', sources.length, config.blueprints.colonyHarvester,
                    spawnQueue.PRIORITY_CRITICAL);

                this.maintainPopulationAmount('mineralHarvester', minerals.length, config.blueprints.colonyHarvesterMineral,
                    spawnQueue.PRIORITY_NORMAL);
            }

            maintainPopulationAmount(type, amount, blueprint, priority) {
                if(amount <= 0) {
                    return;
                }

                var spawnTime = blueprint.body.length * CREEP_SPAWN_TIME;

                var creeps = this.findCreeps(blueprint.role).filter(c => {
                    if(c.spawning) {
                        return true;
                    }

                    return c.ticksToLive > spawnTime * 0.75
                });

                if(creeps.length < amount) {

                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(priority, this.room, this.getCreepName(type),
                        blueprint.body, memo, null, this.config.spawnRooms);
                }
            }

            getCreepName(type) {
                return this.type+'_'+this.roomName+'_'+type+'_';
            }

            autobuildExtensions() {
                var flags = _.groupBy(Game.flags, 'pos.roomName')[this.room.name];
                if(!_.first(flags.filter(/**Flag*/f => f.color == COLOR_BROWN && f.secondaryColor == COLOR_YELLOW))) {
                    return;
                }

                // this.debug('autobuild flag set!');
            }
        }
    }
})();

profiler.registerClass(module.exports.handler, 'ColonyRoomHandler');