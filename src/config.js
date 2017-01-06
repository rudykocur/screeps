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
            E69N49: "east",
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
                observeRoom: 'E69N49',
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 5000,
                        [RESOURCE_UTRIUM_LEMERGITE]: 5000,
                        [RESOURCE_HYDROXIDE]: 5000,
                    },
                    reserve: {
                        [RESOURCE_OXYGEN]: 50000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_OXYGEN],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_OXYGEN]: 50000,
                    }
                },
                labs: {
                    names: {
                        '584cdc59d9c0e3e84cb9135f': 'A1',
                        '584e0af645e985bf11b55745': 'A2',
                        '584c538f866164475da08cbf': 'A3',
                        '584e59971c56de6e3ae4c2b0': 'B1',
                        '584c72e76ca81b64248b3829': 'B2',
                        '584e1616459b5b8d7e42983a': 'B3',
                        '5861320a7ceda6a4422def39': 'C2',
                        '5861fba52bf54c796d15a096': 'D1',
                        '5861b11eb03d4fb4059da29f': 'D2',
                        '586172d62c660f9d020f7d58': 'D3',
                    },
                    boost: {
                        D3: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                        // tright: RESOURCE_ZYNTHIUM_ALKALIDE,
                    },
                    reactions: [
                        {
                            labs: ['A1', 'A2', 'A3'],
                            load: [RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE],
                            amount: 2000,
                        },
                        {
                            labs: ['A3', 'B1', 'B2'],
                            load: [RESOURCE_GHODIUM, RESOURCE_HYDROGEN],
                            amount: 2000,
                        },
                        {
                            labs: ['B2', 'B3', 'C2'],
                            load: [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_HYDROXIDE],
                            amount: 2000,
                        },
                        {
                            labs: ['C2', 'D1', 'D2'],
                            load: [RESOURCE_GHODIUM_ACID, RESOURCE_CATALYST],
                            amount: 10000,
                        },
                    ],
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                autobuyMinerals: true,
                wallsHp: 1600000,
                creeps: {
                    upgrader: 3,
                    builder: 2,
                    mover: 2,
                },
                minerals: {
                    wants: {
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                    },
                    reserve: {
                        [RESOURCE_ZYNTHIUM]: 50000,
                        [RESOURCE_HYDROXIDE]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_ZYNTHIUM],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_ZYNTHIUM]: 30000,
                        [RESOURCE_HYDROXIDE]: 10000,
                    }
                },
                labs: {
                    names: {
                        '586ebce3944a78637dd854b9': 'A1',
                        '586efb9754bb3cba7d255d2e': 'A2',
                        '586edae852779cff21d2fe53': 'B1',
                        '586f1c575d1229ca49bafd72': 'B2',
                    },
                    reactions: [
                        {
                            labs: ['A1', 'A2', 'B1'],
                            load: [RESOURCE_HYDROGEN, RESOURCE_OXYGEN],
                            amount: 3000,
                        },
                    ],
                },
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 200000,
                autobuyMinerals: true,
                creeps: {
                    upgrader: 3,
                    builder: 1,
                    mover: 2,
                },
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_OXYGEN]: 13000,
                    },
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
            east: {
                type: "colony",
                // homeRoom: "orphan",
                spawnRooms: ['east', 'orphan'],
                creeps: {
                    // claimer: 0,
                    settler: 2,
                    upgrader: 1,
                    builder: 2,
                    // collector: 0,
                }
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
                    upgrader: 4,
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
                    settler: 0,
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
                    collector: 2,
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
                    // body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    //     TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    //     ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        // room: 'E68N42',
                        // room: 'E67N42',
                        // boost: [{part: HEAL,resource: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,amount: 8}],
                        room: 'E71N41',
                        // moveFlag: 'McSmashFlag',
                    }
                },
            },

            Cheshire: {},
            "Cirith Ungol": {},
            "Kaer Trolde": {},
            Blaviken: {},
            Shaerrawedd: {},
            Tokyo: {},
            Brokilon: {
                brokilonMineralTransfer: {
                    minimum: 3,
                    body: 'mineralTransfer',
                    priority: 'high',
                    memo: {
                        role: 'transfer',
                    }
                },
                claimEast: {
                    minimum: 0,
                    body: 'claimer',
                    priority: 'critical',
                    memo: {
                        role: 'claimer',
                        room: 'E69N49',
                        claim: true,
                    }
                },
                workerEast: {
                    minimum: 3,
                    body: 'settler',
                    priority: 'high',
                    memo: {
                        role: 'settler',
                        room: 'E69N49',
                    }
                },
                fighter: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E68N48',
                    }
                },
                // E68N48
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
                fighter: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E71N41',
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