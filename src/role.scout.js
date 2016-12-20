var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');

var logger = require('./logger');
var taskMove = require('./task.move');

module.exports = (function() {


    return {
        /**
         * @param {Creep} creep
         */
        scheduleTask: function(creep) {
            var room = creep.memory.room;

            var flags = _.groupBy(Game.flags, 'pos.roomName')[room];

            var scoutFlag = _.first(_.filter(flags, {color: COLOR_ORANGE}));

            if(!scoutFlag) {
                logger.log(logger.fmt.orange('No scout flag in room', room, 'for creep', creep));
                return;
            }

            if(!creep.pos.isEqualTo(scoutFlag)) {
                creep.addTask(taskMove.task.create(creep, scoutFlag.pos));
            }
        }
        // run:  function(creep) {
        //
        //     if(actionUtils.tryChangeRoom(creep, creep.memory.room, creep.memory.via)) {
        //         return;
        //     }
        //
        //     var center = new RoomPosition(25, 25, creep.memory.room);
        //     var point = center.findClosestByRange(FIND_SOURCES);
        //
        //     creep.moveTo(point);
        // }
    }
})();