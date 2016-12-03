module.exports = (function() {
    return {
        log: function(...messages) {
            console.log(messages.join(' '));
        },

        error: function(...messages) {
            console.log('<span style="color: red">' + messages.join(' ') + '</span>');
        }
    }
})();