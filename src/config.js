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
            E66N47: "h2",
        },
        market: {
            processInterval: 30,
            maxTradeRange: 35,
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
                wallsHp: 2000000,
                autobuyMinerals: true,
                creeps: {
                    upgrader: 4,
                    mover: 2,
                    transfer: 2,
                },
                observeRoom: 'E66N44',
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
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 2000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_OXYGEN],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_OXYGEN]: 50000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 500,
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
                        D3: RESOURCE_CATALYZED_GHODIUM_ACID,
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
                wallsHp: 2000000,
                creeps: {
                    upgrader: 3,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 1000,
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
                        [RESOURCE_HYDROXIDE]: 5000,
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
                    },
                    boost: {
                        C1: RESOURCE_CATALYZED_GHODIUM_ACID,
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
                wallsHp: 1000000,
                autobuyMinerals: true,
                creeps: {
                    upgrader: 8,
                    mover: 2,
                    transfer: 2,
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
            orphan: {
                type: "colony",
                wallsHp: 350000,
                creeps: {
                    upgrader: 4,
                    mover: 3,
                    transfer: 3,
                }
            },
            east: {
                type: "colony",
                panicMode: false,
                wallsHp: 100000,
                creeps: {
                    mover: 2,
                    upgrader: 4,
                    transfer: 2,
                }
            },
            h2: {
                type: "colony",
                creeps: {
                    mover: 0,
                    upgrader: 0,
                    transfer: 0,
                    settler: 2,
                },
            },
            eastBottom: {
                type: "outpost",
                homeRoom: "east",
            },
            eastBottomFar: {
                type: "outpost",
                homeRoom: "east",
            },
            septis: {
                type: "outpost",
                homeRoom: "east",
            },
            septisBottom: {
                type: "outpost",
                homeRoom: "east",
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
            // lair1: {
            //     type: "sourceKeeper",
            //     homeRoom: "orphan",
            //     creeps: {
            //         harvester: 0,
            //         collector: 0,
            //
            //         defender: 0,
            //         rangedDefender: 0,
            //     },
            // }
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
            Tokyo: {
                claimH2: {
                    minimum: 0,
                    priority: 'critical',
                    body: [CLAIM],
                    memo: {
                        role: 'claimer',
                        claim: true,
                    }
                }
            },
            Cintra: {},
            Oxygen: {},
            Brokilon: {
                fighter: {
                    minimum: 0,
                    priority: 'critical',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E69N48',
                    }
                },
                workH2: {
                    minimum: 4,
                    priority: 'normal',
                    body: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
                    memo: {
                        role: 'settler',
                        room: 'E66N47',
                        via: ['E67N44', 'E67N45', 'E67N46', 'E67N47', 'E66N47'],
                    }
                },
                upgradeH2: {
                    minimum: 3,
                    priority: 'normal',
                    body: [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
                    memo: {
                        role: 'settler',
                        room: 'E66N47',
                        disableBuild: true,
                        disableSpawn: true,
                        via: ['E67N44', 'E67N45', 'E67N46', 'E67N47', 'E66N47'],
                    }
                },
                defendH2: {
                    minimum: 1,
                    priority: 'normal',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E66N47',
                    }
                }
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