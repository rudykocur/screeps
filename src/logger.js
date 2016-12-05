module.exports = (function() {
    return {
        log: function(...messages) {
            var msg = messages.join(' ');
            console.log(msg);

            return msg;
        },

        error: function(...messages) {
            var msg = module.exports.fmt.red.apply(null, messages);
            console.log(msg);

            return msg;
        },

        mail: function(message, interval) {
            Game.notify(message, interval);
        },

        fmt: {
            red: (...messages) => '<span style="color: red">' + messages.join(' ') + '</span>',
            orange: (...messages) => '<span style="color: #edc222">' + messages.join(' ') + '</span>',
            green: (...messages) => '<span style="color: #27c135">' + messages.join(' ') + '</span>',
            gray: (...messages) => '<span style="color: gray">' + messages.join(' ') + '</span>',
        }
    }
})();