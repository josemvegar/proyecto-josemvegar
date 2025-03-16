const User = require('../models/Users');
const { dataValidator } = require('../helpers/dataValidator');
const emptyChecker = require('../helpers/emptyChecker');
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

class UserService {
  static async registerUser(data) {
    const empty = emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
    if (empty !== true) {
        return {
            status: "error",
            code: 400,
            response: {
                status: "error",
                message: "Faltan datos.",
                empty
            }
          }
    }

    const validation = dataValidator(data);
    if (validation !== true) {
        return {
            status: "error",
            code: 400,
            response: {
                status: "error",
                message: "Validación no pasada.",
                reasons: validation
            }
          }
    }

    const userExist = await User.findByEmailOrNick(data.email, data.nick, data.page);

    if (userExist.length > 0) {
      return {
        status: "error",
        code: 409,
        response: {
            status: "error",
            message: "El usuario ingresado ya existe."
        }
      }
    }
    let pwd = await bcrypt.hash(data.password, 10);
    data.password = pwd;
    const userToStorage = new User(data);
    const userstoraged = await userToStorage.save();
    const userResponse = userstoraged.toObject();
    delete userResponse.password; 
    delete userResponse.role;
    return userResponse;
  }

  static async login(data) {
    const empty = emptyChecker(data, ["login", "password", "page"]);
    if (empty !== true) {
        return {
            status: "error",
            code: 400,
            response: {
                status: "error",
                message: "Faltan datos.",
                empty
            }
          }
    }

    const userExist = await User.findUserToLogin(data.login, data.page);

    if (!userExist.length > 0) {
      return {
        status: "error",
        code: 404,
        response: {
            status: "error",
            message: "El usuario ingresado no existe."
        }
      }
    }
    
    if(userExist[0].role != "role_admin"){
      return {
        status: "error",
        code: 400,
        response: {
            status: "error",
            message: "El usuario ingresado no es administrador."
        }
      }
    }

    let pwd = bcrypt.compareSync(data.password, userExist[0].password);
    if (!pwd){
      return {
        status: "error",
        code: 400,
        response: {
            status: "error",
            message: "Los datos ingresados no son válidos."
        }
      }
    }

    const token = jwt.createToken(userExist[0]);
    let user = userExist[0].toObject();
    delete user.password;
    delete user.role;

    return {
      user,
      token
    };
  }
}

module.exports = UserService;