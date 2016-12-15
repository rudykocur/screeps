module.exports = (function() {
    var enabled = false;


    class Profiler {
        constructor() {
            this.frame = this.topFrame = {
                name: 'top',
                children: [],
                cpuStart: this.getCpu(),
                cpuEnd: null,
            };

            this.stack = [this.topFrame];
        }

        getCpu() {
            return Game.cpu.getUsed();
        }

        begin(name) {
            let newFrame = {
                name: name,
                children: [],
                cpuStart: this.getCpu(),
                cpuEnd: null,
            };

            this.frame.children.push(newFrame);
            this.frame = newFrame;
            this.stack.push(newFrame);
        }

        end() {
            this.frame.cpuEnd = this.getCpu();
            this.stack.pop();
            this.frame = this.stack[this.stack.length-1];
        }

        flattenAndPrint() {
            var lines = [];

            function printNode(node, depth, target) {
                var indent = '';
                for(let i = 0; i < depth; i++) {
                    indent += '   ';
                }

                target.push(indent + (node.cpuEnd - node.cpuStart).toFixed(3) + ' ' + node.name);

                node.children.forEach(child => printNode(child, depth + 1, target));
            }

            printNode(this.topFrame, 0, lines);

            console.log(lines.join('\n'));

            // Game.notify(lines.join('\n'));
        }
    }

    /** @type Profiler */
    var profilerInstance;

    var functionBlackList = ['constructor'];

    function hookUpPrototypes() {
        var prototypes = [
        { name: 'Game', val: Game },
        { name: 'Room', val: Room },
        { name: 'Structure', val: Structure },
        { name: 'Spawn', val: Spawn },
        { name: 'Creep', val: Creep },
        { name: 'RoomPosition', val: RoomPosition },
        { name: 'Source', val: Source },
        { name: 'Flag', val: Flag },
      ];

      prototypes.forEach(proto => {
        profileObjectFunctions(proto.val, proto.name);
      });
    }

    function profileObjectFunctions(object, label) {
      const objectToWrap = object.prototype ? object.prototype : object;

      Object.getOwnPropertyNames(objectToWrap).forEach(functionName => {
        const extendedLabel = `${label}.${functionName}`;
        try {
          const isFunction = typeof objectToWrap[functionName] === 'function';
          const notBlackListed = functionBlackList.indexOf(functionName) === -1;
          if (isFunction && notBlackListed) {
            const originalFunction = objectToWrap[functionName];
            objectToWrap[functionName] = profileFunction(originalFunction, extendedLabel);
          }
        } catch (e) { } /* eslint no-empty:0 */
      });

      return objectToWrap;
    }

    function profileFunction(fn, functionName) {
      const fnName = functionName || fn.name;
      if (!fnName) {
        console.log('Couldn\'t find a function name for - ', fn);
        console.log('Will not profile this function.');
        return fn;
      }

      return wrapFunction(fnName, fn);
    }

    function getFilter() {
        return null;
    }

    function wrapFunction(name, originalFunction) {
      return function wrappedFunction() {
        if (enabled) {
          const nameMatchesFilter = name === getFilter();

            profilerInstance.begin(name);

          // const start = Game.cpu.getUsed();
          // if (nameMatchesFilter) {
          //   depth++;
          // }
          const result = originalFunction.apply(this, arguments);

            profilerInstance.end();

          // if (depth > 0 || !getFilter()) {
          //   const end = Game.cpu.getUsed();
          //   Profiler.record(name, end - start);
          // }
          // if (nameMatchesFilter) {
          //   depth--;
          // }
          return result;
        }

        return originalFunction.apply(this, arguments);
      };
    }

    return {

        wrap(callback) {
            // if (enabled) {
            //   setupProfiler();
            // }

            if (enabled) {
              profilerInstance = new Profiler();

              const returnVal = callback();
              profilerInstance.end();

            if(Memory.profiler.print) {
                profilerInstance.flattenAndPrint();
                delete Memory.profiler.print;
            }

              return returnVal;
            }

            return callback();
          },

        enable() {
            enabled = true;
            hookUpPrototypes();
        },

        begin(name) {
            if(enabled) {
                profilerInstance.begin(name);
            }
        },

        end() {
            if(enabled) {
                profilerInstance.end();
            }
        },

        print() {
            if(enabled) {
                profilerInstance.flattenAndPrint();
            }
        },

        getProfiler() {return profilerInstance},

        registerObject: profileObjectFunctions,
        registerFN: profileFunction,
        registerClass: profileObjectFunctions,
    }
})();