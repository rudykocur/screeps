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

                this.runReactions();

                this.maintainPopulation('mover', config.blueprints.colonyMover, spawnQueue.PRIORITY_CRITICAL);
                this.maintainPopulation('builder', config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
                this.maintainPopulation('upgrader', config.blueprints.colonyUpgrader, spawnQueue.PRIORITY_LOW);
            }

            runReactions() {
                _.get(this.config, 'labs.reactions', []).forEach(reaction => {
                    let [in1, in2, out] = reaction.labs;
                    let [in1Resource, in2Resouce] = reaction.load;

                    in1 = Game.getObjectById(this.labNameToId[in1]);
                    in2 = Game.getObjectById(this.labNameToId[in2]);
                    out = Game.getObjectById(this.labNameToId[out]);

                    if(out.cooldown == 0) {
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
            }

            processStorageSurplusJobs(storage, terminal) {
                var reserves = _.get(this.config, 'minerals.reserve', {});
                var jobs = this.state.jobs;

                _.each(storage.store, (amount, resource) => {
                    var key = `market-${this.room.customName}-${resource}`;

                    if (reserves[resource] > 0 && amount > reserves[resource]) {
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
                                logger.error('Lab contains invalid resource !!!!', lab);
                                jobs[emptyJobKey] = {
                                    key: emptyJobKey,
                                    room: this.room.customName,
                                    type: 'transfer',
                                    sourceId: lab.id,
                                    sourcePos: lab.pos,
                                    resource: lab.mineralType,
                                    targetId: storage.id,
                                    targetPos: storage.pos,
                                    takenBy: null,
                                    amount: 0,
                                }
                            }

                            jobs[emptyJobKey].amount = lab.mineralAmount;
                        }
                        else {
                            delete jobs[emptyJobKey];

                            if (lab.mineralAmount < 2000) {

                                [storage, terminal].forEach(struct => {
                                    var key = `labs-${labName}-withdraw-${struct.structureType}-${resource}`;
                                    if (struct.store[resource] > 20000) {

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
                        }
                    });

                })
            }

            maintainPopulation(type, blueprint, priority) {
                if(!this.config.creeps || !this.config.creeps[type]) {
                    return;
                }

                var creeps = this.findCreeps(blueprint.role);

                if(creeps.length < this.config.creeps[type]) {
                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(priority, this.room, this.getCreepName(type),
                        blueprint.body, memo);
                }
            }

            getCreepName(type) {
                return 'colony_'+this.roomName+'_'+type+'_';
            }
        }
    }
})();

profiler.registerClass(module.exports.handler, 'ColonyRoomHandler');