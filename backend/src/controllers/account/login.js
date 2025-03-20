const UserService = require('../../services/userService');

const login = async (req, res) => {
  const data = req.body;

  try {
    const result = await UserService.login(data);

    if (result.status === "error") {
      return res.status(result.code).send(result.response);
    }

    return res.status(200).send({
      status: "success",
      message: "Inicio de sesión exitoso.",
      ...result.response
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al iniciar sesión."
    });
  }
};

module.exports = { login };