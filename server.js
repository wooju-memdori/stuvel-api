const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const rooms = [];

app.set("view engine", "ejs");
app.use(express.static("public"));

/*
app.get("/room", (req, res) => {
  // 홈페이지로 갈 때마다 랜덤한 uuid(roomId) 생성
  res.redirect(`${uuidV4()}`);
});
*/

app.get("/room/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

app.get("/", (req, res) => {
  const roomId = uuidV4();
  rooms.push(roomId);
  res.render("home", { roomId });
});

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

server.listen(3000);
