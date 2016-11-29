module.exports = (function() {
    function routeWithAvoid(roomName, matrix) {
        var allFlags = _.groupBy(Game.flags, 'room.name')[roomName];
        var blockFlags = _.filter(allFlags, {color: COLOR_GREY});

        _.each(blockFlags, function(flag) {
            matrix.set(flag.pos.x, flag.pos.y, 255);
        });
    }

    return {
        shouldHarvestEnergy:  function(creep) {
            if(!creep.memory.harvesting && creep.carry.energy == 0) {
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

            if(targetRoom && (creep.pos.roomName != targetRoom)) {
                if(via) {
                    var route = Game.map.findRoute(creep.pos.roomName, targetRoom, {
                        routeCallback: function(room) {
                            if(via.indexOf(room)>=0) {
                                return 1

                            };
                            return Infinity;
                        }
                    });

                    if(route.length > 0) {
                        var exit = creep.pos.findClosestByPath(route[0].exit, {costCallback: routeWithAvoid});
                        creep.moveTo(exit);
                        return true;
                    }
                }
                else {
                    var exitDir = creep.room.findExitTo(targetRoom);
                    var exit = creep.pos.findClosestByPath(exitDir);
                    creep.moveTo(exit);
                    return true;
                }
            }

            return false;
        },

        actionFillController: function(creep) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
})();