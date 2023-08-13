// const { db, admin } = require("../index");
// require("dotenv").config();

exports.validateLogin = async (req, res, db) => {
  const pin = parseInt(req.body.pin, 10);
  const phone = parseInt(req.body.phone, 10);
  console.log(pin, process.env.SUPER_ADMIN_PIN);
  const currentTimestamp = Date.parse(new Date()) / 1000;
  const collRef = db
    .collection("clients")
    .where("validity", ">", currentTimestamp);

  try {
    if (
      pin === parseInt(process.env.SUPER_ADMIN_PIN, 10) &&
      phone === parseInt(process.env.SUPER_ADMIN_PHONE, 10)
    ) {
      collRef.get().then((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        return res
          .status(200)
          .json({ isSuperAdmin: true, isAdmin: true, data });
      });
    } else {
      collRef
        .where("pin", "==", pin)
        .where("phone", "==", phone)
        .where("status", "==", "approved")
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          if (data && data.length > 0) {
            return res
              .status(200)
              .json({ isSuperAdmin: false, isAdmin: true, data });
          } else {
            collRef
              .where("userPin", "==", pin)
              .where("phone", "==", phone)
              .where("status", "==", "approved")
              .get()
              .then((snapshot) => {
                const data = snapshot.docs.map((doc) => doc.data());

                return res.status(200).json({
                  isSuperAdmin: false,
                  isAdmin: false,
                  data,
                });
              });
          }
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.validateRegisterFields = async (req, res, db) => {
  const { key, value } = req.body;
  let parsedValue = value;
  if (key !== "clientName") {
    parsedValue = parseInt(value, 10);
  }
  const collRef = db.collection("clients").where(key, "==", parsedValue);

  try {
    collRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      return res.status(200).json({ valid: data.length === 0 });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
};

exports.createClient = async (req, res, db) => {
  try {
    const id = req.body.id;
    const clientsCollection = db.collection("clients");
    const response = await clientsCollection.doc(id).set(req.body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteClient = async (req, res, db) => {
  try {
    const id = req.params.clientId;
    const clientCollection = db.collection("clients");
    const response = await clientCollection.doc(id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
