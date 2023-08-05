const { db, admin } = require("../utils/admin");
const { updatePlayersInAlgolia } = require("./algolia");

exports.teams = async (req, res) => {
  const clientId = req.params.clientId;
  const teamsRef = db
    .collection("teams")
    .where("clientId", "==", clientId || 0)
    .orderBy("name", "desc");

  try {
    teamsRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      return res.status(200).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const id = req.body.id;
    const teamsDb = db.collection("teams");
    const response = await teamsDb.doc(id).set(req.body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const id = req.body.id;
    const playersCollection = db.collection("players");
    const response = await playersCollection.doc(id).set(req.body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

exports.getPlayersByTeam = async (req, res) => {
  const teamId = req.params.teamId;
  // console.log(teamId);
  const collRef = db
    .collection("players")
    .where("teamId", "==", teamId || 0)
    .orderBy("name");
  try {
    collRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      // console.log(data);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.getPlayersByClient = async (req, res) => {
  const clientId = req.params.clientId;
  const teamsRef = db
    .collection("teams")
    .where("clientId", "==", clientId || []);

  try {
    teamsRef.get().then((snapshot) => {
      const teamIds = snapshot.docs.map((doc) => doc.data());
      console.log(teamIds);
      const collRef = db
        .collection("players")
        .where("teamId", "in", teamIds.map((team) => team.id) || [])
        .orderBy("name");

      collRef.get().then((snapshot1) => {
        const data = snapshot1.docs.map((doc) => doc.data());
        // console.log(data);
        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const id = req.body.matchId;
    const matchCollection = db.collection("matches");
    const response = await matchCollection.doc(id).set(req.body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const id = req.params.matchId;
    const matchCollection = db.collection("matches");
    const response = await matchCollection.doc(id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

exports.getMatch = async (req, res) => {
  const matchId = req.params.matchId;
  const teamsRef = db
    .collection("matches")
    .where("matchId", "==", matchId || 0);
  try {
    teamsRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      return res.status(200).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.getMatches = async (req, res) => {
  const clientId = req.params.clientId;
  const teamsRef = db
    .collection("matches")
    .where("clientId", "==", clientId || 0)
    .orderBy("created", "desc");
  try {
    teamsRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      return res.status(200).json(data);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.updatePlayers = async (req, res) => {
  try {
    const { players, algoliaIndex, currentMatchPlayers } = req.body;
    updatePlayersInAlgolia(currentMatchPlayers, algoliaIndex);
    const firestore = admin.firestore();
    const batch = firestore.batch();
    players.forEach((player) => {
      db.collection("players").doc(player.id).set(player);
    });
    // await setDoc(doc(db, "matches", scoreboard.matchId), data);
    // Commit the batch
    const response = await batch.commit();
    res.send(response);

    // const matchCollection = db.collection("matches");
    // const response = await matchCollection.doc(id).set(req.body);
    // res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
