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
            E69N42: "kmLower",
            E67N41: "moriaBottom",
            E68N41: "mork",
            E69N43: "kmRight",
            E66N44: "lair1",
            E67N44: "orphan",
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
                },
                terminal: {
                    require: {
                        [RESOURCE_ENERGY]: 15000,
                    }
                },
                labs: {
                    names: {
                        '584cdc59d9c0e3e84cb9135f': 'tleft',
                        '584e0af645e985bf11b55745': 'tmiddle',
                        '584c538f866164475da08cbf': 'tright',
                        '584e59971c56de6e3ae4c2b0': 'bleft',
                        '584c72e76ca81b64248b3829': 'bmiddle',
                        '584e1616459b5b8d7e42983a': 'bright',
                    },
                    reactions: [
                        {
                            labs: ['tleft', 'tright', 'bmiddle'],
                            load: [RESOURCE_OXYGEN, RESOURCE_ZYNTHIUM],
                            amount: 500,
                        },
                        {
                            labs: ['tleft', 'bleft', 'tmiddle'],
                            load: [RESOURCE_OXYGEN, RESOURCE_HYDROGEN],
                            amount: 1500,
                        },
                        {
                            labs: ['tmiddle', 'bmiddle', 'bright'],
                            load: [RESOURCE_HYDROXIDE, RESOURCE_ZYNTHIUM_OXIDE],
                            amount: 1000,
                        },
                    ],
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                creeps: {
                    upgrader: 4,
                    builder: 0,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ENERGY]: 1000000,
                        [RESOURCE_ZYNTHIUM]: 10000,
                    }
                },
                terminal: {
                    require: {
                        [RESOURCE_ENERGY]: 6000,
                    }
                }
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 120000,
                creeps: {
                    upgrader: 4,
                    builder: 0,
                    mover: 2,
                }
            },
            brot: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 1,
                    collector: 3,
                },
            },
            orphan: {
                type: "outpost",
                homeRoom: "moria",
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 1,
                }
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
            kmLower:{
                type:"outpost",
                homeRoom:"kaerMorhen",
                // disableHarvesting: true,
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 1,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                offroad: true,
                spawnRooms: ['home'],
                creeps: {
                    settler: 1,
                    claimer: 1,
                    collector: 1,
                }
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
                spawnRooms: ['home'],
                offroad: true,
                creeps: {
                    settler: 1,
                    collector: 2,
                    claimer: 1,
                },
            },
            mork: {
                type: "outpost",
                homeRoom: "moria",
                offroad: true,
                spawnRooms: ['home'],
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
                    collector: 3,
                    settler: 1,
                    claimer: 1,
                }
            },
            lair1: {
                type: "sourceKeeper",
                homeRoom: "home",
            }
        },

        spawn: {
            Rabbithole: {
                mineralTransfer: {
                    minimum: 1,
                    body: 'mineralTransfer',
                    priority: 'low',
                    memo: {
                        role: 'transfer',
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

                        room: 'E64N43'
                    }
                },
            },

            Cheshire: {},

            Moria: {
                moriaMineralTransfer: {
                    minimum: 1,
                    body: 'mineralTransfer',
                    priority: 'normal',
                    memo: {
                        role: 'transfer',
                    }
                },
            },

            "Kaer Morhen": {},
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
            colonyHarvester: {
                body: 'harvester',
                role: 'harvester',
                memo: {}
            },
            colonyHarvesterMineral: {
                body: 'mineralHarvester',
                role: 'mineralHarvester',
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