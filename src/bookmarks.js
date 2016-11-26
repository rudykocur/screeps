module.exports = (function() {
    var bookmarks = {
        sourceTop: ['57ef9ddd86f108ae6e60e6db'],
        sourceBottom: ['57ef9ddd86f108ae6e60e6dd'],
        containersTop: ['5839703ced37cf7c5fae4cff', '5839c28ae967568a17eabf44', '5839dfe36ac61e292641b05e'],
        containersBottom: ['5839a2e6cd1628ec268459e9', '5839b19c8b3919d7655e0661'],
    };
    return {
        getObjects: function(name) {
            return bookmarks[name];
        }
    }
})();