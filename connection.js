const mongoose = require("mongoose");
async function connectMongoDb(url) {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Error connecting to MongoDB");
    });
}
module.exports = {
  connectMongoDb,
};
