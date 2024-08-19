const mongose = require("mongose");
require("dotenv").config();

async function dbConnection() {
  try {
    await mongose.connect("process.env.MONGODB_URL");
    console.log("Connected to MongoDB successfully");
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
  }
}
module.exports ={dbConnection}