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
            E69N48: "eastBottom",
            E68N48: "septis",
            E68N47: "septisBottom",
            E69N47: "eastBottomFar",
            E69N46: "underEast",
            E66N47: "h2",
            E67N47: "h2Right",
            E65N47: "h2Left",
            E66N46: "h2Lair",
            E69N44: "dragon",
            E68N44: "dragonLeft",
            E68N45: "dragon2",
            E64N49: "casegrad",
            E65N49: "caseRight",
            E65N48: "caseBottom",
            E63N49: "caseLeft",
            E63N48: "caseX",
        },
        market: {
            processInterval: 15,
            maxTradeRange: 50,
            minerals: {
                [RESOURCE_OXYGEN]: {
                    buyPriceMax: 0.4,
                    sellPriceMin: 0.4,
                },
                [RESOURCE_HYDROGEN]: {
                    buyPriceMax: 0.85,
                    sellPriceMin: 0.71,
                },
                [RESOURCE_LEMERGIUM]: {
                    buyPriceMax: 0.5,
                    sellPriceMin: 0.1,
                },
                [RESOURCE_ZYNTHIUM]: {
                    buyPriceMax: 0.5,
                    sellPriceMin: 0.15,
                },
                [RESOURCE_KEANIUM]: {
                    buyPriceMax: 0.35,
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
                wallsHp: 3000000,
                structRampartsHp: 10000000,
                autobuyMinerals: true,
                // importEnabled: false,
                creeps: {
                    upgrader: 4,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_HYDROXIDE]: 5000,
                        [RESOURCE_CATALYST]: 13000,
                        [RESOURCE_GHODIUM]: 10000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 5000,
                        [RESOURCE_UTRIUM_LEMERGITE]: 5000,
                    },
                    reserve: {
                        [RESOURCE_UTRIUM]: 12000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_OXYGEN],
                    require: {
                        [RESOURCE_ENERGY]: 150000,
                        [RESOURCE_OXYGEN]: 5000,
                        [RESOURCE_UTRIUM]: 2000,
                        [RESOURCE_GHODIUM]: 10000,
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
                        // A3: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'C2'],
                        output: ['A1', 'A2', 'A3', 'B1', 'B3', 'D1', 'D2', 'D3'],
                        result: RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
                        amount: 40000,
                    },
                }
            },
            moria: {
                type: "colony",
                autobuyMinerals: true,
                // importEnabled: false,
                wallsHp: 3000000,
                structRampartsHp: 10000000,
                creeps: {
                    upgrader: 3,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_UTRIUM]: 13000,
                        [RESOURCE_HYDROXIDE]: 5000,
                        [RESOURCE_CATALYST]: 13000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 1000,
                    },
                    reserve: {
                    }
                },
                terminal: {
                    autosell: [RESOURCE_ZYNTHIUM],
                    require: {
                        [RESOURCE_ENERGY]: 150000,
                        [RESOURCE_ZYNTHIUM]: 5000,
                    }
                },
                labs: {
                    names: {
                        '586ebce3944a78637dd854b9': 'A1',
                        '586efb9754bb3cba7d255d2e': 'A2',
                        '586edae852779cff21d2fe53': 'B1',
                        '586f1c575d1229ca49bafd72': 'B2',
                        '586fdef3a477391853ff79d4': 'C1',
                        '58713e69f1135a40674916ff': 'C2',
                        '5877fac66a8ecb074b81b7c7': 'D3',
                        '587782547d605c8f52426ab8': 'E1',
                        '5877b8418f95b66a7c763fd3': 'E2',
                        '587824f74da28eeb27895216': 'E3',
                    },
                    boost: {
                        // A1: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['C1', 'C2'],
                        output: ['A1', 'A2', 'B1', 'B2', 'D3', 'E1', 'E2', 'E3'],
                        result: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                        amount: 40000,
                    },
                },
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 1000000,
                autobuyMinerals: true,
                // importEnabled: false,
                creeps: {
                    upgrader: 1,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_HYDROXIDE]: 5000,
                        [RESOURCE_UTRIUM]: 12000,
                        [RESOURCE_CATALYST]: 13000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 5000,
                        [RESOURCE_UTRIUM_LEMERGITE]: 5000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 1000,
                    },
                    reserve: {
                    }
                },
                terminal: {
                    autosell: [RESOURCE_LEMERGIUM],
                    require: {
                        [RESOURCE_LEMERGIUM]: 5000,
                        [RESOURCE_ENERGY]: 100000,
                    }
                },
                labs: {
                    names: {
                        '587a91d021d930e15c7ebaef': 'A1',
                        '587a9cd0922d375b084534e6': 'A2',
                        '5859d6bbd63f522f68c1d9c3': 'B1',
                        '586c39c397fe7e92738e225f': 'B2',
                        '586c5554e4217aa237a3e5b2': 'B3',
                        '587acb6680b0ff072fbb4c6f': 'B4',
                        '5859bd145057e7a84687d66f': 'C1',
                        '5859f9dbabb1542d67aaa762': 'C2',
                        '586c3e9d5f1a64b15d4151b8': 'C3',
                        '587ac22cb3bcbfa352090062': 'C4',
                    },
                    boost: {
                        // C1: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A1', 'A2', 'B1', 'B4', 'C1', 'C2', 'C3', 'C4'],
                        result: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                        amount: 40000,
                    },
                },
            },
            orphan: {
                type: "colony",
                wallsHp: 700000,
                autobuyMinerals: true,
                // importEnabled: false,
                creeps: {
                    upgrader: 4,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        // [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 8000,
                        // [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 8000,
                        // [RESOURCE_CATALYZED_UTRIUM_ACID]: 8000,
                        // [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 10000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 1000,
                        [RESOURCE_ZYNTHIUM_KEANITE]: 5000,
                        [RESOURCE_UTRIUM_LEMERGITE]: 5000,
                        [RESOURCE_UTRIUM]: 13000,
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_CATALYST]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_ENERGY]: 500000,
                        [RESOURCE_HYDROXIDE]: 5000,
                    },
                    reserve: {
                    }
                },
                terminal: {
                    autosell: [RESOURCE_LEMERGIUM],
                    require: {
                        [RESOURCE_LEMERGIUM]: 5000,
                        [RESOURCE_ENERGY]: 150000,
                    }
                },
                labs: {
                    names: {
                        '5878ad685caf13ac3b377652': 'A1',
                        '58789f364d3fe11215fdb7d3': 'A2',
                        '5874aa0cc25743766a254ce4': 'B1',
                        '587496eca58304ea3021ea3f': 'B2',
                        '58748ad4f08e19527647993d': 'B3',
                        '587897392720055772704860': 'B4',
                        '5878c1049c2486c141720614': 'C1',
                        '5878ba2c97fc78d21e5f054f': 'C2',
                        '5878b1023f7fc2b67913acd0': 'C3',
                        '5878a65ce54d939f08188257': 'C4',
                    },
                    boost: {
                        // A1: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                        // A2: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                        // B4: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A1', 'A2', 'B1', 'B4', 'C1', 'C2', 'C3', 'C4'],
                        result: RESOURCE_CATALYZED_UTRIUM_ACID,
                        // result: RESOURCE_HYDROXIDE,
                        amount: 40000,
                    },
                }
            },
            east: {
                type: "colony",
                wallsHp: 100000,
                autobuyMinerals: true,
                // importEnabled: false,
                structRampartsHp: 1000000,
                creeps: {
                    mover: 2,
                    upgrader: 4,
                    transfer: 2,
                },
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_GHODIUM]: 4000,
                        [RESOURCE_OXYGEN]: 5000,
                        [RESOURCE_CATALYST]: 5000,
                        [RESOURCE_ENERGY]: 500000,
                        [RESOURCE_HYDROXIDE]: 5000,
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 8000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 8000,
                        [RESOURCE_CATALYZED_UTRIUM_ACID]: 8000,
                        [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 10000,
                    },
                    reserve: {
                    }
                },
                terminal: {
                    autosell: [RESOURCE_HYDROGEN],
                    autobuy: [RESOURCE_KEANIUM],
                    require: {
                        [RESOURCE_HYDROGEN]: 5000,
                        [RESOURCE_ENERGY]: 150000,
                    }
                },
                labs: {
                    names: {
                        '588e04f9af8dded30ccb692b': 'A1',
                        '588df66bed2a2a4716084d72': 'A2',
                        '588df046f170a2dc6b7818e9': 'A3',
                        '588de940af1936510b7d17ca': 'A4',
                        '588e1a798c44065363387db7': 'B1',
                        '5895ebb06ab52a0c20ddfc8e': 'B2',
                        '5895e244c8c08019c2a6acc4': 'B3',
                        '588de749253680545df51c65': 'B4',
                        '5895e6c3ea8a69ea44b1bceb': 'C2',
                        '5895de51b0d4068071586fcc': 'C3',
                    },

                    boost: {
                        // A4: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                        // A1: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                        // B1: RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
                        // C2: RESOURCE_CATALYZED_UTRIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A1', 'A2', 'A3', 'A4', 'B1', 'B4', 'C2', 'C3'],
                        result: RESOURCE_CATALYZED_KEANIUM_ACID,
                        amount: 40000,
                    },
                }
            },
            h2: {
                type: "colony",
                wallsHp: 50000,
                autobuyMinerals: true,
                // importEnabled: false,
                creeps: {
                    mover: 2,
                    upgrader: 3,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_OXYGEN]: 13000,
                    },
                    reserve: {
                    }
                },
                terminal: {
                    autosell: [RESOURCE_HYDROGEN],
                    autobuy: [RESOURCE_UTRIUM],
                    require: {
                        [RESOURCE_HYDROGEN]: 5000,
                        [RESOURCE_ENERGY]: 20000,
                    }
                },
                labs: {
                    names: {
                        '58aadfa8b56883711663c3e5': 'A2',
                        '58aaf01ff40e6a7a607a3223': 'A3',
                        '588deea7e724d73531b19149': 'B1',
                        '58aae846da912c2444968076': 'B2',
                        '58aaf88a20ede08b5c7d11c9': 'B3',
                        '588e33a898cd17a460aa2d3f': 'B4',
                        '588de294386811861ebe5595': 'C1',
                        '588dfc2ee73cb0e942907811': 'C2',
                        '588e093021ec356a2e11ced3': 'C3',
                        '588e2267589c91df6d0ec864': 'C4',
                    },
                    boost: {},
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A2', 'A3', 'B1', 'B4', 'C1', 'C2', 'C3', 'C4'],
                        result: RESOURCE_HYDROXIDE,
                        amount: 40000,
                    },
                }
            },
            dragon: {
                type: "colony",
                wallsHp: 200000,
                structRampartsHp: 500000,
                // importEnabled: false,
                creeps: {
                    mover: 2,
                    upgrader: 7,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_OXYGEN]: 10000,
                        [RESOURCE_HYDROGEN]: 10000,
                    },
                    reserve: {
                        [RESOURCE_CATALYST]: 0,
                    }
                },
                terminal: {
                    require: {
                        [RESOURCE_CATALYST]: 5000,
                        [RESOURCE_ENERGY]: 40000,
                    }
                },
                labs: {
                    names: {
                        '589612a47ba18e9574ec5aed': 'A2',
                        '589607ffc7a7d4821ff4983a': 'A3',
                        // '': 'B1',
                        // '': 'B2',
                        '589601c2719bddf506d3cb12': 'B3',
                        // '': 'C1',
                        // '': 'C2',
                        '5895f81acdade16519d84d01': 'C3',
                        '589609249068a20b3ad980d8': 'D2',
                        '5895f2643bade6359499ee6f': 'D3',
                    },

                    boost: {},
                    produce: {
                        input: ['B3', 'C3'],
                        output: ['A2', 'A3', 'D2', 'D3'],
                        result: RESOURCE_HYDROXIDE,
                        amount: 20000,
                    },
                },
            },
            casegrad: {
                type: "colony",
                // importEnabled: false,
                creeps: {
                    upgrader: 8,
                    mover: 2,
                    transfer: 3,
                },
                terminal: {
                    require: {
                        // [RESOURCE_ENERGY]: 40000,
                    }
                },
            },
            eastBottom: {
                type: "outpost",
                homeRoom: "east",
            },
            // eastBottomFar: {
            //     type: "outpost",
            //     homeRoom: "east",
            // },
            septis: {
                type: "outpost",
                homeRoom: "east",
                creeps: {
                    collector: 4,
                }
            },
            // septisBottom: {
            //     type: "outpost",
            //     homeRoom: "east",
            // },
            // underEast: {
            //     type: "outpost",
            //     homeRoom: "east",
            // },
            h2Right: {
                type: "outpost",
                homeRoom: "h2",
            },
            h2Left: {
                type: "outpost",
                homeRoom: "h2",
            },
            h2Lair: {
                type: "sourceKeeper",
                homeRoom: "h2",
                creeps: {
                    defender: 2,
                    harvester: 2,
                    collector: 3,
                }
            },
            caseRight: {
                type: "outpost",
                homeRoom: "casegrad",
                creeps: {
                    collector: 1,
                    // settler: 2,
                }
            },
            caseBottom: {
                type: "outpost",
                homeRoom: "casegrad",
                creeps: {
                    collector: 0,
                    // settler: 2,
                }
            },
            caseLeft: {
                type: "outpost",
                homeRoom: "casegrad",
            },
            caseX: {
                type: "outpost",
                homeRoom: "casegrad",
                creeps: {
                    collector: 0,
                    // settler: 2,
                }
            },
            dragonLeft: {
                type: "outpost",
                homeRoom: "dragon",
                spawnRooms: ['orphan'],
            },
            dragon2: {
                type: "outpost",
                homeRoom: "dragon",
                spawnRooms: ['orphan'],
            },
            brot: {
                type:"outpost",
                homeRoom:"home",
            },
            homeTop: {
                type:"outpost",
                homeRoom:"home",
            },
            homeTopTop: {
                type:"outpost",
                homeRoom:"moria",
            },
            homeLeft:{
                type:"outpost",
                homeRoom:"home",
            },
            moriaRight:{
                type:"outpost",
                homeRoom:"moria",
            },
            kmLower:{
                type:"outpost",
                homeRoom:"kaerMorhen",
            },
            moriaTop:{
                type:"outpost",
                homeRoom:"moria",
            },
            moriaBottom: {
                type: "outpost",
                homeRoom: "moria",
            },
            mork: {
                type: "outpost",
                homeRoom: "moria",
            },
            loneOutpost:{
                type:"outpost",
                homeRoom:"home",
            },
            kmRight: {
                type: "outpost",
                homeRoom: "kaerMorhen",
            },
            underKeepers: {
                type: "outpost",
                homeRoom: "moria",
            },
            brokilonTop: {
                type: "outpost",
                homeRoom: "orphan",
            },
            corner: {
                type: "outpost",
                homeRoom: "moria",
            },
            brokilon2t: {
                type: "outpost",
                homeRoom: "orphan",
            },
            lair1: {
                type: "sourceKeeper",
                homeRoom: "orphan",
                creeps: {
                    harvester: 2,
                    collector: 3,
                    defender: 2,
            //         rangedDefender: 0,
                },
            },
            lair2: {
                type: "sourceKeeper",
                homeRoom: "orphan",
                creeps: {
                    harvester: 2,
                    collector: 4,
                    defender: 2,
                },
            }
        },

        monitoring: {
            alwaysVisible: ['E69N46','E66N45', 'E66N44', 'E66N46'],
            watch: ['E63N40','E64N40','E65N40','E66N40','E67N40','E68N40','E69N40','E70N40',
                'E70N41','E70N42','E70N43','E70N44','E70N45','E70N46','E70N47','E70N48','E70N49','E70N50',
                'E67N50','E68N50','E69N50'],
        },

        spawn: {
            Rabbithole: {
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
            Drakenborg: {},
            Szczerbatek: {},
            Drago: {},
            Osaka: {},
            Kioto: {},
            Tokyo: {},
            Cintra: {},
            Oxygen: {
                defenderCase: {
                    minimum: 0,
                    priority: 'high',
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL],
                    memo: {
                        role: 'brawler',
                        room: 'E64N49',
                    }
                },
                settlerHelper: {
                    minimum: 0,
                    priority: 'normal',
                    body: 'settler',
                    memo: {
                        role: 'settler',
                        room: 'E65N48',
                    }
                },
                settlerHelperCollector: {
                    minimum: 2,
                    priority: 'normal',
                    body: 'collector',
                    memo: {
                        role: 'collector',
                        room: 'E65N48',
                        unloadRoom: 'casegrad'
                    }
                },
                settlerHelperXCollector: {
                    minimum: 2,
                    priority: 'normal',
                    body: 'collector',
                    memo: {
                        role: 'collector',
                        room: 'E63N48',
                        unloadRoom: 'casegrad'
                    }
                },
            },
            Hydrogen: {},
            Brokilon: {
                mudlaPush: {
                    minimum: 0,
                    priority: 'normal',
                    body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL],
                    memo: {
                        role: 'brawler',
                        room: 'E69N46',
                    }
                },
                mudlaPoke: {
                    minimum: 0,
                    priority: 'normal',
                    // body: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,
                    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                    //     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                    //     ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E69N45',
                        // guardFlag: 'Flag113',
                        // boost: [
                        //     {part: HEAL,resource: RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,amount: 7},
                        //     {part: TOUGH,resource: RESOURCE_CATALYZED_GHODIUM_ALKALIDE,amount: 5},
                        //     {part: MOVE,resource: RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,amount: 10}
                        // ],
                    }
                },
                testClean: {
                    minimum: 0,
                    priority: 'normal',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E68N45',
                        guardFlag: 'Flag114',
                    }
                },
            },
            Ys: {},

            Moria: {
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
            colonyTransfer: {
                body: 'mineralTransfer',
                role: 'transfer',
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
            colonyHarvesterLink: {
                body: 'harvesterLink',
                role: 'harvesterLink',
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
            rangedDefender: {
                body: 'rangedDefender',
                role: 'rangedDefender',
            },
            lairHarvester: {
                body: 'harvesterLair',
                role: 'harvester',
            },
        },
    }
})();

global.BOOST_RESULT_UPGRADE_CONTROLLER = 'upgradeController'; // increased controller upgrade rate
global.BOOST_RESULT_DISMANTLE = 'dismantle'; // faster dismantle
global.BOOST_RESULT_ATTACK = 'attack'; //stronger attack
global.BOOST_RESULT_RANGED_ATTACK = 'rangedAttack';
global.BOOST_RESULT_HEAL = 'heal'; // better healing
global.BOOST_RESULT_CAPACITY = 'capacity'; // increased capacity
global.BOOST_RESULT_FATIGUE = 'fatigue'; // faster fatigue reduction
global.BOOST_RESULT_DAMAGE = 'damage'; // increased resistance

if(!('REACTIONS_REVERSE' in global)) {
    function reverseReactions(reactions) {
        var results = {};

        _.each(reactions, (other, firstResource) => {
            _.each(other, (finalResource, secondResource) => {
                if(finalResource in results) {
                    return;
                }
                results[finalResource] = [firstResource, secondResource];
            })
        });

        return results;
    }

    global.REACTIONS_REVERSE = reverseReactions(REACTIONS);
}

if(!('RESOURCES_BASE' in global)) {
    global.RESOURCES_BASE = [
        RESOURCE_UTRIUM,
        RESOURCE_KEANIUM,
        RESOURCE_ZYNTHIUM,
        RESOURCE_LEMERGIUM,
        RESOURCE_OXYGEN,
        RESOURCE_HYDROGEN,
        RESOURCE_CATALYST,
        RESOURCE_ENERGY
    ];
}