
const config = require('config');

var customNameToRoomId = {};
_.each(config.roomNames, (roomName, roomId) => {
    customNameToRoomId[roomName] = roomId;
});

Object.defineProperty(Room.prototype, 'customName', {get: function() {
    return config.roomNames[this.name];
}});

Room.byCustomName = function(roomName) {
    return Game.rooms[customNameToRoomId[roomName]];
};

Room.customNameToId = function(roomName) {
    return customNameToRoomId[roomName];
};

Room.getStorage = function() {

}