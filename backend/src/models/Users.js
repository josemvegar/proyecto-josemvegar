/**
 * @file Users.js
 * @description Define el modelo de usuario para la base de datos MongoDB.
 * @module models/Users
 */

// Importa Mongoose para definir el esquema y modelo de usuario.
const { Schema, model } = require("mongoose");

// Importa bcrypt para encriptar y comparar contraseñas.
const bcrypt = require("bcrypt");

/**
 * Esquema de usuario para MongoDB.
 * @name userSchema
 * @type {Schema}
 * @property {string} name - Nombre del usuario (requerido).
 * @property {string} surname - Apellido del usuario (opcional).
 * @property {string} nick - Nickname del usuario (requerido).
 * @property {string} email - Correo electrónico del usuario (requerido).
 * @property {string} password - Contraseña del usuario (requerida, no se selecciona por defecto).
 * @property {string} role - Rol del usuario (por defecto: "role_user", no se selecciona por defecto).
 * @property {string} image - Nombre de la imagen del usuario (por defecto: "default.png").
 * @property {string} imagePath - Ruta de la imagen del usuario (por defecto: "/uploads/users/default.png").
 * @property {string} page - Página asociada al usuario (requerida).
 * @property {Date} created_at - Fecha de creación del usuario (por defecto: fecha actual).
 */
const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String },
  nick: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "role_user", select: false },
  image: { type: String, default: "default.png" },
  imagePath: { type: String, default: "/uploads/users/default.png" },
  page: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
});

/**
 * Método estático para buscar usuarios por email o nick.
 * @name findByEmailOrNick
 * @function
 * @static
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} nick - Nickname del usuario.
 * @param {string} page - Página asociada al usuario.
 * @returns {Query} - Consulta de Mongoose para buscar usuarios.
 * @example
 * // Ejemplo de uso:
 * const users = await User.findByEmailOrNick("juan@example.com", "juan123", "miPagina");
 */
userSchema.statics.findByEmailOrNick = function (email, nick, page) {
  return this.find({
    $and: [{ $or: [{ email }, { nick }] }, { page }],
  }).exec();
};

/**
 * Método estático para buscar un usuario por email o nick, incluyendo la contraseña y el rol.
 * @name findUserToLogin
 * @function
 * @static
 * @param {string} login - Correo electrónico o nickname del usuario.
 * @param {string} page - Página asociada al usuario.
 * @returns {Query} - Consulta de Mongoose para buscar usuarios.
 * @example
 * // Ejemplo de uso:
 * const user = await User.findUserToLogin("juan@example.com", "miPagina");
 */
userSchema.statics.findUserToLogin = function (login, page) {
  return this.find({
    $and: [
      { $or: [{ email: login }, { nick: login }] },
      { page }
    ]
  }).select("+password +role").exec();
};

/**
 * Método de instancia para comparar una contraseña con la contraseña encriptada del usuario.
 * @name comparePassword
 * @function
 * @param {string} password - Contraseña a comparar.
 * @returns {boolean} - `true` si la contraseña coincide, `false` en caso contrario.
 * @example
 * // Ejemplo de uso:
 * const user = await User.findById("12345");
 * const isMatch = user.comparePassword("contraseña");
 */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Exporta el modelo de usuario para que pueda ser utilizado en otros archivos.
module.exports = model("User", userSchema, "users");