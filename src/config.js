module.exports = (function() {
    return {
        spawn: {
            builder: {
                minimum: 0,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {role: 'builder'}
            },

            upgrader: {
                minimum: 0,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'containersTop'
                }
            },

            harvester: {
                minimum: 0,
                body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceTop'
                }
            },

            harvesterBottom: {
                minimum: 0,
                body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceBottom'
                }
            },

            mover: {
                minimum: 0,
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
            settler: {
                minimum: 4,
                body: [WORK, WORK, CARRY, MOVE],
                memo: {
                    role: 'settler',
                }
            },
            settler2: {
                minimum: 1,
                body: [WORK, WORK, CARRY, MOVE],
                memo: {
                    role: 'settler',
                    energySource: '57ef9ebf86f108ae6e60fd87',
                    disableController: true
                }
            }

        }
    }
})();