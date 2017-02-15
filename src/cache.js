var profiler = require('./profiler-impl');
var _ = require('lodash');

module.exports = (function() {
    return {
        /**
         *
         * @param {RoomPosition} from
         * @param {RoomPosition} to
         * @param callback
         */
        getPath: function(from, to, callback) {
            Memory.cache = Memory.cache || {};
            let cache = Memory.cache.path = Memory.cache.path || {};
            let path;

            let cacheKey = `path-${from.roomName}-${from.x},${from.y}-to-${to.roomName}-${to.x}-${to.y}`;

            if(!(cacheKey in cache)) {
                path = callback();

                if(path.length > 0) {
                    let ttl;
                    if (from.roomName == to.roomName) {
                        ttl = path.length * 4;
                    }
                    else {
                        ttl = 200;
                    }

                    cache[cacheKey] = {
                        expires: Game.time + ttl,
                        path: Room.serializePath(path),
                    }
                }
            }
            else {
                path = Room.deserializePath(cache[cacheKey].path);
            }

            return path;
        },

        pruneCache: function() {
            Memory.cache = Memory.cache || {};
            Memory.cache.path = Memory.cache.path || {};

            let toDelete = [];
            _.each(Memory.cache.path, (data, key) => {
                if(Game.time > data.expires) {
                    toDelete.push(key);
                }
            });

            toDelete.forEach(key => delete Memory.cache.path[key]);
        },
    };
})();

profiler.registerObject(module.exports, 'cache');