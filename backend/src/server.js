/**
 * @file server.js
 * @description Punto de entrada de la aplicación. Configura y arranca el servidor Express.
 * @module server
 */

// Importa Express para crear el servidor.
const express = require('express');

// Importa dotenv para cargar variables de entorno desde un archivo .env.
const dotenv = require('dotenv');

// Importa CORS para permitir solicitudes desde diferentes dominios.
const cors = require("cors");

// Importa la clase Database para manejar la conexión a la base de datos.
const Database = require("./database/conection");

// Importa Morgan para registrar las solicitudes HTTP en la consola.
const morgan = require('morgan');

// Importa el middleware para manejar errores globales.
const errorHandler = require('./middlewares/errorHandler');

// Conecta a la base de datos.
Database.connect();

// Carga las variables de entorno definidas en el archivo .env.
dotenv.config();

// Crea una instancia de la aplicación Express.
const app = express();

// Middleware para manejar errores globales.
app.use(errorHandler);

// Middleware para registrar las solicitudes HTTP en la consola.
app.use(morgan('dev'));

// Middleware para permitir solicitudes desde diferentes dominios.
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON.
app.use(express.json());

// Middleware para parsear el cuerpo de las solicitudes en formato URL-encoded.
app.use(express.urlencoded({ extended: true }));

/**
 * Ruta de prueba para verificar que el servidor está funcionando.
 * @name get/
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {string} - Mensaje de confirmación de que el servidor está funcionando.
 * @example
 * // Ejemplo de solicitud:
 * // GET /
 * // Respuesta: "¡Backend funcionando!"
 */
app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

// Importa las rutas relacionadas con los usuarios.
const userRoutes = require("./routes/user");

// Asocia las rutas de usuarios a la ruta base "/api/v1/user".
app.use("/api/v1/user", userRoutes);

// Define el puerto y el dominio del servidor.
const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || 'http://localhost:';

// Arranca el servidor y lo pone a escuchar en el puerto especificado.
app.listen(PORT, () => {
  console.log(`Backend corriendo en ${DOMAIN}${PORT}`);
});