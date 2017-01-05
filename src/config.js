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
            E66N45: "lair2",
            E67N44: "orphan",
            E65N43: "underKeepers",
            E67N45: "brokilonTop",
            E69N41: "corner",
            E65N45: "middle",
            E67N46: "brokilon2t",
        },
        market: {
            processInterval: 30,
            maxTradeRange: 30,
            minerals: {
                [RESOURCE_OXYGEN]: {
                    buyPriceMax: 0.7,
                    sellPriceMin: 0.45,
                },
                [RESOURCE_HYDROGEN]: {
                    buyPriceMax: 0.85,
                },
                [RESOURCE_LEMERGIUM]: {
                    buyPriceMax: 0.5,
                    sellPriceMin: 0.15,
                },
                [RESOURCE_ZYNTHIUM]: {
                    buyPriceMax: 0.5,
                    sellPriceMin: 0.10,
                },
                [RESOURCE_KEANIUM]: {
                    buyPriceMax: 0.5,
                },
                [RESOURCE_UTRIUM]: {
                    buyPriceMax: 0.5,
                },
                [RESOURCE_CATALYST]: {
                    buyPriceMax: 0.7,
                },
            }
        },
        rooms: {
            home: {
                type: "colony",
                wallsHp: 1600000,
                // autobuyMinerals: true,
                creeps: {
                    upgrader: 4,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ZYNTHIUM_OXIDE]: 0,
                        // [RESOURCE_ZYNTHIUM_ALKALIDE]: 0,
                        [RESOURCE_ZYNTHIUM]: 10000,
                        [RESOURCE_OXYGEN]: 50000,
                        // [RESOURCE_ENERGY]: 500000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_OXYGEN, RESOURCE_ZYNTHIUM],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_OXYGEN]: 50000,
                        [RESOURCE_ZYNTHIUM]: 20000,
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
                        // bright: RESOURCE_LEMERGIUM_ALKALIDE,
                        // tright: RESOURCE_ZYNTHIUM_ALKALIDE,
                    },
                    reactions: [
                        {
                            labs: ['bmiddle', 'bright', 'bleft'],
                            load: [RESOURCE_CATALYST, RESOURCE_LEMERGIUM_ALKALIDE],
                            amount: 2000,
                        },
                        {
                            labs: ['bmiddle', 'tright', 'tleft'],
                            load: [RESOURCE_CATALYST, RESOURCE_ZYNTHIUM_ALKALIDE],
                            amount: 2000,
                        },
                    ],
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                // autobuyMinerals: true,
                wallsHp: 1600000,
                creeps: {
                    upgrader: 4,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        // [RESOURCE_ENERGY]: 1000000,
                        [RESOURCE_ZYNTHIUM]: 50000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_ZYNTHIUM],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_ZYNTHIUM]: 30000,
                    }
                }
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 200000,
                autobuyMinerals: true,
                creeps: {
                    upgrader: 6,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    reserve: {
                        [RESOURCE_LEMERGIUM]: 50000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 0,
                        [RESOURCE_UTRIUM_LEMERGITE]: 0,
                        //[RESOURCE_ENERGY]: 50000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_LEMERGIUM],
                    require: {
                        [RESOURCE_LEMERGIUM]: 50000,
                        [RESOURCE_ENERGY]: 25000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 3000,
                        [RESOURCE_UTRIUM_LEMERGITE]: 3000,
                    }
                },
                labs: {
                    names: {
                        '5859d6bbd63f522f68c1d9c3': 'A1',
                        '586c39c397fe7e92738e225f': 'A2',
                        '586c5554e4217aa237a3e5b2': 'A3',
                        '5859bd145057e7a84687d66f': 'B1',
                        '5859f9dbabb1542d67aaa762': 'B2',
                        '586c3e9d5f1a64b15d4151b8': 'B3',
                    },
                    reactions: [
                        {
                            labs: ['A1', 'A2', 'A3'],
                            load: [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
                            amount: 3000,
                        },
                        {
                            labs: ['B1', 'B2', 'B3'],
                            load: [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
                            amount: 3000,
                        },
                    ],
                },
            },
            brot: {
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    claimer: 1,
                    settler: 0,
                    collector: 3,
                },
            },
            orphan: {
                type: "colony",
                panicMode: false,
                wallsHp: 200000,
                spawnRooms: ['orphan'],
                creeps: {
                    upgrader: 6,
                    builder: 1,
                    mover: 2,
                }
            },
            homeTop: {
                type:"outpost",
                homeRoom:"home",
                spawnRooms: ['home', 'moria'],
                creeps: {
                    claimer: 1,
                    settler: 0,
                    collector: 2,
                },
            },
            homeTopTop: {
                type:"outpost",
                homeRoom:"moria",
                spawnRooms: ['moria'],
                creeps: {
                    claimer: 1,
                    settler: 0,
                    collector: 2,
                },
            },
            homeLeft:{
                type:"outpost",
                homeRoom:"home",
                spawnRooms: ['home'],
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 0,
                },
            },
            moriaRight:{
                type:"outpost",
                homeRoom:"moria",
                creeps: {
                    claimer: 1,
                    collector: 3,
                    settler: 0,
                }
            },
            kmLower:{
                type:"outpost",
                homeRoom:"kaerMorhen",
                // spawnRooms: ['moria'],
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 1,
                }
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
                spawnRooms: ['moria'],
                creeps: {
                    claimer: 1,
                    collector: 1,
                }
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
                spawnRooms: ['home', 'moria'],
                creeps: {
                    settler: 0,
                    collector: 2,
                    claimer: 1,
                },
            },
            mork: {
                type: "outpost",
                homeRoom: "moria",
                offroad: false,
                spawnRooms: ['home', 'moria'],
                creeps: {
                    collector: 2,
                    claimer: 1,
                    settler: 0,
                },
            },
            loneOutpost:{
                type:"outpost",
                homeRoom:"home",
                creeps: {
                    // collector: 2,
                    claimer: 1,
                }
            },
            kmRight: {
                type: "outpost",
                homeRoom: "kaerMorhen",
                // spawnRooms: ['moria'],
                creeps: {
                    collector: 3,
                    settler: 0,
                    claimer: 1,
                }
            },
            underKeepers: {
                type: "outpost",
                homeRoom: "moria",
                spawnRooms: ['home', 'moria'],
                creeps: {
                    settler: 0,
                    claimer: 1,
                    collector: 2,
                }
            },
            brokilonTop: {
                type: "outpost",
                homeRoom: "orphan",
                creeps: {
                    collector: 1,
                    claimer: 1,
                    settler: 0,
                }
            },
            // lair2: {
            //     type: "outpost",
            //     homeRoom: "orphan",
            //     disableHarvesting: true,
            //     creeps: {
            //         collector: 0,
            //         claimer: 0,
            //         settler: 0,
            //     }
            // },
            corner: {
                type: "outpost",
                homeRoom: "moria",
                creeps: {
                    collector: 2,
                    claimer: 1,
                }
            },
            brokilon2t: {
                type: "outpost",
                homeRoom: "orphan",
                creeps: {
                    collector: 2,
                    settler: 0,
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
                    minimum: 2,
                    body: 'mineralTransfer',
                    priority: 'high',
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

                        room: 'E63N39'
                    }
                },
            },

            Cheshire: {},
            "Cirith Ungol": {},
            "Kaer Trolde": {},
            Blaviken: {},
            Shaerrawedd: {},
            Brokilon: {
                brokilonMineralTransfer: {
                    minimum: 3,
                    body: 'mineralTransfer',
                    priority: 'high',
                    memo: {
                        role: 'transfer',
                    }
                },
                // middlePaver: {
                //     minimum: 1,
                //     body: 'settler',
                //     priority: 'normal',
                //     memo: {
                //         role: 'settler',
                //         harvestRoom: 'E65N45',
                //         workRoom: 'E66N45',
                //     }
                // }
            },
            Ys: {},

            Moria: {
                moriaMineralTransfer: {
                    minimum: 3,
                    body: 'mineralTransfer',
                    priority: 'high',
                    memo: {
                        role: 'transfer',
                    }
                },
            },

            "Kaer Morhen": {
                mineralTransfer: {
                    minimum: 3,
                    body: 'mineralTransfer',
                    priority: 'high',
                    memo: {
                        role: 'transfer',
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