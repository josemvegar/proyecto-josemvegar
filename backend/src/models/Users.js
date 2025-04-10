/**
 * @file Users.js
 * @description Define el modelo de usuario para la base de datos MongoDB.
 * @module models/Users
 */

const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const paginate = require('mongoose-paginate-v2');

/**
 * Esquema de usuario para MongoDB
 * @typedef {Object} UserSchema
 * @property {string} name - Nombre del usuario (requerido)
 * @property {string} [surname] - Apellido del usuario (opcional)
 * @property {string} nick - Apodo/Nickname del usuario (requerido)
 * @property {string} email - Email del usuario (requerido)
 * @property {string} password - Contraseña del usuario (requerido, no se selecciona por defecto)
 * @property {string} [role=role_user] - Rol del usuario (por defecto: "role_user", no se selecciona por defecto)
 * @property {string} [image=default.png] - Nombre de la imagen del usuario (por defecto: "default.png")
 * @property {string} [imagePath=/uploads/users/default.png] - Ruta de la imagen del usuario (por defecto: "/uploads/users/default.png")
 * @property {string} page - Página asociada al usuario (requerido)
 * @property {Date} [created_at=Date.now()] - Fecha de creación (por defecto: fecha actual)
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

// Aplicar plugin de paginación
userSchema.plugin(paginate);

/**
 * Busca usuarios por email o nick en una página específica
 * @static
 * @param {string} email - Email a buscar
 * @param {string} nick - Nickname a buscar
 * @param {string} page - Página asociada
 * @returns {Query} Consulta de Mongoose para encontrar usuarios
 * @example
 * const usuarios = await User.findByEmailOrNick("correo@ejemplo.com", "nick123", "miPagina");
 */
userSchema.statics.findByEmailOrNick = function (email, nick, page) {
  return this.find({
    $and: [{ $or: [{ email }, { nick }] }, { page }],
  }).exec();
};

/**
 * Busca un usuario para login (incluye contraseña y rol)
 * @static
 * @param {string} login - Email o nickname del usuario
 * @param {string} page - Página asociada
 * @returns {Query} Consulta de Mongoose para encontrar usuarios
 * @example
 * const usuario = await User.findUserToLogin("correo@ejemplo.com", "miPagina");
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
 * Compara una contraseña con la almacenada en el usuario
 * @method
 * @param {string} password - Contraseña a comparar
 * @returns {boolean} True si coinciden, false si no
 * @example
 * const coincide = usuario.comparePassword("miContraseña");
 */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Busca usuarios duplicados (mismo email o nick en la misma página)
 * @static
 * @param {string} id - ID del usuario a excluir de la búsqueda
 * @param {string} [email] - Email a buscar
 * @param {string} [nick] - Nickname a buscar
 * @param {string} page - Página asociada
 * @returns {Query} Consulta de Mongoose para encontrar usuarios duplicados
 */
userSchema.statics.findUserDuplicated = function (id, email = '', nick = '', page) {
  const orConditions = [];
  if (email) orConditions.push({ email });
  if (nick) orConditions.push({ nick });

  return this.find({
    $and: [
      { _id: { $ne: id } },
      { $or: orConditions },
      { page }
    ],
  }).exec();
};

/**
 * Busca un usuario por ID en una página específica
 * @static
 * @param {string} id - ID del usuario
 * @param {string} page - Página asociada
 * @returns {Query} Consulta de Mongoose para encontrar el usuario
 */
userSchema.statics.findIdPerPage = function (id, page) {
  return this.find({$and : [
    {_id: id},
    {page: page}
  ]}).exec();
};

/**
 * Obtiene lista paginada de usuarios de una página específica
 * @static
 * @param {number} paginationPage - Número de página a mostrar
 * @param {number} itemsPerPage - Cantidad de items por página
 * @param {string} page - Página asociada
 * @returns {Promise<Object>} Resultado paginado
 */
userSchema.statics.findUserList = function (paginationPage, itemsPerPage, page) {
  return this.paginate({page: page}, {page: paginationPage, limit: itemsPerPage, sort: { created_at: -1 }});
}

// Exportar el modelo de usuario
module.exports = model("User", userSchema, "users");