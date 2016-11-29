module.exports = (function() {
    return {
        spawn: {
            builder: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {role: 'builder'}
            },

            upgrader: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'storage'
                }
            },

            upgraderAny: {
                minimum: 0,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'storage',
                }
            },

            upgraderLeft: {
                minimum: 0,
                body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {
                    role: 'upgrader',
                    fromStructures: 'storage'
                }
            },

            harvesterRight: {
                minimum: 1,
                body: [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceRight'
                }
            },

            harvesterLeft: {
                minimum: 1,
                body: [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'sourceLeft'
                }
            },

            mover: {
                minimum: 2,
                body: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
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
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    enableRepair: true,
                    room: 'E66N42',
                }
            },

            settlerTopHaul: {
                minimum: 2,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    harvestRoom: 'E66N42',
                    workRoom: 'E66N41',
                    disableSpawn: true,
                }
            },

            settlerLeft: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    enableRepair: true,
                    room: 'E65N41',
                }
            },
            settlerLeftHaul: {
                minimum: 2,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    harvestRoom: 'E65N41',
                    workRoom: 'E66N41',
                    disableSpawn: true,
                }
            },
            settlerTopLeftHaul: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    harvestRoom: 'E65N42',
                    workRoom: 'E66N41',
                    via: ['E66N41', 'E66N42', 'E65N42'],
                    disableSpawn: true,
                    debug: true,
                }
            },
        }
    }
})();