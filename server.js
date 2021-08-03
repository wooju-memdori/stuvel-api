const express = require("express");
const app = express();





app.get("/room", (req, res) => {
  res.redirect("/room/" + uuidV4());
});

app.get("/room/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});





server.listen(3000);
