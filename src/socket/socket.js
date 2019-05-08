const io = require('socket.io-client');


class Socket {

    constructor(contextInfo) {

        this.setTitleInfo = contextInfo.callbacks.setTitleInfo;
        this.addChatEntry = contextInfo.callbacks.addChatEntry;

        this.state = {
            socket: io("http://localhost:13371")
        };

        this.username = "Royal";

        this.state.socket.on('connect', () => {
            console.log("Connected to Server");
            this.setTitleInfo("Connected to "+(this.state.socket.io.uri).split('/')[2].split(':')[0]);
            
        });

        this.state.socket.on('INFO', (data) => {

            console.log(data);
            this.setTitleInfo("Requesting for Registering");
            //console.log("Requesting for Registering");
            this.state.socket.emit('REGISTER', {username: this.username});
             
        });

        this.state.socket.on('MESSAGE_NEW', (data) => {
            console.log(data);
            this.addChatEntry(data);
        });

        this.state.socket.on('REGISTER', (data) => {
            var id = data.id;
            console.log(`${this.username} Registered with ${id}`);
            console.log("Registering Successful");
            this.setTitleInfo("Registering Successful");
        });


        this.connect = this.connect.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

    }

    sendMessage(msg) {
        this.state.socket.emit('MESSAGE_SEND', {msg: msg});
    }

    connect(serverAddress) {
        this.state.socket.disconnect();
        this.setTitleInfo("Connecting to "+serverAddress);
        this.state.socket.connect("http://"+serverAddress+":13371");

        //this.state.socket.emit('REGISTER', {username: this.username});
    }




}


export default Socket;