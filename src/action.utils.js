const profiler = require('./profiler-impl');
const _ = require('lodash');
const cache = require('./cache');

module.exports = (function() {
    function routeWithAvoid(roomName, matrix) {
        var allFlags = _.groupBy(Game.flags, 'room.name')[roomName];
        var blockFlags = _.filter(allFlags, {color: COLOR_GREY});

        _.each(blockFlags, function(flag) {
            matrix.set(flag.pos.x, flag.pos.y, 255);
        });
    }

    return {
        shouldHarvestEnergy:  function(creep, minEnergy, resource) {
            minEnergy = minEnergy || 0;
            resource = resource || RESOURCE_ENERGY;

            var carry = _.sum(creep.carry);

            if(creep.carryCapacity == 0) {return false;}

            if(!creep.memory.harvesting && carry == 0) {
                creep.memory.harvesting = true;
            }
            if(creep.memory.harvesting && carry == creep.carryCapacity) {
                creep.memory.harvesting = false;
            }

            return creep.memory.harvesting;
        },

        tryDespawn: function(creep) {
            if(creep.memory.despawn) {
                var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

                if(spawn) {
                    if(!creep.pos.isNearTo(spawn)) {
                        creep.moveTo(spawn);
                    }

                    spawn.recycleCreep(creep);
                    return true;
                }
            }

            return false;
        },

        /**
         * @param {Creep} creep
         * @param {String} targetRoom
         */
        tryChangeRoom: function(creep, targetRoom, via) {

            if(creep.pos.roomName != targetRoom) {
                var flag = _.first(_.filter(Game.flags, /**Flag*/f=> f.color == COLOR_ORANGE && f.pos.roomName == targetRoom));

                if(flag) {
                    let path = cache.getPath(creep.pos, flag.pos, () => {
                        return creep.pos.findPathTo(flag.pos, {
                            costCallback: module.exports.costCallback
                        })
                    });

                    creep.moveByPath(path);
                    return;
                }
            }

            var exit = module.exports.findRoomExit(creep, targetRoom, via);

            if(exit) {
                creep.moveTo(exit);
                return true;
            }

            return false;
        },

        findRoomExit: function(creep, targetRoom, via) {

            if(targetRoom && (creep.pos.roomName != targetRoom)) {
                var route;

                if(via) {
                    route = Game.map.findRoute(creep.pos.roomName, targetRoom, {
                        routeCallback: function (room) {
                            if (via.indexOf(room) >= 0) {
                                return 1

                            }

                            return Infinity;
                        }
                    });
                }
                else {
                    route = Game.map.findRoute(creep.pos.roomName, targetRoom);
                }

                if(route.length > 0) {
                    return creep.pos.findClosestByPath(route[0].exit, {costCallback: routeWithAvoid});
                }
            }
        },

        costCallback: function(roomName, matrix) {
            var blockRange = 7;

            var flags = _.groupBy(Game.flags, 'pos.roomName')[roomName];
            var blockFlags = _.filter(flags, {color: COLOR_GREY});
            var keeperFlags = (flags || []).filter(f => f.color == COLOR_RED && f.secondaryColor == COLOR_ORANGE);

            blockFlags.forEach(f => {
                matrix.set(f.pos.x, f.pos.y, 255);
            });

            keeperFlags.forEach(/**Flag*/flag => {
                for(let i = blockRange*-1; i <= blockRange; i++) {
                    for(let j = blockRange*-1; j <= blockRange; j++) {
                        matrix.set(flag.pos.x + i, flag.pos.y + j, 255);
                    }
                }
            });
        },

        findRoomRoute: function(creep, targetPos) {
            return PathFinder.search(creep.pos, targetPos, {
                plainCost: 2,
                swampCost: 10,
                roomCallback: function(roomName) {
                    var matrix = new PathFinder.CostMatrix();

                    var flags = _.groupBy(Game.flags, 'pos.roomName')[roomName];
                    var blockFlags = _.filter(flags, {color: COLOR_GREY});

                    blockFlags.forEach(f => {
                        matrix.set(f.pos.x, f.pos.y, 255);
                    });

                    var room = Game.rooms[roomName];
                    if(room) {
                        room.find(FIND_STRUCTURES).forEach(function(structure) {
                            if (structure.structureType === STRUCTURE_ROAD) {
                                // Favor roads over plain tiles
                                matrix.set(structure.pos.x, structure.pos.y, 1);
                            }
                        });
                    }

                    return matrix;
                }
            });
        },

        actionFillController: function(creep) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
})();

profiler.registerObject(module.exports, 'action-utils');