
var Game = Game || {};

if(!Game.cpu) {
    Game = {cpuCounter: 0};

    Game.cpu = {
        getUsed: function() {
            return Game.cpuCounter ++;
        }
    };

    global.Game = Game;
}

class Foo {
    constructor() {}

    bar() {this.baz()}
    baz() {}
}



var profiler = require('./../src/my-profiler');

profiler.registerClass(Foo, 'FooClass');

profiler.enable();

profiler.wrap(function() {
    var f = new Foo();
    f.bar();
    f.baz();
});

profiler.print();



// profiler.getProfiler().stack;

// var p = new Profiler();
//
// p.begin('1. start');
//
// p.begin('1.1 start');
// p.end();
//
// p.begin('1.2 start');
//
// p.begin('1.2.1 start');
// p.end();
//
// p.end();
//
// p.end();
//
// console.log(JSON.stringify(profiler.getProfiler().topFrame, null, '\t'));