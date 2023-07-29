const { db, admin } = require("../utils/admin");
require("dotenv").config();

exports.validateLogin = async (req, res) => {
  const pin = parseInt(req.params.pin, 10);
  console.log(pin, process.env.SUPER_ADMIN_PIN);
  const currentTimestamp = Date.parse(new Date()) / 1000;
  const collRef = db
    .collection("clients")
    .where("validity", ">", currentTimestamp);

  try {
    if (pin === parseInt(process.env.SUPER_ADMIN_PIN, 10)) {
      collRef
        .where("isAdmin", "==", true)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          return res.status(200).json({ isSuperAdmin: true, data });
        });
    } else {
      collRef
        .where("pin", "==", pin || 0)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          return res.status(200).json({ isSuperAdmin: false, data });
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};