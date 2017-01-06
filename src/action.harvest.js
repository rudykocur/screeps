var profiler = require('./profiler-impl');
var _ = require('lodash');

module.exports = (function() {

    return {
        tryHarvestSource: function tryHarvestSource(creep, options) {
            options = _.defaults(options || {}, {structures: false});

            var source;

            var dropped = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
            if(dropped.length > 0) {
                source = dropped[0];
            }

            if(!source) {
                source = creep.pos.findClosestByRange(FIND_SOURCES, {
                    filter: function(struct) {
                        if(options.structures && options.structures.indexOf(struct.id) < 0) {
                            return false;
                        }

                        return true;
                    }
                });
            }

            if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        },

        /**
         *
         * @param {Creep} creep
         */
        tryHarvestDroppedSource: function (creep) {

            let sources = creep.workRoomHandler.searchJobs({type: 'pickup', freeReserve: 50});
            let job = _.first(_.sortBy(sources.filter(s => s.resource == RESOURCE_ENERGY), s=> s.amount*-1));

            if(job) {
                let source = Game.getObjectById(job.sourceId);
                if(!source) {
                    return false;
                }

                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return true;
            }

            return false;
        },

        /**
         * @param {Creep} creep
         * @param {Object} options
         */
        tryHarvestStorage: function (creep, options) {
            options = _.defaults(options || {}, {
                resource: RESOURCE_ENERGY,
            });

            var source = module.exports.findStorageToHarvest(creep, options);

            if(source) {
                if(creep.withdraw(source, options.resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return true;
            }

            return false;
        },

        findStorageToHarvest: function(creep, options) {
            options = _.defaults(options || {}, {
                reserve: 50,
                structures: false,
                types: [STRUCTURE_CONTAINER, STRUCTURE_STORAGE],
                resource: RESOURCE_ENERGY,
            });

            var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {

                /**
                 * @param {StructureContainer} struct
                 */
                filter: function(struct) {
                    if(options.structures && options.structures.indexOf(struct.id) < 0) {
                        return false;
                    }

                    if(options.types.indexOf(struct.structureType) < 0) {
                        return false;
                    }

                    if(options.reserve) {
                        return struct.store[options.resource] > (options.reserve + creep.carryCapacity)
                    }

                    return struct.store[options.resource] > 0;
                }
            });

            return source;
        },

        tryTransferToSpawn: function(creep) {
            if(_.sum(creep.carry) == 0) {return false;}

            var target = module.exports.findSpawnToTransfer(creep);

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        findSpawnToTransfer: function(creep) {
            return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: structure => {
                        return [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].indexOf(structure.structureType) >= 0 &&
                            structure.energy < structure.energyCapacity}
                })
        },

        tryTransferToTower: function(creep) {
            if(_.sum(creep.carry) == 0) {return false;}

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                /**
                 *
                 * @param {StructureTower} structure
                 */
                filter: structure => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.75}
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        /**
         * @param {Creep} creep
         * @param {Object} options
         */
        tryTransferToStorage: function(creep, options) {
            if(_.sum(creep.carry) == 0) {return false;}

            options = _.defaults(options || {}, {
                maxRange: 0,
                structures: null,
                allowContainers: true,
                resource: RESOURCE_ENERGY,
            });

            var target;

            if(options.allowContainers) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    /**
                     * @param {StructureStorage} struct
                     */
                    filter: struct => {
                        if (options.structures && options.structures.indexOf(struct.id) < 0) {
                            return false;
                        }
                        if (struct.structureType != STRUCTURE_CONTAINER) {
                            return false
                        }
                        if (options.maxRange && creep.pos.getRangeTo(struct.pos) > options.maxRange) {
                            return false;
                        }

                        return _.sum(struct.store) < struct.storeCapacity;
                    }
                });
            }

            if(!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: struct => {
                        if(options.structures && options.structures.indexOf(struct.id) < 0) {
                            return false;
                        }
                        if (struct.structureType != STRUCTURE_STORAGE) {
                            return false
                        }
                        if (options.maxRange && creep.pos.getRangeTo(struct.pos) > options.maxRange) {
                            return false;
                        }

                        return _.sum(struct.store) < struct.storeCapacity;
                    }
              })
            }

            if(target) {
                if(creep.transfer(target, options.resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        run: function (creep) {
            var source;

            source = Game.getObjectById(creep.memory.energySource);

            if(!source) {
                source = creep.pos.findClosestByRange(FIND_SOURCES);
            }

            if (source instanceof Structure) {
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

            } else {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

            }
        }
    }
})();

profiler.registerObject(module.exports, 'action-harvest');