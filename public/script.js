const socket = io("/");
// let server to generate own id
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

// when connect to peer server and get back id, emit this id and room id
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", (userId) => {
  console.log("User connected: " + userId);
});
