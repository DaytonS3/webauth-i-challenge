const express = require("express");
const db = require("./data/dbHelp");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const server = express();

server.use(express.json());

const sessionConfig = {
  name: "cookie",
  secret: "secret",
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 1,
    secure: false
  },
  resave: false,
  saveUninitialized: true
};

server.use(session(sessionConfig));

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

server.post("/api/register", (req, res) => {
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

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.login({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(404).json({ message: "Invaild Login" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("Logged Out");
      }
    });
  } else {
    res.end();
  }
});

server.listen(5000, () => {
  console.log("server running...");
});
