/**
 * @file jwt.js
 * @description Módulo para la creación y renovación de tokens JWT (JSON Web Tokens).
 * @module helpers/jwt
 */

// Importa la librería jwt-simple para codificar y decodificar tokens JWT.
const jwt = require('jwt-simple');

// Importa la librería moment para manejar fechas y horas.
const moment = require('moment');

// Importa dotenv para cargar variables de entorno desde un archivo .env.
const dotenv = require('dotenv');

// Carga las variables de entorno definidas en el archivo .env.
dotenv.config();

// Obtiene la clave secreta para firmar los tokens JWT desde las variables de entorno.
const SECRET = process.env.JWT_SECRET;

/**
 * Crea un token JWT para un usuario.
 * @name createToken
 * @function
 * @param {Object} user - Objeto que representa al usuario.
 * @param {string} user._id - ID del usuario.
 * @param {string} user.name - Nombre del usuario.
 * @param {string} user.surname - Apellido del usuario.
 * @param {string} user.nick - Nickname del usuario.
 * @param {string} user.email - Correo electrónico del usuario.
 * @param {string} user.role - Rol del usuario.
 * @param {string} user.image - URL de la imagen del usuario.
 * @returns {string} Token JWT codificado.
 * @example
 * // Ejemplo de uso:
 * const user = {
 *   _id: "12345",
 *   name: "Juan",
 *   surname: "Pérez",
 *   nick: "juan123",
 *   email: "juan@example.com",
 *   role: "role_user",
 *   image: "default.png"
 * };
 * const token = createToken(user);
 * console.log("Token creado:", token);
 */
const createToken = (user) => {
  // Define el payload del token con los datos del usuario y fechas de emisión y expiración.
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    page: user.page,
    iat: user.iat ? user.iat : moment().unix(), // Fecha de emisión (en segundos).
    exp: user.exp ? user.exp : moment().add(30, 'days').unix(), // Fecha de expiración (en 30 días).
  };

  // Codifica el payload en un token JWT utilizando la clave secreta.
  return jwt.encode(payload, SECRET);
};

/**
 * Renueva un token JWT existente.
 * @name renewToken
 * @function
 * @param {string} token - Token JWT a renovar.
 * @returns {string} Nuevo token JWT codificado.
 * @example
 * // Ejemplo de uso:
 * const oldToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const newToken = renewToken(oldToken);
 * console.log("Token renovado:", newToken);
 */
const renewToken = (token) => {
  // Decodifica el token JWT para obtener el payload.
  const payload = jwt.decode(token, SECRET);

  // Actualiza la fecha de expiración del payload.
  payload.exp = moment().add(30, 'days').unix();

  // Codifica el payload actualizado en un nuevo token JWT.
  return jwt.encode(payload, SECRET);
};

const updateUser= (user, data) => {
  for (let key in data) {
      if (user.hasOwnProperty(key)) {
          user[key] = data[key];
      }
  }
  return createToken(user);
}


// Exporta la clave secreta y las funciones para crear y renovar tokens.
module.exports = {
  SECRET,
  createToken,
  renewToken,
  updateUser
};