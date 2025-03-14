const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_DB = process.env.MONGO_DB || "";

class Database {
  static async connect() {
    try {
      await mongoose.connect(MONGO_DB);
      console.log("Base de datos conectada.");
    } catch (error) {
      console.log(error);
      throw new Error("No se ha podido conectar a la Base de datos.");
    }
  }
}

module.exports = Database;