module.exports = (function() {
    return {
        spawn: {
            builder: {
                minimum: 1,
                body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                memo: {role: 'builder'}
            },

            upgrader: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'containersRight'
                }
            },

            upgraderAny: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                }
            },

            upgraderLeft: {
                minimum: 2,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'containersLeft'
                }
            },

            harvesterRight: {
                minimum: 2,
                body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceRight'
                }
            },

            harvesterLeft: {
                minimum: 2,
                body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceLeft'
                }
            },

            mover: {
                minimum: 1,
                body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                memo: {role: 'mover'}
            },

            transfer1: {
                minimum: 0,
                body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                memo: {
                    role: 'transfer',
                    fromStructures: 'containersBottom',
                    toStructures: 'containersTop',
                }
            },
            settlerTop: {
                minimum: 2,
                body: [MOVE,MOVE,MOVE,MOVE,WORK,CARRY],
                memo: {
                    role: 'settler',
                    room: 'E66N42',
                }
            },
        }
    }
})();