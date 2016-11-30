module.exports = (function() {
    return {
        spawn: {
            builder: {
                minimum: 1,
                body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                memo: {role: 'builder'}
            },

            upgrader: {
                minimum: 6,
                body: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
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
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                priority: 10,
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

            settlerTopRight: {
                minimum: 1,
                body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                memo: {
                    role: 'settler',
                    enableRepair: true,
                    room: 'E67N42',
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

            fighter: {
                minimum: 0,
                priority: -1,
                body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                memo: {
                    role: 'brawler',
                    // room: 'E68N42',
                    room: 'E67N42',
                    // room: 'E65N41'
                }
            }
        },

        blueprints: {
            outpostMiner: {
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK],
                role: 'harvester',
                memo: {}
            },

            outpostCollector: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                role: 'collector',
                memo: {
                    storageId: '583d89cbc23dc5573898a00f'
                }
            },

            outpostDefender: {
                body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                role: 'brawler',
                memo: {}
            }
        }
    }
})();