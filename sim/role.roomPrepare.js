const actionHarvest = require('action.harvest');
const actionUtils = require('action.utils');

module.exports = (function() {
    var room = 'sim';
    var tmpPoint = new RoomPosition(30, 30, room);

    var sites = [
        {pos: new RoomPosition(36, 4, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(35, 15, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(35, 14, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 24, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 25, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 26, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 27, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 28, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(33, 29, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(32, 29, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(31, 29, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(30, 29, room), type: STRUCTURE_WALL},
        {pos: new RoomPosition(29, 29, room), type: STRUCTURE_WALL},
    ];

    function tryChangeRoom(creep, targetRoom) {

        if(targetRoom && creep.pos.roomName != targetRoom) {
            var exitDir = creep.room.findExitTo(targetRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return true;
        }

        return false;
    }

    return {
        run:  function(creep) {
            // if(tryChangeRoom(creep, room)) {
            //     return;
            // }
            //
            // if(creep.pos.x > 48) {
            //     creep.move(LEFT);
            //     return;
            // }

            //console.log('creep', creep, '::', room, '::', creep.room.name);

            if(creep.room.name == room) {
                _.each(sites, function(site) {
                    var result = creep.room.createConstructionSite(site.pos.x, site.pos.y, site.type);

                    console.log('construnction result', result);
                })
            }



        }
    }
})();

