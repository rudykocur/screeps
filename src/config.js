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
            E69N44: "dragon",
        },
        market: {
            processInterval: 30,
            maxTradeRange: 35,
            minerals: {
                [RESOURCE_OXYGEN]: {
                    buyPriceMax: 0.4,
                    sellPriceMin: 0.41,
                },
                [RESOURCE_HYDROGEN]: {
                    buyPriceMax: 0.85,
                    sellPriceMin: 0.71,
                },
                [RESOURCE_LEMERGIUM]: {
                    buyPriceMax: 0.5,
                    sellPriceMin: 0.15,
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
                creeps: {
                    upgrader: 4,
                    mover: 2,
                    transfer: 3,
                },
                observeRoom: 'E69N44',
                minerals: {
                    wants: {
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_LEMERGIUM]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_HYDROXIDE]: 2000,
                    },
                    reserve: {
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 2000,
                        [RESOURCE_UTRIUM]: 12000,
                        [RESOURCE_GHODIUM]: 5000,
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 0,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 0,
                        [RESOURCE_CATALYZED_UTRIUM_ACID]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_OXYGEN],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_OXYGEN]: 5000,
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 500,
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 1000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 1000,
                        [RESOURCE_CATALYZED_UTRIUM_ACID]: 1000,
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
                        // D3: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'C2'],
                        output: ['A1', 'A2', 'A3', 'B1', 'B3', 'D1', 'D2', 'D3'],
                        result: RESOURCE_GHODIUM,
                        amount: 10000,
                    },
                }
            },
            moria: {
                type: "colony",
                panicMode: false,
                autobuyMinerals: true,
                wallsHp: 3000000,
                structRampartsHp: 10000000,
                observeRoom: 'E68N44',
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
                        [RESOURCE_CATALYZED_GHODIUM_ACID]: 1000,
                    },
                    reserve: {
                        [RESOURCE_HYDROXIDE]: 0,
                        [RESOURCE_GHODIUM]: 5000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_ZYNTHIUM],
                    require: {
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_ZYNTHIUM]: 5000,
                        [RESOURCE_GHODIUM]: 10000,
                        [RESOURCE_HYDROXIDE]: 3000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 5000,
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
                        // C1: RESOURCE_CATALYZED_GHODIUM_ACID,
                    },
                    produce: {
                        input: ['C1', 'C2'],
                        output: ['A1', 'A2', 'B1', 'B2', 'D3', 'E1', 'E2', 'E3'],
                        result: RESOURCE_GHODIUM,
                        amount: 15000,
                    },
                },
            },
            kaerMorhen: {
                type: "colony",
                wallsHp: 1000000,
                autobuyMinerals: true,
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
                        [RESOURCE_HYDROXIDE]: 3000,
                        [RESOURCE_UTRIUM]: 12000,
                    },
                    reserve: {
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 0,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 0,
                        [RESOURCE_GHODIUM]: 5000,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_LEMERGIUM],
                    require: {
                        [RESOURCE_LEMERGIUM]: 5000,
                        [RESOURCE_ENERGY]: 200000,
                        [RESOURCE_GHODIUM]: 10000,
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 5000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 5000,
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
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A1', 'A2', 'B1', 'B4', 'C1', 'C2', 'C3', 'C4'],
                        result: RESOURCE_GHODIUM,
                        amount: 10000,
                    },
                },
            },
            orphan: {
                type: "colony",
                wallsHp: 700000,
                autobuyMinerals: true,
                observeRoom: 'E68N45',
                creeps: {
                    upgrader: 4,
                    mover: 2,
                    transfer: 3,
                },
                minerals: {
                    wants: {
                        [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 8000,
                        [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 8000,
                        [RESOURCE_CATALYZED_UTRIUM_ACID]: 8000,
                        [RESOURCE_UTRIUM]: 13000,
                        [RESOURCE_ZYNTHIUM]: 13000,
                        [RESOURCE_OXYGEN]: 13000,
                        [RESOURCE_HYDROGEN]: 13000,
                        [RESOURCE_ENERGY]: 500000,
                    },
                    reserve: {
                        [RESOURCE_GHODIUM]: 5000,
                        [RESOURCE_HYDROXIDE]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_LEMERGIUM],
                    require: {
                        [RESOURCE_LEMERGIUM]: 5000,
                        [RESOURCE_ENERGY]: 25000,
                        [RESOURCE_GHODIUM]: 10000,
                        [RESOURCE_HYDROXIDE]: 10000,
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
                        // B4: RESOURCE_CATALYZED_UTRIUM_ACID,
                    },
                    produce: {
                        input: ['B2', 'B3'],
                        output: ['A1', 'A2', 'B1', 'B4', 'C1', 'C2', 'C3', 'C4'],
                        // output: ['B1', 'B4', 'C1', 'C2', 'C3'],
                        result: RESOURCE_HYDROXIDE,
                        amount: 10000,
                    },
                }
            },
            east: {
                type: "colony",
                panicMode: false,
                wallsHp: 100000,
                // importEnabled: false,
                creeps: {
                    mover: 2,
                    upgrader: 3,
                    transfer: 2,
                },
                minerals: {
                    wants: {
                        // [RESOURCE_ENERGY]: 0,
                    },
                    reserve: {
                        // [RESOURCE_HYDROGEN]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_HYDROGEN],
                    require: {
                        [RESOURCE_HYDROGEN]: 5000,
                        [RESOURCE_ENERGY]: 40000,
                    }
                },
            },
            h2: {
                type: "colony",
                wallsHp: 50000,
                creeps: {
                    mover: 2,
                    upgrader: 6,
                    transfer: 2,
                },
                minerals: {
                    wants: {
                        // [RESOURCE_ENERGY]: 0,
                    },
                    reserve: {
                        // [RESOURCE_HYDROGEN]: 0,
                    }
                },
                terminal: {
                    autosell: [RESOURCE_HYDROGEN],
                    require: {
                        [RESOURCE_HYDROGEN]: 5000,
                        [RESOURCE_ENERGY]: 40000,
                    }
                },
            },
            // dragon: {
            //     type: "outpost",
            //     homeRoom: "orphan",
            //     creeps: {
            //         collector: 0,
            //         harvester: 0,
            //         claimer: 0,
            //         settler: 0,
            //     }
            // },
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
            underEast: {
                type: "outpost",
                homeRoom: "east",
            },
            h2Right: {
                type: "outpost",
                homeRoom: "h2",
            },
            h2Left: {
                type: "outpost",
                homeRoom: "h2",
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
            Drakenborg: {},
            Osaka: {},
            Tokyo: {
                kickDragon: {
                    minimum: 0,
                    priority: 'defence',
                    body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    memo: {
                        role: 'brawler',
                        room: 'E71N46'
                    }
                }
            },
            Cintra: {},
            Oxygen: {},
            Brokilon: {
                dragonController: {
                    minimum: 2,
                    priority: 'normal',
                    body: [CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE],
                    memo: {
                        role: 'claimer',
                        room: 'E69N44',
                    }
                },
                dragonController2_: {
                    minimum: 1,
                    priority: 'normal',
                    body: [CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,
                        CLAIM,CLAIM,CLAIM,CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE],
                    memo: {
                        role: 'claimer',
                        room: 'E68N45',
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
    ];
}