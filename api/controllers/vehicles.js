const client = require("../db/client");

const getAllVehicles = async (req, res) => {
  try {
    const all = await client.query("SELECT * FROM sfs45_cape");
    res.status(200).send(all.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const addVehicle = async (req, res) => {
    const vehicle = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      drivers_license: req.body.dl,
      plate: req.body.plate,
      make: req.body.make,
      model: req.body.model,
    };
    console.log(vehicle);
  try {


    
    let result = await client.query(
      `INSERT INTO sfs45_cape (first_name, last_name, drivers_license, plate, make, model) values('${vehicle.first_name}', '${vehicle.last_name}', '${vehicle.drivers_license}', '${vehicle.plate}', '${vehicle.make}', '${vehicle.model}')`
    );

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
};
