const profiler = require('screeps-profiler');

const config = require('config');
const logger = require('logger');
const creepSpawn = require('creepSpawn');
const roomHandlers = require('room.handlers');
const spawnQueue = require('spawnQueue');

const roleCollector = require('role.collector');

module.exports = (function() {
    return {
        handler: class SourceKeeperRoom extends roomHandlers.RoomHander {
            constructor(roomName, state, config) {
                super(roomName, state, config);

                this.type = 'sourceKeeper';
            }

            process() {
                super.process();

                if(this.state.sources) {

                }
                else {
                    if(this.room) {
                        this.discoverRoom();
                    }
                    else {
                        this.sendScout();
                    }
                }
            }

            discoverRoom() {
                var sources = this.room.find(FIND_SOURCES);

                this.state.sources = sources.map(s => {
                    return {
                        id: s.id,
                        pos: s.pos,
                    }
                });

                var lairs = this.room.find(FIND_STRUCTURES).filter(/**Structure*/ struct => struct.structureType == STRUCTURE_KEEPER_LAIR)

                this.state.lairs = lairs.map(/**StructureKeeperLair*/ struct => {
                    return {
                        id: struct.id,
                        pos: struct.pos,
                    }
                })
            }

            sendScout() {
                var blueprint = config.blueprints.outpostScout;
                var scout = _.first(this.findCreeps(blueprint.role));

                if(!scout) {
                    var memo = _.defaults({
                        room: this.roomId,
                        role: blueprint.role,
                    });

                    spawnQueue.enqueueCreep(spawnQueue.PRIORITY_LOW, this.homeRoom(),
                        this.getCreepName('scout'), blueprint.body, memo);
                }
            }


            maintainPopulation(type, blueprint, priority) {
                if(!this.config.creeps || !this.config.creeps[type]) {
                    return;
                }

                var creeps = this.findCreeps(blueprint.role);

                if(creeps.length < this.config.creeps[type]) {
                    var memo = _.defaults({
                        room: this.room.name,
                        role: blueprint.role,
                    }, blueprint.memo);

                    spawnQueue.enqueueCreep(priority, this.homeRoom(), this.getCreepName(type),
                        blueprint.body, memo);
                }
            }

            homeRoom() {
                return Room.byCustomName(this.config.homeRoom);
            }

            getCreepName(type) {
                return 'sk_'+this.roomName+'_'+type+'_';
            }
        }
    }
})();

profiler.registerClass(module.exports.handler, 'SourceKeeperRoom');