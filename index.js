const express = require("express");
const db = require("./data/dbHelp");
const bcrypt = require("bcryptjs");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("server running..");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/users", (req, res) => {
  users = req.body;
  const hash = bcrypt.hashSync(users.password, 10);
  users.password = hash;

  db.add(users)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.listen(5000, () => {
  console.log("server running...");
});
