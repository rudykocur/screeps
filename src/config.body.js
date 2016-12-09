module.exports = (function() {
    return {
        settler: {
            1: [MOVE,MOVE,CARRY,CARRY,WORK],
            2: [MOVE,MOVE,WORK,WORK,CARRY,CARRY],
            3: [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]
        },
        builder: {
            1: [MOVE,MOVE,CARRY,CARRY,WORK],
            2: [MOVE,MOVE,WORK,WORK,CARRY,CARRY],
            3: [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
        },
        mover: {
            1: [MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
            2: [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            3: [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
        },
        upgrader: {
            2: [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
            3: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
            5: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
            6: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY]
        },
        mineralTransfer: {
            6: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
        },
        mineralHarvester: {
            6: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
        },
        harvester: {
            1: [MOVE,MOVE,WORK,WORK],
            2: [MOVE,MOVE,WORK,WORK,WORK,WORK],
            3: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
        },
        harvesterOffroad: {
            2: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
            3: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
        },
        claimer: {
            4: [MOVE, MOVE, CLAIM, CLAIM],
        },
        defender: {
            3: [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL],
        },
        collector: {
            3: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            5: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
        },
        collectorOffroad: {
            3: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            4: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            5: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
        },
        scout: {
            1: [MOVE],
        },

        rclLevels: {
            1: 300,
            2: 300 + 5 * 50,
            3: 300 + 10 * 50,
            4: 300 + 20 * 50,
            5: 300 + 30 * 50,
            6: 300 + 40 * 50,
            7: 300 + 50 * 100,
            8: 300 + 60 * 200,
        },

        /**
         * @param {Room} room
         */
        getEffectiveRcl: function(room) {
            for(var i = 8; i > 0; i--) {
                if(room.energyCapacityAvailable >= module.exports.rclLevels[i]) {
                    return i;
                }
            }
        },

        getBody: function(name, rcl) {
            var bodies = module.exports[name];

            for(var i = rcl; i > 0; i--) {
                var body = bodies[i];
                if(body) {
                    return body;
                }
            }

            return null;
        }
    }
})();