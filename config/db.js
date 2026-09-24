const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI n'est pas défini dans le fichier .env");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
