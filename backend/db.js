// ✅ FIX #9: Converted from broken ES module syntax to CommonJS
// (backend is "type": "commonjs" — import/export is not valid here)
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
      console.log("✅ Database connection open");
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
