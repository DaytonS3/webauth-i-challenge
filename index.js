const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("server running..");
});

server.listen(5000, () => {
  console.log("server running...");
});
