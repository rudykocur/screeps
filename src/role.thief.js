var profiler = require('./profiler-impl');
var _ = require('lodash');
var logger = require('./logger');

var MoveTask = require('./task.move').MoveTask;
var CreepRole = require('./role').CreepRole;

var actionUtils = require('./action.utils');

class ThiefRole extends CreepRole {
    constructor(creep) {
        super(creep);
    }

    scheduleTask() {
        if(this.creep.memory.boostSelf) {
            if(this.tryBoostSelf(MOVE, BOOST_RESULT_FATIGUE)) {
                return;
            }
        }

        if(actionUtils.shouldHarvestEnergy(this.creep)) {
            let target = this.findTarget();

            if(!target) {
                logger.error('No steal target for', this.creep, 'in room', this.creep.memory.stealRoom);
                return;
            }

            if(this.creep.pos.isNearTo(target)) {
                let resource = this.getResourceToWithdraw(target);
                if(!resource) {
                    logger.error(this.creep, 'no resource to withdraw from', target);
                    return;
                }
                this.creep.withdraw(target, resource);
            }
            else {
                this.creep.addTask(MoveTask.create(this.creep, target, 1));
            }
        }
        else {
            let target = this.getUnloadTarget();

            if(this.creep.pos.isNearTo(target)) {
                let resource = this.getUnloadResource();
                this.creep.transfer(target, resource);
            }
            else {
                this.creep.addTask(MoveTask.create(this.creep, target, 1));
            }
        }
    }

    findTarget() {
        let searchStructures = [STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_CONTAINER, STRUCTURE_LAB, STRUCTURE_LINK];
        /** @type Room */
        let room = Game.rooms[this.creep.memory.stealRoom];

        let target;

        let mineralFilter = function(struct) {
            if(struct instanceof StructureTerminal || struct instanceof StructureStorage || struct instanceof StructureContainer) {
                return _.sum(struct.store) > 0
            }

            if(struct instanceof  StructureLab) {
                return struct.mineralAmount > 0
            }

            if(struct instanceof StructureLink) {
                return struct.energyCapacity > 0;
            }

            return false;
        };

        if(!target) {
            target = _.first(this.creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1, {
                filter: s => mineralFilter(s)
            }));
        }

        if(!target) {
            target = _.first(room.find(FIND_STRUCTURES, {
                filter: s => mineralFilter(s)
            }));
        }

        return target;
    }

    getResourceToWithdraw(target) {
        if(target instanceof StructureStorage || target instanceof StructureTerminal || target instanceof StructureContainer) {
            let store = target.store;
            let minerals = _.omit(store, RESOURCE_ENERGY);
            let mineral = _.first(_.keys(minerals));

            if(mineral) {
                return mineral;
            }

            if(store.energy > 0) {
                return RESOURCE_ENERGY;
            }
        }

        if(target instanceof StructureLab) {
            return target.mineralType;
        }

        if(target instanceof StructureLink) {
            return RESOURCE_ENERGY;
        }
    }

    getUnloadTarget() {
        let room = Game.rooms[this.creep.memory.unloadRoom];

        return room.getStorage();
    }

    getUnloadResource() {
        let carry = this.creep.carry;
        let minerals = _.omit(carry, RESOURCE_ENERGY);
        let mineral = _.first(_.keys(minerals));

        if(mineral) {
            return mineral;
        }

        if(carry.energy > 0) {
            return RESOURCE_ENERGY;
        }
    }
}

module.exports = (function() {

    return {
        scheduleTask(creep) {
            new ThiefRole(creep).scheduleTask();
        },

    }
})();

profiler.registerClass(ThiefRole, 'role-thief-class');