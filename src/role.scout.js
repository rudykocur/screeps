const actionHarvest = require('action.harvest');
const actionBuld = require('action.build');
const actionUtils = require('action.utils');

const logger = require('logger');
const taskMove = require('task.move');

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

            creep.addTask(taskMove.task.create(creep, scoutFlag.pos));
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