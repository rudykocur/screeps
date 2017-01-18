var profiler = require('./profiler-impl');
var _ = require('lodash');

var JobGenerator = require('./jobs.base').JobGenerator;

class LabsJobGenerator extends JobGenerator {

    constructor(handler) {
        super(handler);

        this.interval = 9;

        // TODO: convert to this.handler.getLabByName
        this.labNameToId = {};
        _.each(_.get(this.config, 'labs.names', {}), (labName, labId) => {
            this.labNameToId[labName] = labId;
        });
    }

    generateJobs() {
        this.createLabTransfers();
        this.createLabTransfers2();
        this.createBoostTransfers();
        this.createEmptyUnusedLabTransfers();
    }

    createLabTransfers2() {
        var jobs = this.state.jobs;
        let reaction = this.handler.state.lab.currentReaction;
        let resultResource = this.handler.state.lab.currentResult;
        let config = _.get(this.config, 'labs.produce', null);
        var storage = this.room.getStorage();

        if(!reaction || !config) {
            return;
        }

        config.input.forEach((labName, index) => {
            let resource = reaction[index];

            var labId = this.labNameToId[labName];
            /** @type StructureLab */
            var lab = Game.getObjectById(labId);

            let emptyJobKey = `labs-${labName}-empty-${this.room.customName}`;

            if (lab.mineralType && lab.mineralType != resource) {

                if (!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, storage, lab.mineralType);
                }

                jobs[emptyJobKey].amount = lab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];

                var key = `labs-${labName}-withdraw-${storage.structureType}-${resource}`;
                if (lab.mineralAmount < 2000 && storage.store[resource] > 0) {

                    if (!(key in jobs)) {
                        jobs[key] = this._getJobTransferDict(key, storage, lab, resource);
                    }

                    jobs[key].amount = lab.mineralCapacity - lab.mineralAmount;
                }
                else {
                    delete jobs[key];
                }
            }
        });

        config.output.forEach(labName => {
            /** @type StructureLab */
            var outLab = Game.getObjectById(this.labNameToId[labName]);

            // var resultResource = REACTIONS[reaction.load[0]][reaction.load[1]];

            let emptyJobKey = `labs-${labName}-empty-${outLab.mineralType}`;

            if (outLab.mineralType && outLab.mineralType != resultResource) {
                if (!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, outLab, storage, outLab.mineralType);
                }

                jobs[emptyJobKey].amount = outLab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];
            }
        })
    }

    createLabTransfers() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();
        var terminal = this.room.getTerminal();

        _.get(this.config, 'labs.reactions', []).forEach(reaction => {

            reaction.load.forEach((resource, index) => {
                var labName = reaction.labs[index];
                var labId = this.labNameToId[labName];
                /** @type StructureLab */
                var lab = Game.getObjectById(labId);

                let emptyJobKey = `labs-${labName}-empty-${lab.mineralType}`;

                if (lab.mineralType && lab.mineralType != resource) {

                    if (!(emptyJobKey in jobs)) {
                        jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, storage, lab.mineralType);
                    }

                    jobs[emptyJobKey].amount = lab.mineralAmount;
                }
                else {
                    delete jobs[emptyJobKey];

                    [storage, terminal].forEach(struct => {
                        var key = `labs-${labName}-withdraw-${struct.structureType}-${resource}`;
                        if (lab.mineralAmount < 2000 && struct.store[resource] > 0) {

                            if (!(key in jobs)) {
                                jobs[key] = this._getJobTransferDict(key, struct, lab, resource);
                            }

                            jobs[key].amount = lab.mineralCapacity - lab.mineralAmount;
                        }
                        else {
                            delete jobs[key];
                        }
                    });
                }
            });

            var outLabName = reaction.labs[2];
            /** @type StructureLab */
            var outLab = Game.getObjectById(this.labNameToId[outLabName]);

            var resultResource = REACTIONS[reaction.load[0]][reaction.load[1]];

            let emptyJobKey = `labs-${outLabName}-empty-${outLab.mineralType}`;

            if (outLab.mineralType && outLab.mineralType != resultResource) {
                if (!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, outLab, storage, outLab.mineralType);
                }

                jobs[emptyJobKey].amount = outLab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];
            }
        });
    }

    createBoostTransfers() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();

        _.each(_.get(this.config, 'labs.boost', {}), (resource, labName) => {
            /** @type StructureLab */
            var lab = Game.getObjectById(this.labNameToId[labName]);

            let emptyJobKey = `labs-${labName}-empty-${lab.mineralType}`;
            let loadEnergyKey = `labs-${labName}-load-energy`;

            if(lab.mineralType && lab.mineralType != resource) {
                if(!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, storage, lab.mineralType);
                }

                jobs[emptyJobKey].amount = lab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];

                let key = `labs-${labName}-load-boost-${resource}`;

                if(lab.mineralAmount < lab.mineralCapacity && storage.store[resource] > 0) {
                    if (!(key in jobs)) {
                        jobs[key] = this._getJobTransferDict(key, storage, lab, resource);
                    }

                    jobs[key].amount = lab.mineralCapacity - lab.mineralAmount;
                }
                else {
                    delete jobs[key];
                }
            }

            if(lab.energy < lab.energyCapacity) {
                if (!(loadEnergyKey in jobs)) {
                    jobs[loadEnergyKey] = this._getJobTransferDict(loadEnergyKey, storage, lab, RESOURCE_ENERGY);
                }

                jobs[loadEnergyKey].amount = lab.energyCapacity - lab.energy;
            }
            else {
                delete jobs[loadEnergyKey];
            }
        })
    }

    createEmptyUnusedLabTransfers() {
        var jobs = this.state.jobs;
        var storage = this.room.getStorage();

        var allLabs = _.values(_.get(this.config, 'labs.names', {}));
        var unusedLabs = _.values(_.get(this.config, 'labs.names', {}));
        var outputLabs = [];

        _.get(this.config, 'labs.reactions', []).forEach(/**ReactionConfig*/reaction => {
            unusedLabs = _.without(unusedLabs, reaction.labs[0], reaction.labs[1]);
            if(outputLabs.indexOf(reaction.labs[2]) < 0) {
                outputLabs.push(reaction.labs[2]);
            }
        });

        unusedLabs = _.without(unusedLabs, ..._.get(this.config, 'labs.produce.input', []));
        unusedLabs = _.without(unusedLabs, ..._.keys(_.get(this.config, 'labs.boost')));

        outputLabs.push(..._.get(this.config, 'labs.produce.output', []));

        allLabs.forEach(labName => {
            /** @type StructureLab */
            var lab = Game.getObjectById(this.labNameToId[labName]);

            let key = `labs-${labName}-empty-all`;

            let shouldEmpty = (unusedLabs.indexOf(labName) >= 0 && lab.mineralType);
            if(shouldEmpty) {
                if(outputLabs.indexOf(labName) >= 0 && lab.mineralAmount < 500) {
                    shouldEmpty = false;
                }
            }

            if(shouldEmpty) {
                if(!(key in jobs)) {
                    jobs[key] = this._getJobTransferDict(key, lab, storage, lab.mineralType);
                }
                jobs[key].amount = lab.mineralAmount;
            }
            else {
                delete jobs[key];
            }
        })
    }
}

module.exports = (function() {
    return {
        LabsJobGenerator: LabsJobGenerator
    }
})();

profiler.registerClass(LabsJobGenerator, 'LabsJobGenerator');