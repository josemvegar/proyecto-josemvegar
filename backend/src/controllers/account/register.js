const UserService = require('../../services/userService');

const register = async (req, res) => {
  const data = req.body;

  try {
    const userStoraged = await UserService.registerUser(data);
    if (userStoraged.status === "error"){
        return res.status(userStoraged.code).send(userStoraged.response);
    }
    return res.status(200).send({
      status: "success",
      message: "Usuario registrado.",
      userStoraged
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al guardar el usuario."
    });
  }
};

module.exports = { register };