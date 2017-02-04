var profiler = require('./profiler-impl');
var _ = require('lodash');

var config = require('./config');
var logger = require('./logger');
var F = logger.fmt;
var roomHandlers = require('./room.handlers');

var RoomHandler = require('./room.handlers').RoomHandler;

var spawnQueue = require('./spawnQueue');
var watchQueue = require('./watchQueue');

var TerminalToStorageJobGenerator = require('./jobs.terminalToStorage').TerminalToStorageJobGenerator;
var StorageToTerminalJobGenerator = require('./jobs.storageToTerminal').StorageToTerminalJobGenerator;
var ContainerToStorageJobGenerator = require('./jobs.containerToStorage').ContainerToStorageJobGenerator;
var SpawnRefillJobGenerator = require('./jobs.spawnRefill').SpawnRefillJobGenerator;
var MineralToStorageJobGenerator = require('./jobs.mineralToStorage').MineralToStorageJobGenerator;
var LabsJobGenerator = require('./jobs.labs').LabsJobGenerator;
var LoadNukeJobGenerator = require('./jobs.loadNuke').LoadNukeJobGenerator;
var LinkToStorageJobGenerator = require('./jobs.linkToStorage').LinkToStorageJobGenerator;

class ReactionConfig {
    constructor() {
        this.labs = [];
        this.load = [];
        this.amount = 0;
    }
}

class ColonyRoomHandler extends RoomHandler {
    constructor(roomName, state, config) {
        super(roomName, state, config);

        this.type = 'colony';

        _.defaults(this.state, {
            constructionProgressLeft: 0,
            observer: {},
            lab: {
                currentReaction: null,
                target: null,
                batchProgress: null,
            },
        });

        this.jobGenerators.push(
            new TerminalToStorageJobGenerator(this),
            new StorageToTerminalJobGenerator(this),
            new ContainerToStorageJobGenerator(this),
            new SpawnRefillJobGenerator(this),
            new MineralToStorageJobGenerator(this),
            new LabsJobGenerator(this),
            new LoadNukeJobGenerator(this),
            new LinkToStorageJobGenerator(this)
        );

        this.labNameToId = {};
        _.each(_.get(config, 'labs.names', {}), (labName, labId) => {
            this.labNameToId[labName] = labId;
        });
    }

    /**
     * @param {Array<RoomHandler>} otherRooms
     */
    processRoomTransfers(otherRooms) {
        var wanted = _.defaults(_.get(this.config, 'minerals.wants', {}), {
            [RESOURCE_ENERGY]: 100000,
        });

        this.importWantedResources(otherRooms, wanted);
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

        this.runLabProcessing();
        this.runLinks();

        this.maintainHarvesterPopulation();
        this.maintainMovers();
        this.maintainBuilders();
        this.maintainUpgraders();
        this.maintainPopulation('settler', config.blueprints.outpostSettler, spawnQueue.PRIORITY_NORMAL);
        this.maintainPopulation('transfer', config.blueprints.colonyTransfer, spawnQueue.PRIORITY_HIGH);

        this.observeRoom();

        if(Game.time % 100 == 0) {
            this.autobuildConstructionSites();
        }
    }

    observeRoom() {
        let observer = this.room.getObserver();

        if(observer) {
            let room = watchQueue.getNextRoom();
            if(observer.observeRoom(room) == OK) {
                watchQueue.registerRoomVisibleNextTick(room);
            }
        }
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

    maintainBuilders() {
        if(Game.time % 30 == 0) {
            var sites = _.groupBy(Game.constructionSites, 'pos.roomName')[this.room.name];
            this.state.constructionProgressLeft = _.sum(sites, /**ConstructionSite*/ s => s.progressTotal - s.progress);
        }

        var amount = _.get(this.config, ['creeps', 'builder'], 0);

        var expectedBuildersAmount = Math.floor(this.state.constructionProgressLeft / 20000);
        if(this.state.constructionProgressLeft > 0) {
            expectedBuildersAmount = Math.max(expectedBuildersAmount, 1);
        }
        
        if(expectedBuildersAmount > amount) {
            amount = Math.min(expectedBuildersAmount, 4); // spawn up to 3 builders if there is lot to build
        }

        this.maintainPopulationAmount('builder', amount, config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
    }

    /**
     * Return lab which can boost given part, giving desired result. See {BOOSTS} constant for available results
     * @param partType
     * @param wantedEffect
     * @returns {StructureLab}
     */
    getLabToBoost(partType, wantedEffect) {
        var resources = [];
        _.each(BOOSTS[partType], (effects, resource) => {
            if(effects[wantedEffect]) {
                resources.push(resource);
            }
        });

        var boosts = _.get(this.config, 'labs.boost', {});
        for(let labName of _.keys(boosts)) {
            let resource = boosts[labName];

            let lab = Game.getObjectById(this.labNameToId[labName]);
            if (resources.indexOf(resource) >= 0 && lab.mineralAmount > 0) {
                return lab;
            }
        }

        return null;
    }

    importWantedResources(otherRooms, wanted) {
        var terminal = this.room.getTerminal();

        for(let resource of _.keys(wanted)) {
            let wantAmount = wanted[resource];

            let hasResourceTotal = this.getResourceTotal(resource);
            let terminalAvailable = this.room.getTerminal().storeCapacity - _.sum(this.room.getTerminal().store);

            let threshold = wantAmount * 0.1;

            if(hasResourceTotal + threshold < wantAmount) {
                let needed = wantAmount - hasResourceTotal;
                let handlers = _.sortByOrder(otherRooms, /**RoomHandler*/handler => handler.getResourceTotal(resource), 'desc');

                for(let /**RoomHandler*/handler of handlers) {
                    let toTransfer = Math.min(100000, needed, handler.room.terminal.store[resource], terminalAvailable);

                    if(handler.room.terminal.send(resource, toTransfer, this.room.name) == OK) {
                        needed -= toTransfer;
                        terminalAvailable -= toTransfer;
                        this.info(F.green(`Transferred ${toTransfer}x ${resource} from ${handler}`));
                    }

                    if(needed <=0) {
                        break;
                    }
                    if(terminalAvailable <= 0) {
                        this.debug('No space left in terminal. Giving up for now');
                        break;
                    }
                }
            }

            if(terminalAvailable <= 0) {
                break;
            }
        }
    }

    runLabProcessing() {
        if(Game.time % 3 == 0) {
            this.updateLabsTarget();
        }

        let target = this.state.lab;
        let config = _.get(this.config, 'labs.produce', null);
        let boostLabs = _.get(this.config, 'labs.boost', {});

        if(!target || !target.currentReaction) {
            return;
        }

        let labIn1 = Game.getObjectById(this.labNameToId[config.input[0]]),
            labIn2 = Game.getObjectById(this.labNameToId[config.input[1]]);

        let outLabs = _.without(config.output, ..._.keys(boostLabs));
        outLabs.forEach(labName => {
            /** @type StructureLab */
            var outLab = Game.getObjectById(this.labNameToId[labName]);

            let result = outLab.runReaction(labIn1, labIn2);
            if(result == OK) {
                target.batchProgress += 5;
            }
            else if(result != ERR_FULL && result != ERR_NOT_ENOUGH_RESOURCES &&
                result != ERR_TIRED && result != ERR_INVALID_ARGS) {
                logger.mail(this.error(`Unable to run reaction on ${labName}: ${result}`));
            }
        });

    }

    updateLabsTarget() {
        let batchSize = 4000;
        let target = _.get(this.config, 'labs.produce');

        if(!target) {
            this.state.lab = {
                currentReaction: null,
                target: null,
                batchProgress: null
            };
            return;
        }

        let terminal = this.room.getTerminal();

        let finalResult = target.result;

        if(!finalResult || (terminal.store[finalResult] || 0) > target.amount) {
            this.state.lab = {
                currentReaction: null,
                target: null,
                batchProgress: null,
            };
            return;
        }

        if(finalResult == this.state.lab.target && this.state.lab.batchProgress < batchSize) {
            return;
        }

        let currentReaction = this.getNextReaction(finalResult, batchSize, terminal.store);

        this.debug(`New lab target for ${finalResult} is: ${currentReaction}`);

        this.state.lab = {
            currentReaction: currentReaction,
            currentResult: REACTIONS[currentReaction[0]][currentReaction[1]],
            target: finalResult,
            batchProgress: 0,
        };
    }

    getNextReaction(resource, amount, store) {

        store = _.omit(store, resource);

        if((store[resource] || 0) > amount) {
            return null;
        }

        let toCheck = [REACTIONS_REVERSE[resource]];

        while(toCheck.length > 0) {
            let reaction = toCheck.pop();

            if((store[reaction[0]] || 0) < amount && RESOURCES_BASE.indexOf(reaction[0]) < 0) {
                toCheck.push(REACTIONS_REVERSE[reaction[0]]);
                continue;
            }

            if((store[reaction[1]] || 0) < amount && RESOURCES_BASE.indexOf(reaction[1]) < 0) {
                toCheck.push(REACTIONS_REVERSE[reaction[1]]);
                continue;
            }

            return reaction;
        }
    }

    runLinks() {
        if(Game.time % 10 != 0) {
            return;
        }

        let storageLink = this.room.getLinkForStorage();

        if(storageLink) {
            this.room.find(FIND_SOURCES).forEach(source => {
                /** @type StructureLink */
                let link = this.room.getLinkForSource(source.id);

                if(link) {
                    link.transferEnergy(storageLink);
                }
            })
        }
    }

    autobuyMinerals(orders) {
        let defaultMinerals = [RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_LEMERGIUM,
            RESOURCE_UTRIUM, RESOURCE_CATALYST];
        var minerals = _.get(this.config, 'terminal.autobuy', defaultMinerals);

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
                    if(o.price > maxPrice) {
                        return false;
                    }

                    let distance = Game.map.getRoomLinearDistance(this.room.name, o.roomName, true);
                    return distance <= config.market.maxTradeRange;
                });

                let closestOrder = _.first(_.sortBy(mineralOrders, o => o.price));

                if(closestOrder) {
                    let toBuy = Math.min(closestOrder.amount, needed);
                    let result = this._completeDeal(terminal, closestOrder, toBuy);
                    if(result) {
                        let loss = result * closestOrder.price;
                        this.info(F.green(`Bought ${mineral} x${result} units for ${loss} credits (${closestOrder.price}/u). OrderID: ${closestOrder.id}`));
                    }
                }
            }
        });
    }

    autosellMinerals(minerals, orders) {
        /** @type StructureTerminal */
        var terminal = this.room.getTerminal();

        let extractor = this.room.getExtractor();

        minerals.forEach(resource => {
            if(extractor.resource == resource && this.getResourceTotal(resource) < 50000) {
                return;
            }

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

                let closestOrder = _.first(_.sortByOrder(mineralOrders, o => o.price, 'desc'));

                if(closestOrder) {
                    let result = this._completeDeal(terminal, closestOrder);
                    var gain = result * closestOrder.price;
                    if(result) {
                        this.info(F.green(`Sold ${resource} x${result} units for ${gain} credits (${closestOrder.price}/u). OrderID: ${closestOrder.id}`));
                    }
                }
            }
        })
    }

    autobuildConstructionSites() {
        this.placeConstructionSites(COLOR_PURPLE, COLOR_YELLOW, STRUCTURE_EXTENSION);
        this.placeConstructionSites(COLOR_PURPLE, COLOR_RED, STRUCTURE_TOWER);
        this.placeConstructionSites(COLOR_PURPLE, COLOR_CYAN, STRUCTURE_TERMINAL);
        this.placeConstructionSites(COLOR_PURPLE, COLOR_BLUE, STRUCTURE_EXTRACTOR);
    }

    placeConstructionSites(flagColor, flagSecondaryColor, structureType) {
        var flags = _.filter(Game.flags, /**Flag*/ f => {
            return f.pos.roomName == this.room.name && f.color == flagColor && f.secondaryColor == flagSecondaryColor;
        });

        flags.forEach(/**Flag*/ f => {
            if(this.room.createConstructionSite(f.pos.x, f.pos.y, structureType) == OK) {
                f.remove();
            }
        })
    }

    _completeDeal(terminal, order, maxAmountToBuy) {
        let amount = maxAmountToBuy || order.amount;
        while(amount > 0) {
            if(terminal.store.energy >= Game.market.calcTransactionCost(amount, this.room.name, order.roomName)) {
                let result = Game.market.deal(order.id, amount, this.room.name);
                if (result == OK) {
                    return amount;
                }
            }

            amount -= 2000;
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

        let harvesters = sources.length;
        let linkHarvesters = 0;

        if(this.room.getLinkForStorage()) {
            harvesters = sources.filter(s => this.room.getLinkForSource(s.id) === undefined).length;
            linkHarvesters = sources.length - harvesters;
        }

        this.maintainPopulationAmount('harvester', harvesters, config.blueprints.colonyHarvester,
            spawnQueue.PRIORITY_CRITICAL);

        this.maintainPopulationAmount('harvesterLink', linkHarvesters, config.blueprints.colonyHarvesterLink,
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