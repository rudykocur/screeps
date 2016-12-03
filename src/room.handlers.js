var roomHandlers = {
    outpost: require('room.outpost')
};

module.exports = (function() {

    return {
        processRoomHandlers: function() {
            try {
                _.each(Memory.roomHandlers || {}, function (handlerData, roomName) {

                    var clz = roomHandlers[handlerData.type].handler;
                    var handler = new clz(roomName, handlerData);

                    handler.process();
                });
            }
            catch(e) {
                console.log('Failure at processing rooms', e, '::', e.stack);
            }
        }
    }
})();