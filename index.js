var express = require("express");
var bodyParser = require("body-parser");
const {
  teams,
  createTeam,
  createPlayer,
  createMatch,
  getPlayersByTeam,
  getMatches,
  updatePlayers,
  deleteMatch,
  getMatch,
  getPlayersByClient,
} = require("./handlers/cricket");
const { db } = require("./utils/admin");
const { validateLogin } = require("./handlers/generic");

var app = express();

app.use(bodyParser.json({ limit: "10mb" }));

// app.use(express.json({ limit: "50mb" }));
// app.use(express.bodyParser({ limit: "50mb" }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const PORT = process.env.PORT || 3001;
app.get("/", (req, res) => {
  res.send("NSA Academy Server API is up & running");
});

app.get("/cricket/teams/:clientId", teams);
app.post("/cricket/create/team", createTeam);
app.post("/cricket/create/player", createPlayer);
app.get("/cricket/getPlayers/:teamId", getPlayersByTeam);
app.get("/cricket/getAllPlayers/:clientId", getPlayersByClient);
app.post("/cricket/create/match", createMatch);
app.get("/cricket/matches/:clientId", getMatches);
app.get("/cricket/match/:matchId", getMatch);
app.post("/cricket/update/players", updatePlayers);
app.delete("/cricket/delete/match/:matchId", deleteMatch);

app.get("/validate/login/:pin", validateLogin);

app.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});
