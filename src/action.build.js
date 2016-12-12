module.exports = {
    /**
     * @param {Creep} creep
     */
    findNewStructureToRepair:  function(creep) {
        // already started repairing
        if(creep.memory.repairTarget) {
            return false;
        }

        /** @type {Structure} */
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: /**OwnedStructure*/struct => {
                if((struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART) && struct.hits > 5000) {
                    return false;
                }
                var hpLeft = struct.hits / struct.hitsMax;

                return hpLeft < 0.55;
            }
        });

        var target = _.first(_.sortBy(targets, s => (s.hits / s.hitsMax)));

        if(target) {
            creep.say("Start repairing " + target.structureType);
            creep.memory.repairTarget = target.id;
            return true;
        }
        else {
            delete creep.memory['repairTarget'];
        }

        return false;
    },

    actionTryBuild: function(creep) {
        if(_.sum(creep.carry) == 0) {return false;}

        var target;

        var priority = Memory.buildQueue || [];

        while(priority.length > 0) {
            var tmp = priority[0];
            var tmpTarget = Game.getObjectById(tmp);
            if(!tmpTarget) {
                priority.splice(0, 1);
            }
            else {
                target = tmpTarget;
                break;
            }
        }

        if(!target) {
            target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        }

        if(target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            return true;
        }

        return false
    },

    actionTryRepair: function(creep) {
        if(_.sum(creep.carry) == 0) {return false;}

        if(creep.memory.repairTarget) {
            /** @type {Structure} */
            var target = Game.getObjectById(creep.memory.repairTarget);

            if(target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else {
                    if(target.hits == target.hitsMax) {
                        delete creep.memory['repairTarget'];
                    }
                }

                return true;
            }
        }

        return false;
    },

};