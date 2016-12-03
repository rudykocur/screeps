module.exports = (function() {
    return {
        rooms: {
            E67N42: {
                panicMode: false,
            }
        },
        roomHandlers: {
            E66N42: {
                type:"outpost",
                homeRoom:"E66N41",
            },
            E65N41:{
                type:"outpost",
                homeRoom:"E66N41",
            },
            E68N42:{
                type:"outpost",
                homeRoom:"E67N42",
            },
            E67N43:{
                type:"outpost",
                homeRoom:"E67N42",
            },
            E65N42:{
                type:"outpost",
                homeRoom:"E66N41",
            }
        },

        spawn: {
            Rabbithole: {
                builder: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
                    memo: {role: 'builder'}
                },

                upgrader: {
                    minimum: 5,
                    //body: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],
                    priority: -2,
                    memo: {
                        role: 'upgrader',
                        fromStructures: 'storage'
                    }
                },

                harvesterRight: {
                    minimum: 1,
                    body: [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 6,
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceRight'
                    }
                },

                harvesterLeft: {
                    minimum: 1,
                    body: [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 5,
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

                settlerTopReserver: {
                    minimum: 1,
                    body: [MOVE, CLAIM, CLAIM],
                    priority: -3,
                    condition: params => {
                        if(!Game.rooms.E66N42) {return false;}
                        var res = Game.rooms.E66N42.controller.reservation;
                        return !res || res.ticksToEnd < 1000;
                    },
                    memo: {
                        role: 'settler',
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

                settlerLeftReserver: {
                    minimum: 1,
                    body: [MOVE, CLAIM, CLAIM],
                    priority: -3,
                    condition: params => {
                        if(!Game.rooms.E65N41) {return false;}
                        var res = Game.rooms.E65N41.controller.reservation;
                        return !res || res.ticksToEnd < 1000;
                    },
                    memo: {
                        role: 'settler',
                        room: 'E65N41',
                    }
                },

                settlerTopLeft: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        enableRepair: true,
                        room: 'E65N42',
                        via: ['E66N41', 'E66N42', 'E65N42'],
                    }
                },

                fighter: {
                    minimum: 0,
                    priority: 15,
                    // body: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        // room: 'E68N42',
                        // room: 'E67N42',

                        room: 'E64N41'
                    }
                },

                disdis: {
                    minimum: 0,
                    priority: 15,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    memo: {
                        role: 'settler',
                    }
                },

                tank: {
                    minimum: 0,
                    priority: -10,
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'combatTank',
                        room: 'E67N42'
                    }
                },

                healer: {
                    minimum: 0,
                    priority: -10,
                    body: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL],
                    memo: {
                        role: 'combatHealer',
                    }
                },

                gang1: {
                    minimum: 0,
                    priority: 15,
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL],
                    memo: {
                        role: 'none'
                    }
                }
            },

            Moria: {
                moriaBuilder: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
                    memo: {
                        role: 'builder',
                        //allowRepair: true,
                        disableController: true,
                    },
                },

                moriaMover: {
                    minimum: 2,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 10,
                    memo: {role: 'mover'}
                },
                moriaUpgrader: {
                    minimum: 4,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    priority: -2,
                    memo: {
                        role: 'upgrader',
                        fromStructures: 'moriaStorage'
                    }
                },
                moriaHarvesterTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 6,
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaTop'
                    }
                },

                moriaHarvesterBottom: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 5,
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaBottom'
                    }
                },
                moriaTopHaul: {
                    minimum: 0,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        harvestRoom: 'E67N43',
                        workRoom: 'E67N42',
                        //disableSpawn: true,
                    }
                },
                moriaTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        room: 'E67N43',
                    }
                },
                moriaRight: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        room: 'E68N42',
                    }
                },
                moriaRightReserver: {
                    minimum: 1,
                    body: [MOVE, CLAIM, CLAIM],
                    priority: -3,
                    condition: params => {
                        if(!Game.rooms.E68N42) {return false;}
                        var res = Game.rooms.E68N42.controller.reservation;
                        return !res || res.ticksToEnd < 1000;
                    },
                    memo: {
                        role: 'settler',
                        room: 'E68N42',
                    }
                },
            },
        },

        blueprints: {
            outpostMiner: {
                body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                role: 'harvester',
                memo: {},
                roomOverride: {
                    E67N42: {body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK]},
                    E66N42: {body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK]},
                    E65N41: {body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK]},
                }
            },

            outpostCollector: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                role: 'collector',
                memo: {
                    storageId: '583d89cbc23dc5573898a00f'
                },
                roomOverride: {
                    E65N41: {'spawnAmount' : 2},
                    E66N42: {'spawnAmount' : 2},
                    E68N42: {memo: {storageId: '58422dec43fcac045102285b'}},
                    E67N43: {memo: {storageId: '58422dec43fcac045102285b'}},
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