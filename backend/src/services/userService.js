const User = require('../models/Users');
const { dataValidator } = require('../helpers/dataValidator');
const emptyChecker = require('../helpers/emptyChecker');

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

    const userToStorage = new User(data);
    const userstoraged = await userToStorage.save();
    const userResponse = userstoraged.toObject();
    delete userResponse.password; 
    delete userResponse.role;
    return userResponse;
  }
}

module.exports = UserService;