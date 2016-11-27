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
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(struct) {
                var hpLeft = struct.hits / struct.hitsMax;

                return hpLeft < 0.55;
            }
        });

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
        var target;

        var priority = Memory.buildPriority || [];

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
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
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