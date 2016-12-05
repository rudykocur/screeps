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
        }
    }

})();