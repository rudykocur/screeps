var _ = require('lodash');

/**
 *
 * @param {Array} list
 * @param result
 */
function iteratePermutations(list, result) {
    var total = 0;
    var level = 0;
    var checked = list.map(i => []);

    let stack = [];
    while(true) {

        let checkLevel = checked[level];

        let available = _.without(list, ...stack);
        available = _.without(available, ...checkLevel);
        if(available.length == 0) {
            if(level == 0 && checked[0].length == list.length) {
                break;
            }

            checked[level] = [];
            stack.pop();
            level--;
            continue;
        }

        let pick = available.pop();
        checked[level].push(pick);
        stack.push(pick);

        if(stack.length == list.length) {
            // console.log('FOUND', stack);
            result.push(stack.slice());
            total++;
            stack.pop();
        }
        else {
            level++;
        }



        // if(level < list.length) {
        //
        // }

        // let available = list.slice();
        // for (let i = stack.length; i < list.length; i++) {
        //     let checkLevel = checked[i];
        //     // let pick = _.without(available, checkLevel)[0];
        //     console.log('at level', i, '::', available);
        //     let pick = available.pop();
        //     checkLevel.push(pick);
        //     stack.push(pick);
        // }
        //
        // console.log(stack);
        // console.log(checked);
    }

    console.log('Total found', total);

    // while(checked[0].length <= list.length) {
    //     list.forEach(item => {
    //
    //     })
    // }
}

function generatePermutations(list, current, results) {
    list.forEach(item => {
        let rest = _.without(list, item);
        current.push(item);

        if(rest.length > 0) {
            generatePermutations(rest, current, results);
        }
        else {
            // console.log('Final set', current);
            results.push(current.slice());
        }

        current.pop();
    })
}

module.exports = (function() {
    return {
        foo() {
            // let compounds = ['Z', 'O', 'ZO'];
            // let compounds = ['Z', 'O', 'ZO', 'OH', 'ZO2H'];
            let compounds = [1,2,3,4,5,6,7,8,9];
            let results = [];
            iteratePermutations(compounds, results);
            // generatePermutations(compounds, [], results);

            console.log(JSON.stringify(results).length / 1024);
            console.log(results.length);
        }
    };
})();

module.exports.foo();