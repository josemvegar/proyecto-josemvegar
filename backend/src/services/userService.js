/**
 * @file userService.js
 * @description Servicio para manejar la lógica de negocio relacionada con los usuarios (registro, inicio de sesión, etc.).
 * @module services/userService
 */

// Importa el modelo de usuario para interactuar con la base de datos.
const User = require('../models/Users');

// Importa el validador de datos para verificar el formato de los campos.
const { dataValidator } = require('../helpers/dataValidator');

// Importa el verificador de campos vacíos para asegurar que todos los campos requeridos estén presentes.
const emptyChecker = require('../helpers/emptyChecker');

// Importa bcrypt para encriptar y comparar contraseñas.
const bcrypt = require('bcrypt');

// Importa el módulo de JWT para crear tokens de autenticación.
const jwt = require('../helpers/jwt');
const { use } = require('../routes/user');

// Importa dotenv para cargar variables de entorno desde un archivo .env.
const dotenv = require('dotenv');
// Carga las variables de entorno definidas en el archivo .env.
dotenv.config();

class UserService {
  /**
   * Crea una respuesta de error estandarizada.
   * @name _createErrorResponse
   * @function
   * @static
   * @private
   * @param {string} status - Estado de la respuesta (generalmente "error").
   * @param {number} code - Código de estado HTTP.
   * @param {string} message - Mensaje de error.
   * @param {Array<string>|null} [details=null] - Detalles adicionales del error (opcional).
   * @returns {Object} Respuesta de error estandarizada.
   * @example
   * // Ejemplo de uso:
   * const errorResponse = UserService._createErrorResponse("error", 400, "Faltan datos.", ["name", "email"]);
   */
  static _createErrorResponse(status, code, message, details = null) {
    return {
      status,
      code,
      response: {
        status: "error",
        message,
        ...(details && { details }) // Añade detalles solo si existen
      }
    };
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   * @name registerUser
   * @function
   * @static
   * @async
   * @param {Object} data - Datos del usuario a registrar.
   * @param {string} data.name - Nombre del usuario.
   * @param {string} data.nick - Nickname del usuario.
   * @param {string} data.email - Correo electrónico del usuario.
   * @param {string} data.password - Contraseña del usuario.
   * @param {string} data.role - Rol del usuario.
   * @param {string} data.page - Página asociada al usuario.
   * @returns {Object} - Respuesta con el estado y el usuario registrado, o un error si la validación falla.
   * @example
   * // Ejemplo de uso:
   * const result = await UserService.registerUser({
   *   name: "Juan",
   *   nick: "juan123",
   *   email: "juan@example.com",
   *   password: "contraseña",
   *   role: "role_user",
   *   page: "miPagina"
   * });
   */
  static async registerUser(data) {
    // Verifica si los campos obligatorios están presentes.
    const empty = emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
    if (empty !== true) {
      return this._createErrorResponse("error", 400, "Faltan datos.", empty);
    }

    // Valida el formato de los datos.
    const validation = dataValidator(data);
    if (validation !== true) {
      return this._createErrorResponse("error", 400, "Validación no pasada.", validation);
    }

    // Verifica si el usuario ya existe en la base de datos.
    const userExist = await User.findByEmailOrNick(data.email, data.nick, data.page);
    if (userExist.length > 0) {
      return this._createErrorResponse("error", 409, "El usuario ingresado ya existe.");
    }

    // Encripta la contraseña antes de guardarla en la base de datos.
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    // Crea un nuevo usuario y lo guarda en la base de datos.
    const userToStorage = new User(data);
    const userStoraged = await userToStorage.save();

    // Elimina la contraseña y el rol del objeto de respuesta.
    const userResponse = userStoraged.toObject();
    delete userResponse.password;
    delete userResponse.role;

    // Devuelve una respuesta exitosa con el usuario registrado.
    return {
      status: "success",
      response: userResponse
    };
  }

  /**
   * Inicia sesión de un usuario y genera un token de autenticación.
   * @name login
   * @function
   * @static
   * @async
   * @param {Object} data - Datos del usuario para iniciar sesión.
   * @param {string} data.login - Correo electrónico o nickname del usuario.
   * @param {string} data.password - Contraseña del usuario.
   * @param {string} data.page - Página asociada al usuario.
   * @returns {Object} - Respuesta con el estado, el usuario y el token, o un error si la validación falla.
   * @example
   * // Ejemplo de uso:
   * const result = await UserService.login({
   *   login: "juan@example.com",
   *   password: "contraseña",
   *   page: "miPagina"
   * });
   */
  static async login(data) {
    // Verifica si los campos obligatorios están presentes.
    const empty = emptyChecker(data, ["login", "password", "page"]);
    if (empty !== true) {
      return this._createErrorResponse("error", 400, "Faltan datos.", empty);
    }

    // Busca al usuario en la base de datos.
    const userExist = await User.findUserToLogin(data.login, data.page);
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El usuario ingresado no existe.");
    }

    const user = userExist[0];

    // Verifica si la contraseña es válida.
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
      return this._createErrorResponse("error", 400, "Los datos ingresados no son válidos.");
    }

    // Genera un token de autenticación.
    const token = jwt.createToken(user);

    // Elimina la contraseña y el rol del objeto de respuesta.
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.role;

    // Devuelve una respuesta exitosa con el usuario y el token.
    return {
      status: "success",
      response: { user: userResponse, token }
    };
  }

  static async update(id, user, data) {

    if((id !== user.id) && (user.role !== "role_admin")){
      return this._createErrorResponse("error", 403, "No puedes editar los datos de otro usuario si no eres administrador.");
    }

    // Busca al usuario en la base de datos.
    const userExist = await User.findUserDuplicated(id, data.email, data.nick, user.page);
    if (userExist.length) {
      return this._createErrorResponse("error", 404, "Los datos ingresados pertenecen a otro usuario.");
    }

    // Valida el formato de los datos.
    const validation = dataValidator(data);
    if (validation !== true) {
      return this._createErrorResponse("error", 400, "Validación no pasada.", validation);
    }

    if(data.password){
      // Encripta la contraseña antes de guardarla en la base de datos.
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const userToEdit = await User.findByIdAndUpdate(id, data, {new: true});

    if (!userToEdit){
      return this._createErrorResponse("error", 500, "Error al editar usuario.");
    }

    // Genera un token de autenticación.
    const token = jwt.updateUser(user, data);

    // Elimina la contraseña y el rol del objeto de respuesta.
    const userResponse = userToEdit.toObject();
    delete userResponse.password;
    delete userResponse.role;

    // Devuelve una respuesta exitosa con el usuario y el token.
    return {
      status: "success",
      response: { user: userResponse, token }
    };
  }

  static async _delete(id, userLoggued) {

    if(id === userLoggued.id){
      return this._createErrorResponse("error", 403, "No puedes eliminar tu propia cuenta.");
    }

    // Busca al usuario en la base de datos.
    const userExist = await User.findIdPerPage(id, userLoggued.page);
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El id de usuario igresado no existe.");
    }

    const userToDelete = await User.findOneAndDelete({_id: id});

    if (!userToDelete){
      return this._createErrorResponse("error", 500, "Error al editar usuario.");
    }

    // Devuelve una respuesta exitosa con el usuario y el token.
    return {
      status: "success",
      response: { user: userToDelete }
    };
  }

  static async list(page, paginationPage= 1, id= null) {

    const itemsPerPage = process.env.ITEMS_PER_PAGE;

    if(!id){
      //return this._createErrorResponse("error", 403, "No puedes eliminar tu propia cuenta.");

      const userList = await User.findUserList(paginationPage, itemsPerPage, page);

      const url = process.env.LIST_USER_URL;

      return {
        status: "success",
        response: { page: paginationPage,
          total_pages: userList.totalPages,
          limit: userList.limit,
          total_users: userList.totalDocs,
          next: userList.nextPage !== null ? url+userList.nextPage : undefined,
          prev: userList.prevPage !== null ? url+userList.prevPage : undefined,
          users: userList.docs
        }
      };
    }

    // Busca al usuario en la base de datos.
    const userExist = await User.find({$and: [{_id: id}, {page: page}]});
    if (!userExist.length) {
      return this._createErrorResponse("error", 404, "El id de usuario igresado no existe.");
    }

    // Devuelve una respuesta exitosa con el usuario y el token.
    return {
      status: "success",
      response: { user: userExist }
    };
  }

}

// Exporta la clase UserService para que pueda ser utilizada en otros archivos.
module.exports = UserService;