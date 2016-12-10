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
            }

            process() {
                super.process();

                this.maintainPopulation('mover', config.blueprints.colonyMover, spawnQueue.PRIORITY_CRITICAL);
                this.maintainPopulation('builder', config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
                this.maintainPopulation('upgrader', config.blueprints.colonyUpgrader, spawnQueue.PRIORITY_LOW);
            }

            prepareJobBoard() {
                super.prepareJobBoard();

                var storage = this.room.getStorage();
                var terminal = this.room.getTerminal();

                if(storage && terminal) {
                    this.processStorageSurplusJobs(storage, terminal);
                    this.createTerminalToStorageJobs(storage, terminal);
                    this.createTerminalRequirementsJobs(storage, terminal);
                }
            }

            processStorageSurplusJobs(storage, terminal) {
                var reserves = _.get(this.config, 'minerals.reserve', {});
                var jobs = this.state.jobs;

                _.each(storage.store, (amount, resource) => {
                    var key = `market-${this.room.customName}-${resource}`;

                    if (reserves[resource] > 0 && amount > reserves[resource] + 1000) {
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
                var jobs = this.state.jobs;

                _.each(terminal.store, (amount, resource) => {
                    var key = `terminal-withdraw-${this.room.customName}-${resource}`;

                    if(amount > 0 && (!reserves[resource] || storage.store[resource] < reserves[resource])) {
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

                        jobs[key].amount = amount;
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

                    if(storage.store[resource] > 10000) {
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

                        jobs[key].amount = amount;
                    }
                    else {
                        delete jobs[key];
                    }
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