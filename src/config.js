module.exports = (function() {
    return {
        roomNames: {
            E67N42: "moria",
            E66N41: "home",
            E66N42: "homeTop",
            E66N43: "homeTopTop",
            E65N41: "homeLeft",
            E65N42: "loneOutpost",
            E67N43: "moriaTop",
            E68N42: "moriaRight",
            E69N42: "moriaRightRight",
            E67N41: "moriaBottom",
            E68N43: "kaerMorhen",
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
            kaerMorhen: {
                type: "colony",
                panicMode: true,
                creeps: {}
            },
            homeTop: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 2,
                    collector: 1,
                },
            },
            homeTopTop: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    // claimer: 1,
                    // settler: 1,
                    // collector: 3,
                },
            },
            homeLeft:{
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    // collector: 3,
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
                    collector: 2,
                    settler: 1,
                }
            },
            moriaRightRight:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    settler: 1,
                    // harvester: 0,
                    // collector: 0,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                offroad: true,
                creeps: {
                    settler: 0,
                }
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
                offroad: true,
                creeps: {
                    settler: 0,
                    collector: 2,
                },
            },
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
                    minimum: 5,
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
                harvesterMineral: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
                    priority: 'normal',
                    memo: {
                        role: 'harvester',
                        energySourceId: '5843ec060750719d418e9488'
                    }
                },
                mineralTransfer: {
                    minimum: 1,
                    body: [MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'transfer',
                        transferResource: RESOURCE_OXYGEN,
                        energySourceId: '5843ec060750719d418e9488'
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

                newRoomSettler: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    priority: 'high',
                    memo: {
                        role: 'settler',
                        allowRepair: true,
                        room: 'E68N43',
                        energySource: '57ef9ee886f108ae6e6101b9',
                    }
                },

                newRoomSettler2: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY],
                    priority: 'high',
                    memo: {
                        role: 'settler',
                        allowRepair: true,
                        room: 'E68N43',
                        energySource: '57ef9ee886f108ae6e6101b8',
                    }
                },

                moriaMover: {
                    minimum: 2,
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
                    priority: 'critical',
                    memo: {role: 'mover'}
                },
                moriaUpgrader: {
                    minimum: 3,
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
                moriaTestAttack: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E69N43',
                        attackTarget: '582b8ad5b84ecc623611c8d9'
                    }
                }
            },

            "Kaer Morhen": {
                // [MOVE,MOVE,WORK,CARRY,CARRY]
                baseSettler: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'settler',
                        energySource: '57ef9ee886f108ae6e6101b9',
                        disableBuild: true,
                    }
                },
                baseSettler2: {
                    minimum: 1,
                    body: [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
                    priority: 'normal',
                    memo: {
                        role: 'settler',
                        energySource: '57ef9ee886f108ae6e6101b8',
                    }
                },
                kmHarvesterTop: {
                    minimum: 1,
                    body: [MOVE,MOVE,WORK,WORK,WORK,WORK],
                    priority: 'high',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57ef9ee886f108ae6e6101b8',
                    }
                },
                kmHarvesterBottom: {
                    minimum: 1,
                    body: [MOVE,MOVE,WORK,WORK,WORK,WORK],
                    priority: 'normal',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57ef9ee886f108ae6e6101b9',
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
                body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
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