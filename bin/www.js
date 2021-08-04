const app = require('../app')
const http = require('http');
// const server = http.Server(app);
const server = http.createServer(app);
const io = require("socket.io")(server);
const room = io.of('room');
const { PeerServer } = require('peer');

const port = {
  stuvel: 3000,
  peer: 3001,
};

app.set('port', port.stuvel);
const peerServer = PeerServer({ port: port.peer, path: '/' });



room.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      console.log("roomId", roomId, "userId", userId);
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId); // send a message to the all in the room except me
  
      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });
  });

server.listen(port.stuvel, () => {
    console.log(port.stuvel, '번 포트에서 대기중')
});