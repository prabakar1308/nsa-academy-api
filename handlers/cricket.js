const { db } = require("../utils/admin");

exports.teams = async (req, res) => {
  const teamsRef = db.collection("teams");
  try {
    teamsRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
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
    console.log(req.body);
    const id = req.body.id;
    const teamsDb = db.collection("teams");
    const response = await teamsDb.doc(id).set(req.body);
    console.log(response);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
