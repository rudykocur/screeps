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
            E69N42: "moriaRightRight",
            E67N41: "moriaBottom",
        },
        rooms: {
            home: {
                type: "colony",
                creeps: {
                    upgrader: 4,
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
            homeTop: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 1,
                },
            },
            homeLeft:{
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 1,
                },
            },
            moriaRight:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    // harvester: 2,
                    claimer: 1,
                    collector: 3,
                    settler: 1,
                }
            },
            moriaRightRight:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    settler: 1,
                    harvester: 0,
                    collector: 0,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    settler: 1,
                }
            },
            // moriaBottom: {
            //     type: "outpost",
            //     homeRoom: "moria",
            //     offroad: true,
            //     creeps: {
            //         collector: 2,
            //     },
            // }
            loneOutpost:{
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    // collector: 2,
                }
            },
        },

        spawn: {
            Rabbithole: {
                builder: {
                    minimum: 1,
                    priority: 'normal',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
                    memo: {role: 'builder'}
                },

                upgrader: {
                    minimum: 4,
                    //body: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    // body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'upgrader',
                    }
                },

                harvesterRight: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceRight'
                    }
                },

                harvesterLeft: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceLeft'
                    }
                },

                mover: {
                    minimum: 2,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 'critical',
                    memo: {role: 'mover'}
                },

                fighter: {
                    minimum: 0,
                    priority: 'critical',
                    body: [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    //     TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    //     ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        // room: 'E68N42',
                        // room: 'E67N42',

                        room: 'E66N42'
                    }
                },
            },

            Moria: {
                moriaBuilder: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'builder',
                        //allowRepair: true,
                        disableController: true,
                    },
                },

                moriaMover: {
                    minimum: 3,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 'critical',
                    memo: {role: 'mover'}
                },
                moriaUpgrader: {
                    minimum: 4,
                    // body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'upgrader',
                    }
                },
                moriaHarvesterTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaTop'
                    }
                },

                moriaHarvesterBottom: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaBottom'
                    }
                },
            },
        },

        blueprints: {
            outpostMiner: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK],
                role: 'harvester',
                memo: {},
            },

            outpostCollector: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                bodyOffroad: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                role: 'collector',
                memo: {}
            },

            outpostDefender: {
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,HEAL],
                role: 'brawler',
                memo: {}
            },

            outpostClaimer: {
                body: [MOVE, CLAIM, CLAIM],
                role: 'claimer',
                memo: {}
            },

            outpostScout: {
                body: [MOVE],
                role: 'scout',
                memo: {}
            },

            outpostSettler: {
                body: [MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],
                role: 'settler',
                memo: {
                    enableRepair: true,
                },
            },
        }
    }
})();