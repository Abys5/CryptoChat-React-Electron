const server = require('http').createServer();
const io = require('socket.io')(server);
const uuid = require('uuid/v4');

var socketList = [];

var serverINFO = {
    name: "Royal Palace",
    desc: "Bitch Boi Resting Place"
}

io.on('connection', (socket) => {

    console.log("[Crypto-Chat Server] Added "+socket.id+" to the Unauthenicated Socket List");
    socketList[socket.id] = socket;

    socket.emit('INFO', serverINFO);



    socket.on('REGISTER', (data) => {
        if (isAuthenticated(socket)) {
            return;
        }

        var id = uuid(); // Generates UUID for User

        console.log(`USER: ${data.username} wanted to Register and got ${id}`); // DEBUG

        socketList[socket.id] = {ID: socket.id, Username: data.username, UUID: id, socket: socket};
        socket.UUID = id;
        socket.Auth = true;

        console.log(`Authenicated User: ${data.username} Register with ${socket.UUID}`);
        socket.emit('REGISTER', {id: socket.UUID});
    });

    socket.on('disconnect', () => {
        console.log("[Crypto-Chat Server] Removed "+socket.id+" to the Socket Lists");
        delete socketList[socket.id];
    });

});

function isAuthenticated(socket) {

    if (getSocketByUUID(socket.UUID) == getSocketBySocketID(socket.id) && socket.auth == true) {
        return true;
    } else {
        return false;
    }

}

function getSocketByUUID(uuidCheck) {

    socketList.forEach(socket => {
        if (socket.UUID == uuidCheck) {
            return socket;
        }
    });

    return "BOOP";

}

function getSocketBySocketID(idCheck) {

    socketList.forEach(socket => {
        if (socket.id == idCheck) {
            return socket;
        }
    });

    return "YEET";

}



server.listen(13371, () => {
    console.log("[Crypto-Chat Server] Socket Server Started")
});