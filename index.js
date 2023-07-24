var express = require("express");
var bodyParser = require("body-parser");
const { teams, createTeam } = require("./handlers/cricket");
const { db } = require("./utils/admin");

var app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT || 5050;
app.get("/", (req, res) => {
  res.send("This is my demo project");
});

app.get("/cricket/teams", teams);

app.post("/cricket/team/create", createTeam);

app.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});
