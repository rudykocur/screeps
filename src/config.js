module.exports = (function() {
    return {
        roomNames: {
            E67N42: "moria",
            E66N41: "home",
            E66N42: "homeTop",
            E65N41: "homeLeft",
            E65N42: "loneOutpost",
            E67N43: "moriaTop",
            E68N42: "moriaRight",
        },
        rooms: {
            home: {
                type: "colony",
                creeps: {
                    upgrader: 5,
                    builder: 1,
                    harvester: 2,
                    mover: 2,
                },
            },
            moria: {
                type: "colony",
                panicMode: false,
                creeps: {
                    upgrader: 4,
                    builder: 1,
                    harvester: 2,
                    mover: 2,
                }
            },
            // homeTop: {
            //     type:"outpost",
            //     homeRoom:"home",
            // },
            homeLeft:{
                type:"outpost",
                homeRoom:"home",
            },
            moriaRight:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    // harvester: 2,
                    claimer: 1,
                    // collector: 2,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
            },
            // loneOutpost:{
            //     type:"outpost",
            //     homeRoom:"home",
            // },
        },

        spawn: {
            Rabbithole: {
                builder: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
                    memo: {role: 'builder'}
                },

                upgrader: {
                    minimum: 3,
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
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                    priority: 6,
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceRight'
                    }
                },

                harvesterLeft: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
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
                    minimum: 0,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        enableRepair: true,
                        room: 'E66N42',
                    }
                },

                settlerTopReserver: {
                    minimum: 0,
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
                    minimum: 0,
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
                    priority: -4,
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
                    minimum: 3,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 10,
                    memo: {role: 'mover'}
                },
                moriaUpgrader: {
                    minimum: 4,
                    // body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: -2,
                    memo: {
                        role: 'upgrader',
                        fromStructures: 'moriaStorage'
                    }
                },
                moriaHarvesterTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 6,
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaTop'
                    }
                },

                moriaHarvesterBottom: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                    priority: 5,
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaBottom'
                    }
                },
                moriaTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        room: 'E67N43',
                        enableRepair: true,
                    }
                },
                moriaRight: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                    memo: {
                        role: 'settler',
                        room: 'E68N42',
                        enableRepair: true,
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
            },

            outpostCollector: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                role: 'collector',
                memo: {
                    // storageId: '583d89cbc23dc5573898a00f'
                },
                roomOverride: {
                    E65N41: {'spawnAmount' : 3},
                    E66N42: {'spawnAmount' : 3},
                    E68N42: {'spawnAmount' : 3},
                    // E67N43: {memo: {storageId: '58422dec43fcac045102285b'}},
                }
            },

            outpostDefender: {
                body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                role: 'brawler',
                memo: {}
            }
        }
    }
})();