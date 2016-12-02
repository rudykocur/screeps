module.exports = (function() {
    var bookmarks = {
        sourceRight: ['57ef9ebf86f108ae6e60fd88'],
        sourceLeft: ['57ef9ebf86f108ae6e60fd87'],
        storage: ['583d89cbc23dc5573898a00f'],
        containersRight: ['583b6ecc4a99488b36a60e13'],
        containersLeft: ['583b852c670ce4ad404e2ba1'],

        roomUpSourceTop: ['57ef9ebf86f108ae6e60fd84'],
        roomUpSourceBottom: ['57ef9ebf86f108ae6e60fd85'],

        roomLeftSourceLeft: ['57ef9eaa86f108ae6e60fb04'],
        roomLeftSourceRight: ['57ef9eaa86f108ae6e60fb03'],

        roomTopRightSourceLeft: ['57ef9ed386f108ae6e60fffa'],
        roomTopRightSourceRight: ['57ef9ed386f108ae6e60fff8'],
        roomTopRightContainers: ['5840280c7a2a211d3c2fcf72'],

        moriaBottom: ['584091db618805d413879e32'],
        moriaTop: ['5840280c7a2a211d3c2fcf72']
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