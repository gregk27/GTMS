const config = require("./config");
// Circular reference, avoid using wherever possible
const server = require("./index");

const io = require("socket.io")(server);

clients = [];

io.on("connection", (sock)=>{
    clients.push(sock);
    sock.on('disconnect', function() {
        clients.splice(clients.indexOf(sock), 1);
    });
})

function queueAudio(src){
    for(let c of clients){
        c.emit("queueAudio", src);
    }
}

module.exports = {
    queueAudio
}