module.exports = (function() {
    return {
        log: function(...messages) {
            console.log(messages.join(' '));
        },

        error: function(...messages) {
            console.log(module.exports.fmt.red.apply(null, messages));
        },

        mail: function(...messages) {
            Game.notify(messages.join(' '));
        },

        fmt: {
            red: (...messages) => '<span style="color: red">' + messages.join(' ') + '</span>',
            orange: (...messages) => '<span style="color: #edc222">' + messages.join(' ') + '</span>',
            green: (...messages) => '<span style="color: #27c135">' + messages.join(' ') + '</span>',
            gray: (...messages) => '<span style="color: gray">' + messages.join(' ') + '</span>',
        }
    }
})();