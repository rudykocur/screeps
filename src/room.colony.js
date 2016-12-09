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

                _.defaults(this.state, {jobs: {}, storageId: null, terminalId: null});
            }

            process() {
                super.process();

                this.prepareJobBoard();

                this.maintainPopulation('mover', config.blueprints.colonyMover, spawnQueue.PRIORITY_CRITICAL);
                this.maintainPopulation('builder', config.blueprints.colonyBuilder, spawnQueue.PRIORITY_NORMAL);
                this.maintainPopulation('upgrader', config.blueprints.colonyUpgrader, spawnQueue.PRIORITY_LOW);
            }

            prepareJobBoard() {
                var storage = this.room.getStorage();
                var terminal = this.room.getTerminal();

                var sources = this.room.find(FIND_SOURCES);
                var minerals = this.room.find(FIND_MINERALS, {
                    filter: /** @param {Mineral} m */ m => _.first(this.room.lookForAt(LOOK_STRUCTURES, m.pos))
                });
                var jobs = this.state.jobs;

                sources.forEach(s => {
                    var key = 'mining-' + s.id;

                    if(!(key in jobs)) {
                        jobs[key] = {
                            type: 'harvest',
                            subtype: 'energy',
                            sourceId: s.id,
                            sourcePos: s.pos,
                            takenBy: false,
                        };
                    }
                });

                minerals.forEach(m => {
                    var key = 'mining-' + m.id;

                    if(!(key in jobs)) {
                        jobs[key] = {
                            type: 'harvest',
                            subtype: 'mineral',
                            sourceId: m.id,
                            sourcePos: m.pos,
                            takenBy: false,
                        };
                    }
                });

                if(storage && terminal) {

                    var reserves = _.get(this.config, 'minerals.reserve', {});

                    _.each(storage.store, (amount, resource) => {
                        var key = `market-${this.room.customName}-${resource}`;

                        if(reserves[resource] > 0 && amount > reserves[resource]) {
                            if(!(key in jobs)) {
                                jobs[key] = {
                                    type: 'transfer',
                                    sourceId: storage.id,
                                    sourcePos: storage.pos,
                                    resource: resource,
                                    targetId: terminal.id,
                                    targetPos: terminal.pos,
                                    takenBy: false,
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