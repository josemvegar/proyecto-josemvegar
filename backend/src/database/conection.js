/**
 * @file conection.js
 * @description Maneja la conexión a la base de datos MongoDB utilizando Mongoose.
 * @module database/conection
 */

// Importa Mongoose para interactuar con MongoDB.
const mongoose = require('mongoose');

// Importa dotenv para cargar variables de entorno desde un archivo .env.
const dotenv = require('dotenv');

// Carga las variables de entorno definidas en el archivo .env.
dotenv.config();

// Obtiene la URL de conexión a MongoDB desde las variables de entorno.
// Si no está definida, se usa una cadena vacía como valor por defecto.
const MONGO_DB = process.env.MONGO_DB || "";

/**
 * Clase que maneja la conexión a la base de datos.
 * @class Database
 */
class Database {
  /**
   * Conecta a la base de datos MongoDB.
   * @name connect
   * @function
   * @static
   * @async
   * @throws {Error} Si no se puede conectar a la base de datos.
   * @example
   * // Ejemplo de uso:
   * Database.connect()
   *   .then(() => console.log("Conectado a la base de datos."))
   *   .catch((error) => console.error("Error de conexión:", error.message));
   */
  static async connect() {
    try {
      // Intenta conectar a la base de datos utilizando la URL proporcionada.
      await mongoose.connect(MONGO_DB);

      // Si la conexión es exitosa, se muestra un mensaje en la consola.
      console.log("Base de datos conectada.");
    } catch (error) {
      // Si ocurre un error, se registra en la consola y se lanza una excepción.
      console.log(error);
      throw new Error("No se ha podido conectar a la Base de datos.");
    }
  }
}

// Exporta la clase Database para que pueda ser utilizada en otros archivos.
module.exports = Database;