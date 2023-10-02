const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connection established");
    return connect;
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

module.exports = {
  connectDB,
};
