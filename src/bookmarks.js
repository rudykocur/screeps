module.exports = (function() {
    var bookmarks = {
        sourceRight: ['57ef9ebf86f108ae6e60fd88'],
        sourceLeft: ['57ef9ebf86f108ae6e60fd87'],
        containersRight: ['583b64d981274cf6223fcdcd', '583b6ecc4a99488b36a60e13'],
        containersLeft: ['583b852c670ce4ad404e2ba1'],
    };
    return {
        getObjects: function(name) {
            return bookmarks[name];
        }
    }
})();