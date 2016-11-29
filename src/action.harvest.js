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
        tryHarvestDroppedSource: function (creep, minAmount) {
            var source;

            source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.amount > (creep.carryCapacity * 0.75)
            });

            if(!source) {
                source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: r => r.amount > 30
                });
            }

            if(source) {
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
            var source = module.exports.findStorageToHarvest(creep, options);

            if(source) {
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
                        return _.sum(struct.store) > (options.reserve + creep.carryCapacity)
                    }

                    return true;
                }
            });

            return source;
        },

        tryTransferToSpawn: function(creep) {
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
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                /**
                 *
                 * @param {StructureTower} structure
                 */
                filter: structure => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity}
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
            options = _.defaults(options || {}, {
                maxRange: 0,
                structures: null,
                allowContainers: true,
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
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
                return true;
            }

            return false;
        },

        run: function (creep) {
            var source;
            if (creep.memory.energySource) {
                var desirableSource = Game.getObjectById(creep.memory.energySource);
                if (desirableSource) {
                    source = desirableSource;
                }
            }

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