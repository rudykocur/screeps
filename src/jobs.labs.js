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
        this.createBoostTransfers();
        this.createEmptyUnusedLabTransfers();
    }

    createLabTransfers() {
        var jobs = this.state.jobs;
        let reaction = this.handler.state.lab.currentReaction;
        let resultResource = this.handler.state.lab.currentResult;
        let config = _.get(this.config, 'labs.produce', null);
        let boostLabs = _.get(this.config, 'labs.boost', {});
        let storage = this.room.getStorage();
        let terminal = this.room.getTerminal();

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
                let emptyTarget = (RESOURCES_BASE.indexOf(lab.mineralType)>=0 ? storage : terminal);

                if (!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, emptyTarget, lab.mineralType);
                }

                jobs[emptyJobKey].amount = lab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];

                [storage, terminal].forEach(/**StructureStorage*/struct => {
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

        let outLabs = _.without(config.output, ..._.keys(boostLabs));
        outLabs.forEach(labName => {
            /** @type StructureLab */
            var outLab = Game.getObjectById(this.labNameToId[labName]);

            let emptyJobKey = `labs-${labName}-empty-${outLab.mineralType}`;

            if (outLab.mineralType && outLab.mineralType != resultResource) {
                let emptyTarget = (RESOURCES_BASE.indexOf(outLab.mineralType)>=0 ? storage : terminal);

                if (!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, outLab, emptyTarget, outLab.mineralType);
                }

                jobs[emptyJobKey].amount = outLab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];
            }
        })
    }

    createBoostTransfers() {
        var jobs = this.state.jobs;

        var storage = this.room.getStorage();
        let terminal = this.room.getTerminal();

        _.each(_.get(this.config, 'labs.boost', {}), (resource, labName) => {
            /** @type StructureLab */
            var lab = Game.getObjectById(this.labNameToId[labName]);

            let emptyJobKey = `labs-${labName}-empty-${lab.mineralType}`;
            let loadEnergyKey = `labs-${labName}-load-energy`;

            if(lab.mineralType && lab.mineralType != resource) {
                let emptyTarget = (RESOURCES_BASE.indexOf(lab.mineralType)>=0 ? storage : terminal);

                if(!(emptyJobKey in jobs)) {
                    jobs[emptyJobKey] = this._getJobTransferDict(emptyJobKey, lab, emptyTarget, lab.mineralType);
                }

                jobs[emptyJobKey].amount = lab.mineralAmount;
            }
            else {
                delete jobs[emptyJobKey];

                [storage, terminal].forEach(/**StructureStorage*/struct => {
                    let key = `labs-${labName}-load-boost-${struct.structureType}-${resource}`;

                    if(lab.mineralAmount < lab.mineralCapacity && struct.store[resource] > 0) {
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
        let terminal = this.room.getTerminal();

        var allLabs = _.values(_.get(this.config, 'labs.names', {}));
        var unusedLabs = _.values(_.get(this.config, 'labs.names', {}));
        var outputLabs = [];

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
                let emptyTarget = (RESOURCES_BASE.indexOf(lab.mineralType)>=0 ? storage : terminal);

                if(!(key in jobs)) {
                    jobs[key] = this._getJobTransferDict(key, lab, emptyTarget, lab.mineralType);
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