//  updater/index.js
(function (updater) {

    var socketio = require('socket.io');

    // the server below is the one we created in server.js
    updater.init = function (server) {

        //instanciate the actuall listen for socket.io messages
        var io = socketio.listen(server);


        // On Connection event handler. Usually first one is "Connection"
        io.sockets.on('connection', function(socket) {
            console.log("Socket was connected");

            ////Test
            //socket.emit("showThis", "Connected");

            socket.on('join category', function (category) {
                // Create or join a 'room'
                socket.join(category);
            });

            socket.on('newNote', function(data) {

                    //// emit to ALL clients
                    //socket.broadcast.emit("broadcast note", data.note);

                // emit only to relevant category.
                socket.broadcast.to(data.category).emit("broadcast note", data.note);
                });
        });
    }
    
})(module.exports);