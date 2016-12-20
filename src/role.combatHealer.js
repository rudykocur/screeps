var actionHarvest = require('./action.harvest');
var actionBuld = require('./action.build');
var actionUtils = require('./action.utils');
var actionCombat = require('./action.combat');

module.exports = (function() {

    return {
        /**
         * @param {Creep} creep
         */
        run:  function(creep) {

            if(creep.hits < creep.hitsMax) {
                creep.heal(creep);
                return;
            }

            /** @type Creep */
            var target;
            if(creep.memory.followCreep) {
                target = Game.creeps[creep.memory.followCreep];
            }

            // console.log('target', target);

            if(target) {
                if(!creep.pos.isNearTo(target)) {
                    creep.moveTo(target);
                    return;
                }

                if(target.hits < target.hitsMax) {
                    creep.heal(target);
                }
            }


            // if(actionUtils.tryChangeRoom(creep, creep.memory.room)) {
            //     return;
            // }
            //
            // var target = actionCombat.findAttackTarget(creep);
            //
            // if(target) {
            //
            //     if(creep.pos.isNearTo(target)) {
            //         creep.attack(target);
            //     }
            //     else {
            //         creep.moveTo(target);
            //     }
            // }
            // else {
            //     var flags = _.groupBy(Game.flags, 'room.name')[creep.pos.roomName];
            //
            //     if(flags && flags.length > 0) {
            //         creep.moveTo(flags[0].pos);
            //     }
            // }
        }
    }
})();