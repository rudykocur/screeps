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
                    // harvester: 2,
                    mover: 2,
                },
            },
            moria: {
                type: "colony",
                panicMode: false,
                creeps: {
                    upgrader: 4,
                    builder: 1,
                    // harvester: 2,
                    mover: 2,
                }
            },
            kaerMorhen: {
                type: "colony",
                panicMode: true,
                creeps: {
                    upgrader: 7,
                    builder: 1,
                    mover: 2,
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
                    claimer: 1,
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
                harvesterMineral: {
                    minimum: 1,
                    body: 'mineralHarvester',
                    priority: 'normal',
                    memo: {
                        role: 'harvester',
                        energySourceId: '5843ec060750719d418e9488'
                    }
                },
                mineralTransfer: {
                    minimum: 1,
                    body: 'mineralTransfer',
                    priority: 'normal',
                    memo: {
                        role: 'transfer',
                        transferResource: RESOURCE_OXYGEN,
                        energySourceId: '5843ec060750719d418e9488'
                    }
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
                moriaHarvesterMineral: {
                    minimum: 1,
                    body: 'mineralHarvester',
                    priority: 'normal',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57efa11d08bd77920836f23f'
                    }
                },
                moriaMineralTransfer: {
                    minimum: 1,
                    body: 'mineralTransfer',
                    priority: 'normal',
                    memo: {
                        role: 'transfer',
                        transferResource: RESOURCE_ZYNTHIUM,
                    }
                },
            },

            "Kaer Morhen": {
                kmHarvesterTop: {
                    minimum: 1,
                    body: 'harvester',
                    priority: 'high',
                    memo: {
                        role: 'harvester',
                        energySourceId: '57ef9ee886f108ae6e6101b8',
                    }
                },
                kmHarvesterBottom: {
                    minimum: 1,
                    body: 'harvester',
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