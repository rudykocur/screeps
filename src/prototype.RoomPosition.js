/**
 * @param pos
 * @return {RoomPosition}
 */
RoomPosition.fromDict = function(pos) {
    return new RoomPosition(pos.x, pos.y, pos.roomName);
};