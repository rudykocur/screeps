var profiler = require('./profiler-impl');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logger');
var roomHandlers = require('./room.handlers');

var RoomHandler = require('./room.handlers').RoomHandler;

var spawnQueue = require('./spawnQueue');

class ColonyRoomHandler extends RoomHandler {
    constructor(roomName, state, config) {
        super(roomName, state, config);

        this.type = 'colony';

        _.defaults(this.state, {});

        this.labNameToId = {};
        _.each(_.get(config, 'labs.names', {}), (labName, labId) => {
            this.labNameToId[labName] = labId;
        });
    }


    processMarket(orders) {
        if(this.config.autobuyMinerals) {
            this.autobuyMinerals(orders);
        }

        var autosell = _.get(this.config, 'terminal.autosell', []);
        if(autosell.length > 0) {
            this.autosellMinerals(autosell, orders);
        }
    }

    process() {
        super.process();

        this.runReactions();

        this.maintainHarvesterPopulation();
        this.maintainMovers();
        this.maintainPopulation('builder', config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
        this.maintainUpgraders();
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

    maintainUpgraders() {
        var amount = _.get(this.config, ['creeps', 'upgrader'], 0);
        if(this.room.controller.level == 8) {
            amount = 1;
        }

        this.maintainPopulationAmount('upgrader', amount, config.blueprints.colonyUpgrader, spawnQueue.PRIORITY_LOW);
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

        if(Game.time % 5 == 3) {
            this.createRefillEnergyJobs();
        }

        var storage = this.room.getStorage();
        var terminal = this.room.getTerminal();

        if(storage && terminal) {
            // if(Game.time % 10 != 3) {
            //     this.processStorageSurplusJobs(storage, terminal);
            // }

            // if(Game.time % 10 == 4) {
            this.createTerminalToStorageJobs(storage, terminal);
            // }

            this.createTerminalRequirementsJobs(storage, terminal);
        }

        this.createLabTransferJobs();

        if(Game.time % 15 == 12) {
            this.createMoveMineralToStorageJob();
        }
    }

    // processStorageSurplusJobs(storage, terminal) {
    //
    //     var reserves = _.get(this.config, 'minerals.reserve', {});
    //     var jobs = this.state.jobs;
    //
    //     _.each(storage.store, (amount, resource) => {
    //         var key = `market-${this.room.customName}-${resource}`;
    //
    //         if (reserves[resource] >= 0 && amount > reserves[resource]) {
    //             if (!(key in jobs)) {
    //                 jobs[key] = {
    //                     key: key,
    //                     room: this.room.customName,
    //                     type: 'transfer',
    //                     sourceId: storage.id,
    //                     sourcePos: storage.pos,
    //                     resource: resource,
    //                     targetId: terminal.id,
    //                     targetPos: terminal.pos,
    //                     takenBy: null,
    //                     amount: 0,
    //                 }
    //             }
    //
    //             jobs[key].amount = amount - reserves[resource];
    //         }
    //         else {
    //             delete jobs[key];
    //         }
    //     });
    // }


    createResourcePickupJobs() {
        super.createResourcePickupJobs();

        var jobs = this.state.jobs;
        var storage = this.room.getStorage();

        if(storage) {
            this.room.getContainers().forEach(/**StructureContainer*/container => {
                var key = `move-container-${this.room.customName}-${container.id}`;

                if (container.store[RESOURCE_ENERGY] > 400) {
                    if (!(key in jobs)) {
                        jobs[key] = {
                            key: key,
                            room: this.room.customName,
                            type: 'pickup',
                            subtype: 'container',
                            resource: RESOURCE_ENERGY,
                            sourceId: container.id,
                            sourcePos: container.pos,
                            targetId: storage.id,
                            targetPos: storage.pos,
                            reservations: {},
                            amount: 0,
                        }
                    }

                    jobs[key].amount = container.store[RESOURCE_ENERGY];
                }
                else {
                    delete jobs[key];
                }
            });
        }
    }

    createTerminalToStorageJobs(storage, terminal) {

        var requires = _.get(this.config, 'terminal.require', {});

        var jobs = this.state.jobs;

        _.each(terminal.store, (amount, resource) => {
            var key = `terminal-withdraw-${this.room.customName}-${resource}`;

            var availableAmount = amount - (requires[resource] || 0);

            if(availableAmount > 0) {
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
        var reserves = _.get(this.config, 'minerals.reserve', {});
        var jobs = this.state.jobs;

        _.each(requires, (amount, resource) => {
            var key = `terminal-require-${this.room.customName}-${resource}`;

            var available = storage.store[resource] - _.get(reserves, resource, 10000);

            if(available > 0 && (terminal.store[resource] || 0) < amount) {
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

                jobs[key].amount = Math.max(0, Math.min(available, amount - terminal.store[resource]));
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
                        jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, storage, lab.mineralType) ;
                    }

                    jobs[emptyJobKey].amount = lab.mineralAmount;
                }
                else {
                    delete jobs[emptyJobKey];

                    [storage, terminal].forEach(struct => {
                        var key = `labs-${labName}-withdraw-${struct.structureType}-${resource}`;
                        if (lab.mineralAmount < 2000 && struct.store[resource] > 0) {

                            if (!(key in jobs)) {
                                jobs[key] = this._getJobTransferDict(key, struct, lab, resource);
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
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, outLab, storage, outLab.mineralType);
                }

                jobs[emptyJobKey].amount = outLab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];
            }
        });

        _.each(_.get(this.config, 'labs.boost', {}), (resource, labName) => {
            /** @type StructureLab */
            var lab = Game.getObjectById(this.labNameToId[labName]);

            let emptyJobKey = `labs-${labName}-empty-${lab.mineralType}`;
            let loadEnergyKey = `labs-${labName}-load-energy`;

            if(lab.mineralType && lab.mineralType != resource) {
                if(!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, storage, lab.mineralType);
                }

                jobs[emptyJobKey].amount = lab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];

                let key = `labs-${labName}-load-boost-${resource}`;

                if(lab.mineralAmount < lab.mineralCapacity && storage.store[resource] > 0) {
                    if (!(key in jobs)) {
                        jobs[key] = this._getJobTransferDict(key, storage, lab, resource);
                    }

                    jobs[key].amount = lab.mineralCapacity - lab.mineralAmount;
                }
                else {
                    delete jobs[key];
                }
            }

            if(lab.energy < lab.energyCapacity) {
                if (!(loadEnergyKey in jobs)) {
                    jobs[loadEnergyKey] = this._getJobTransferDict(loadEnergyKey, storage, lab, RESOURCE_ENERGY);
                }

                jobs[loadEnergyKey].amount = lab.energyCapacity - lab.energy;
            }
            else {
                delete jobs[loadEnergyKey];
            }
        })
    }

    createMoveMineralToStorageJob() {
        /** @type Mineral */
        var mineral = _.first(this.room.find(FIND_MINERALS));
        var jobs = this.state.jobs;

        let storage = this.room.getStorage();

        var container = _.first(mineral.pos.findInRange(this.room.getContainers(), 1));

        var key = `mineralMove-${mineral.mineralType}`;
        if(container && container.store[mineral.mineralType] > 400) {
            if(!(key in jobs)) {
                jobs[key] = this._getJobTransferDict(key, container, storage, mineral.mineralType);
            }

            jobs[key].amount = container.store[mineral.mineralType];
        }
        else {
            delete jobs[key];
        }
    }

    autobuyMinerals(orders) {
        var minerals = [RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM,
            RESOURCE_UTRIUM, RESOURCE_CATALYST];

        var storage = this.room.getStorage();
        var terminal = this.room.getTerminal();

        var sources = [storage, terminal];

        minerals.forEach(mineral => {
            var total = _.sum(sources, /**StructureStorage*/s => s.store[mineral] || 0);

            var needed = 10000 - total;

            if(needed > 0) {
                let maxPrice = config.market.minerals[mineral].buyPriceMax;
                let mineralOrders = _.filter(orders, o => {
                    if(o.type != ORDER_SELL) {
                        return false;
                    }
                    if(!o.roomName) {
                        return false;
                    }
                    if(o.resourceType != mineral) {
                        return false;
                    }
                    if(o.amount < needed) {
                        return false;
                    }
                    if(o.price > maxPrice) {
                        return false;
                    }

                    let distance = Game.map.getRoomLinearDistance(this.room.name, o.roomName, true);
                    return distance < config.market.maxTradeRange;
                });

                let closestOrder = _.first(_.sortBy(mineralOrders, o => {
                    return Game.map.getRoomLinearDistance(this.room.name, o.roomName, true)
                }));

                if(closestOrder) {
                    this.debug('Would execute order', mineral, '::', JSON.stringify(closestOrder));
                }
                else {
                    this.debug('No sell orders for mineral', mineral);
                }
            }
        });
    }

    autosellMinerals(minerals, orders) {
        /** @type StructureTerminal */
        var terminal = this.room.getTerminal();

        minerals.forEach(resource => {
            if(terminal.store[resource] > 2000) {
                let minPrice = config.market.minerals[resource].sellPriceMin;

                let mineralOrders = _.filter(orders, o => {
                    if(o.type != ORDER_BUY) {
                        return false;
                    }
                    if(!o.roomName) {
                        return false;
                    }
                    if(o.resourceType != resource) {
                        return false;
                    }
                    if(o.amount < 2000) {
                        return false;
                    }
                    if(o.price < minPrice) {
                        return false;
                    }

                    let distance = Game.map.getRoomLinearDistance(this.room.name, o.roomName, true);
                    return distance < config.market.maxTradeRange;
                });

                let closestOrder = _.first(_.sortBy(mineralOrders, o => {
                    return Game.map.getRoomLinearDistance(this.room.name, o.roomName, true)
                }));

                if(closestOrder) {

                    let amount = closestOrder.amount;
                    while(amount > 0) {
                        if(terminal.store.energy >= Game.market.calcTransactionCost(amount, this.room.name, closestOrder.roomName)) {
                            let result = Game.market.deal(closestOrder.id, amount, this.room.name);
                            if (result == OK) {
                                this.info('Sold', resource, 'x' + amount, 'units. OrderID:', closestOrder.id);
                                break;
                            }
                        }

                        amount -= 2000;
                    }
                }
                else {
                    // this.debug('Nowhere to sell', resource);
                }
            }
        })
    }

    _getJobTransferDict(key, source, target, resource) {
        return {
            key: key,
            room: this.room.customName,
            type: 'transfer',
            sourceId: source.id,
            sourcePos: source.pos,
            resource: resource,
            targetId: target.id,
            targetPos: target.pos,
            takenBy: null,
            amount: 0,
        }
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

        if(!this.config.noMinerals) {
            this.maintainPopulationAmount('mineralHarvester', minerals.length, config.blueprints.colonyHarvesterMineral,
                spawnQueue.PRIORITY_NORMAL);
        }
    }

    maintainPopulationAmount(type, amount, blueprint, priority) {
        if(amount <= 0) {
            return;
        }

        var spawnTime = blueprint.body.length * CREEP_SPAWN_TIME;

        var creeps = this.findCreeps(blueprint.role);

        creeps = creeps.filter(c => {
            if(c.spawning) {
                return true;
            }

            let creepSpawnTime = c.memory.spawnTime? c.memory.spawnTime : spawnTime;

            return c.ticksToLive > creepSpawnTime * 0.75
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
}


module.exports = (function() {
    return {
        handler: ColonyRoomHandler
    }
})();

profiler.registerClass(ColonyRoomHandler, 'ColonyRoomHandler');