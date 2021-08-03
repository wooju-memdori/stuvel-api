const app = require('../app')
const http = require('http');
// const server = http.Server(app);
const server = http.createServer(app);
const io = require("socket.io")(server);

const port = 3000;
app.set('port', port);



io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
      console.log("roomId", roomId, "userId", userId);
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId); // send a message to the all in the room except me
  
      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });
  });

server.listen(port, () => {
    console.log(port, '번 포트에서 대기중')
});