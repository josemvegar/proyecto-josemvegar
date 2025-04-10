/**
 * @file userService.js
 * @description Servicio para manejar la lógica de negocio relacionada con los usuarios (registro, inicio de sesión, actualización, eliminación y listado).
 * @module services/userService
 */

const User = require('../models/Users');
const { dataValidator } = require('../helpers/dataValidator');
const emptyChecker = require('../helpers/emptyChecker');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config();

class UserService {
  /**
   * Crea una respuesta de error estandarizada
   * @static
   * @private
   * @param {string} status - Estado de la respuesta ("error")
   * @param {number} code - Código HTTP de error
   * @param {string} message - Mensaje descriptivo del error
   * @param {Array<string>} [details] - Detalles específicos del error (opcional)
   * @returns {Object} Objeto de respuesta de error
   */
  static _createErrorResponse(status, code, message, details = null) {
    return {
      status,
      code,
      response: {
        status: "error",
        message,
        ...(details && { details })
      }
    };
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @static
   * @async
   * @param {Object} data - Datos del usuario a registrar
   * @param {string} data.name - Nombre completo
   * @param {string} data.nick - Apodo/Nickname
   * @param {string} data.email - Correo electrónico
   * @param {string} data.password - Contraseña
   * @param {string} data.role - Rol del usuario
   * @param {string} data.page - Página asociada
   * @returns {Promise<Object>} Respuesta con el usuario registrado o error
   */
  static async registerUser(data) {
    const empty = emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
    if (empty !== true) {
      return this._createErrorResponse("error", 400, "Faltan datos.", empty);
    }

    const validation = dataValidator(data);
    if (validation !== true) {
      return this._createErrorResponse("error", 400, "Validación no pasada.", validation);
    }

    const userExist = await User.findByEmailOrNick(data.email, data.nick, data.page);
    if (userExist.length > 0) {
      return this._createErrorResponse("error", 409, "El usuario ingresado ya existe.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const userToStorage = new User(data);
    const userStoraged = await userToStorage.save();

    const userResponse = userStoraged.toObject();
    delete userResponse.password;
    delete userResponse.role;

    return {
      status: "success",
      response: userResponse
    };
  }

  /**
   * Autentica a un usuario y genera un token JWT
   * @static
   * @async
   * @param {Object} data - Credenciales de acceso
   * @param {string} data.login - Email o nickname
   * @param {string} data.password - Contraseña
   * @param {string} data.page - Página asociada
   * @returns {Promise<Object>} Respuesta con usuario y token o error
   */
  static async login(data) {
    const empty = emptyChecker(data, ["login", "password", "page"]);
    if (empty !== true) {
      return this._createErrorResponse("error", 400, "Faltan datos.", empty);
    }

    const userExist = await User.findUserToLogin(data.login, data.page);
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El usuario ingresado no existe.");
    }

    const user = userExist[0];
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
      return this._createErrorResponse("error", 400, "Los datos ingresados no son válidos.");
    }

    const token = jwt.createToken(user);
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.role;

    return {
      status: "success",
      response: { user: userResponse, token }
    };
  }

  /**
   * Actualiza los datos de un usuario existente
   * @static
   * @async
   * @param {string} id - ID del usuario a actualizar
   * @param {Object} user - Usuario que realiza la acción
   * @param {Object} data - Nuevos datos del usuario
   * @returns {Promise<Object>} Respuesta con usuario actualizado o error
   */
  static async update(id, user, data) {
    if((id !== user.id) && (user.role !== "role_admin")){
      return this._createErrorResponse("error", 403, "No puedes editar los datos de otro usuario si no eres administrador.");
    }

    const userExist = await User.findUserDuplicated(id, data.email, data.nick, user.page);
    if (userExist.length) {
      return this._createErrorResponse("error", 404, "Los datos ingresados pertenecen a otro usuario.");
    }

    const validation = dataValidator(data);
    if (validation !== true) {
      return this._createErrorResponse("error", 400, "Validación no pasada.", validation);
    }

    if(data.password){
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const userToEdit = await User.findByIdAndUpdate(id, data, {new: true});
    if (!userToEdit){
      return this._createErrorResponse("error", 500, "Error al editar usuario.");
    }

    const token = jwt.updateUser(user, data);
    const userResponse = userToEdit.toObject();
    delete userResponse.password;
    delete userResponse.role;

    return {
      status: "success",
      response: { user: userResponse, token }
    };
  }

  /**
   * Elimina un usuario del sistema
   * @static
   * @async
   * @param {string} id - ID del usuario a eliminar
   * @param {Object} userLoggued - Usuario que realiza la acción
   * @returns {Promise<Object>} Respuesta con usuario eliminado o error
   */
  static async _delete(id, userLoggued) {
    if(id === userLoggued.id){
      return this._createErrorResponse("error", 403, "No puedes eliminar tu propia cuenta.");
    }

    const userExist = await User.findIdPerPage(id, userLoggued.page);
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El id de usuario igresado no existe.");
    }

    const userToDelete = await User.findOneAndDelete({_id: id});
    if (!userToDelete){
      return this._createErrorResponse("error", 500, "Error al eliminar usuario.");
    }

    return {
      status: "success",
      response: { user: userToDelete }
    };
  }

  /**
   * Lista usuarios con paginación o busca un usuario específico
   * @static
   * @async
   * @param {string} page - Página asociada
   * @param {number} [paginationPage=1] - Número de página para paginación
   * @param {string|null} [id=null] - ID de usuario específico (opcional)
   * @returns {Promise<Object>} Respuesta con lista de usuarios o usuario específico
   */
  static async list(page, paginationPage = 1, id = null) {
    const itemsPerPage = process.env.ITEMS_PER_PAGE;

    if(!id){
      const userList = await User.findUserList(paginationPage, itemsPerPage, page);
      const url = process.env.LIST_USER_URL;

      return {
        status: "success",
        response: { 
          page: paginationPage,
          total_pages: userList.totalPages,
          limit: userList.limit,
          total_users: userList.totalDocs,
          next: userList.nextPage !== null ? url+userList.nextPage : undefined,
          prev: userList.prevPage !== null ? url+userList.prevPage : undefined,
          users: userList.docs
        }
      };
    }

    const userExist = await User.find({$and: [{_id: id}, {page: page}]});
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El id de usuario igresado no existe.");
    }

    return {
      status: "success",
      response: { user: userExist }
    };
  }
}

module.exports = UserService;