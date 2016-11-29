module.exports = (function() {
    return {
        spawn: {
            builder: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {role: 'builder'}
            },

            upgrader: {
                minimum: 4,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
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

            settlerTop: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    enableRepair: true,
                    room: 'E66N42',
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
                minimum: 0,
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
            collectorTop: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                memo: {
                    role: 'collector',
                    room: 'E66N42',
                    storageId: '583d89cbc23dc5573898a00f'
                }
            },
            diggerRoomUpSourceUp: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'roomUpSourceTop'
                }
            },
            diggerRoomUpSourceDown: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'roomUpSourceBottom'
                }
            },
            collectorLeft: {
                minimum: 2,
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                memo: {
                    role: 'collector',
                    room: 'E65N41',
                    storageId: '583d89cbc23dc5573898a00f'
                }
            },
            diggerRoomLeftSourceLeft: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'roomLeftSourceLeft'
                }
            },
            diggerRoomLeftSourceRight: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
                memo: {
                    role: 'harvester',
                    energySource: 'roomLeftSourceRight'
                }
            },

            fighter: {
                minimum: 0,
                body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                memo: {
                    role: 'brawler',
                    room: 'E65N41'
                }
            }
        }
    }
})();