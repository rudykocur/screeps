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
                    upgrader: 3,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        [RESOURCE_ZYNTHIUM_OXIDE]: 0,
                        [RESOURCE_ZYNTHIUM_ALKALIDE]: 0,
                        [RESOURCE_ZYNTHIUM]: 0,
                        [RESOURCE_OXYGEN]: 0,
                        // [RESOURCE_ENERGY]: 500000,
                    }
                },
                terminal: {
                    require: {
                        [RESOURCE_ENERGY]: 20000,
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
                    boost: {
                        bright: RESOURCE_LEMERGIUM_ALKALIDE,
                        tright: RESOURCE_ZYNTHIUM_ALKALIDE,
                    },
                    reactions: [
                        {
                            labs: ['tmiddle', 'bmiddle', 'tright'],
                            load: [RESOURCE_HYDROXIDE, RESOURCE_ZYNTHIUM_OXIDE],
                            amount: 2000,
                        },
                        {
                            labs: ['tleft', 'bleft', 'tmiddle'],
                            load: [RESOURCE_OXYGEN, RESOURCE_HYDROGEN],
                            amount: 1500,
                        },
                        // {
                        //     labs: ['tmiddle', 'bmiddle', 'bright'],
                        //     // load: [RESOURCE_HYDROXIDE, RESOURCE_ZYNTHIUM_OXIDE],
                        //     load: [RESOURCE_HYDROXIDE, RESOURCE_LEMERGIUM_OXIDE],
                        //     amount: 2000,
                        // },
                    ],
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                creeps: {
                    upgrader: 3,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ENERGY]: 1000000,
                        [RESOURCE_ZYNTHIUM]: 0,
                    }
                },
                terminal: {
                    require: {
                        [RESOURCE_ENERGY]: 100000,
                    }
                }
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 120000,
                noMinerals: true,
                creeps: {
                    upgrader: 5,
                    builder: 2,
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
                type: "colony",
                panicMode: true,
                wallsHp: 10000,
                creeps: {
                    upgrader: 7,
                    builder: 1,
                    mover: 3,
                }
            },
            homeTop: {
                type:"outpost",
                homeRoom:"home",
                spawnRooms: ['home', 'moria'],
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
                    settler: 1,
                    collector: 1,
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
                creeps: {
                    collector: 1,
                    claimer: 1,
                    settler: 1,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                spawnRooms: ['moria'],
                creeps: {
                    settler: 2,
                    claimer: 1,
                    collector: 1,
                }
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
                spawnRooms: ['home', 'moria'],
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
                spawnRooms: ['home', 'moria'],
                creeps: {
                    collector: 1,
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
            // lair1: {
            //     type: "sourceKeeper",
            //     homeRoom: "home",
            //     spawnRooms: ['home', 'moria'],
            //     creeps: {
            //         defender: 1,
            //         settler: 1,
            //         harvester: 2,
            //         collector: 4,
            //     },
            // }
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

                keeperKiller: {
                    minimum: 0,
                    priority: 'critical',
                    // body: [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    //     MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL],
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL],
                    memo: {
                        role: 'brawler',
                        room: 'E66N44',
                        guardFlag: 'skIdleFlag',
                        // boost: [
                        //     {part: MOVE, resource: RESOURCE_ZYNTHIUM_ALKALIDE, amount: 3},
                        //     {part: HEAL, resource: RESOURCE_LEMERGIUM_ALKALIDE, amount: 3},
                        // ]
                    }
                },

                testBoost: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE],
                    memo: {
                        role: 'brawler',
                        room: 'E66N44',
                        guardFlag: 'skIdleFlag',
                        boost: [
                            {part: MOVE, resource: RESOURCE_ZYNTHIUM_ALKALIDE, amount: 1},
                            // {part: HEAL, resource: RESOURCE_LEMERGIUM_ALKALIDE, amount: 1},
                        ]
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
            Brokilon: {},
            Ys: {},

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
            lairDefender: {
                body: 'lairDefender',
                role: 'lairDefender',
            },
            lairHarvester: {
                body: 'harvesterLair',
                role: 'harvester',
            },
        },
    }
})();