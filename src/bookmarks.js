module.exports = (function() {
    var bookmarks = {
        sourceRight: ['57ef9ebf86f108ae6e60fd88'],
        sourceLeft: ['57ef9ebf86f108ae6e60fd87'],
        storage: ['583d89cbc23dc5573898a00f'],
        containersRight: ['583b6ecc4a99488b36a60e13'],
        containersLeft: ['583b852c670ce4ad404e2ba1'],
    };
    return {
        getObjects: function(name) {
            return bookmarks[name];
        },

        getObject: function(name) {
            return Game.getObjectById(bookmarks[name]);
        }
    }
})();