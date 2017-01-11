var profiler = require('./profiler-impl');
var _ = require('lodash');

module.exports = (function() {
    return {
        getNextId: function(counterName) {
            Memory.counters = Memory.counters || {};
            var counters = Memory.counters;

            counters[counterName] = counters[counterName] || 1;

            if(counters[counterName] > 1000000) {
                counters[counterName] = 1;
            }

            return counters[counterName]++;
        },

        getRoomsAround(startRoom, range) {
            var toCheck = [startRoom];
            var checked = [];
            var result = [];

            while(toCheck.length > 0) {
                let room = toCheck.pop();

                let aroundRooms = _.values(Game.map.describeExits(room));

                for(let neighbour of aroundRooms) {
                    if(checked.indexOf(neighbour) < 0 && Game.map.getRoomLinearDistance(startRoom, neighbour) <= range) {
                        toCheck.push(neighbour);
                        result.push(neighbour);
                    }
                }
                checked.push(room);
            }

            return _.sortBy(_.uniq(result));
        }
    }

})();