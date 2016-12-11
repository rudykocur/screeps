module.exports = (function() {
    return {
        roomNames: {
            E67N42: "moria",
            E66N41: "home",
            E68N43: "kaerMorhen",
            E64N41: "brot",
            E66N42: "homeTop",
            E66N43: "homeTopTop",
            E65N41: "homeLeft",
            E65N42: "loneOutpost",
            E67N43: "moriaTop",
            E68N42: "moriaRight",
            E69N42: "moriaRightRight",
            E67N41: "moriaBottom",
            E68N41: "mork",
            E69N43: "kmRight",
        },
        rooms: {
            home: {
                type: "colony",
                creeps: {
                    upgrader: 5,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ENERGY]: 1000000,
                        [RESOURCE_OXYGEN]: 10000,
                    }
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                creeps: {
                    upgrader: 4,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ENERGY]: 1000000,
                        [RESOURCE_ZYNTHIUM]: 10000,
                    }
                },
                // terminal: {
                //     require: {
                //         [RESOURCE_ENERGY]: 6000,
                //     }
                // }
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 120000,
                creeps: {
                    upgrader: 9,
                    builder: 1,
                    mover: 2,
                }
            },
            brot: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 1,
                    collector: 4,
                },
            },
            homeTop: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 1,
                    // collector: 2,
                },
            },
            homeTopTop: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    // settler: 1,
                    collector: 2,
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
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                offroad: true,
                creeps: {
                    collector: 1,
                }
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
                offroad: true,
                creeps: {
                    collector: 2,
                    claimer: 1,
                },
            },
            mork: {
                type: "outpost",
                homeRoom: "moria",
                offroad: true,
                creeps: {
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
            kmRight: {
                type: "outpost",
                homeRoom: "kaerMorhen",
                creeps: {
                    collector: 4,
                    settler: 1,
                    claimer: 1,
                }
            }
        },

        spawn: {
            Rabbithole: {

                harvesterRight: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceRight'
                    }
                },

                harvesterLeft: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'sourceLeft'
                    }
                },
                // harvesterMineral: {
                //     minimum: 1,
                //     body: 'mineralHarvester',
                //     priority: 'normal',
                //     memo: {
                //         role: 'harvester',
                //         energySourceId: '5843ec060750719d418e9488'
                //     }
                // },
                mineralTransfer: {
                    minimum: 1,
                    body: 'mineralTransfer',
                    priority: 'low',
                    memo: {
                        role: 'transfer',
                        transferResource: RESOURCE_OXYGEN,
                        energySourceId: '5843ec060750719d418e9488'
                    }
                },

                fighter: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    //     TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    //     ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        // room: 'E68N42',
                        // room: 'E67N42',

                        room: 'E64N41'
                    }
                },
            },

            Cheshire: {},

            Moria: {
                moriaHarvesterTop: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaTop'
                    }
                },

                moriaHarvesterBottom: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySource: 'moriaBottom'
                    }
                },
                // moriaHarvesterMineral: {
                //     minimum: 1,
                //     body: 'mineralHarvester',
                //     priority: 'normal',
                //     memo: {
                //         role: 'harvester',
                //         energySourceId: '57efa11d08bd77920836f23f'
                //     }
                // },
                moriaMineralTransfer: {
                    minimum: 0,
                    body: 'mineralTransfer',
                    priority: 'normal',
                    memo: {
                        role: 'transfer',
                        // transferResource: RESOURCE_ZYNTHIUM,
                    }
                },
            },

            "Kaer Morhen": {
                kmHarvesterTop: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57ef9ee886f108ae6e6101b8',
                    }
                },
                kmHarvesterBottom: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'critical',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57ef9ee886f108ae6e6101b9',
                    }
                },
            },
        },

        blueprints: {
            outpostMiner: {
                body: 'harvesterOffroad',
                role: 'harvester',
                memo: {},
            },

            outpostCollector: {
                body: 'collector',
                bodyOffroad: 'collectorOffroad',
                role: 'collector',
                memo: {}
            },

            outpostDefender: {
                body: 'defender',
                role: 'brawler',
                memo: {}
            },

            outpostClaimer: {
                body: 'claimer',
                role: 'claimer',
                memo: {}
            },

            outpostScout: {
                body: 'scout',
                role: 'scout',
                memo: {}
            },

            outpostSettler: {
                body: 'settler',
                role: 'settler',
                memo: {
                    enableRepair: true,
                },
            },
            colonyMover: {
                body: 'mover',
                role: 'mover',
                memo: {}
            },
            colonyUpgrader: {
                body: 'upgrader',
                role: 'upgrader',
                memo: {}
            },
            colonyBuilder: {
                body: 'builder',
                role: 'builder',
                memo: {
                    disableController: true,
                },
            },
        },
    }
})();