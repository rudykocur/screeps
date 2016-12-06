module.exports = (function() {
    function routeWithAvoid(roomName, matrix) {
        var allFlags = _.groupBy(Game.flags, 'room.name')[roomName];
        var blockFlags = _.filter(allFlags, {color: COLOR_GREY});

        _.each(blockFlags, function(flag) {
            matrix.set(flag.pos.x, flag.pos.y, 255);
        });
    }

    return {
        shouldHarvestEnergy:  function(creep, minEnergy) {
            minEnergy = minEnergy || 0;

            if(creep.carryCapacity <= minEnergy) {return false;}

            if(!creep.memory.harvesting && creep.carry.energy <= minEnergy) {
                creep.memory.harvesting = true;
            }
            if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
            }

            return creep.memory.harvesting;
        },

        /**
         * @param {Creep} creep
         * @param {String} targetRoom
         */
        tryChangeRoom: function(creep, targetRoom, via) {

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