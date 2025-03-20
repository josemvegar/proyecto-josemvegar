const User = require('../models/Users');
const { dataValidator } = require('../helpers/dataValidator');
const emptyChecker = require('../helpers/emptyChecker');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

class UserService {
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

  static async login(data) {
    const empty = emptyChecker(data, ["login", "password", "page"]);
    if (empty !== true) {
      return this._createErrorResponse("error", 400, "Faltan datos.", empty);
    }

    const userExist = await User.findUserToLogin(data.login, data.page);
    if (!userExist.length) {
      console.log(data);
      return this._createErrorResponse("error", 404, "El usuario ingresado no existe.");
    }

    /* user = userExist[0];
    if (user.role !== "role_admin") {
      return this._createErrorResponse("error", 400, "El usuario ingresado no es administrador.");
    }*/

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
}

module.exports = UserService;