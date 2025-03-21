/**
 * @file login.js
 * @description Controlador para manejar las solicitudes de inicio de sesión de usuarios.
 * @module controllers/account/login
 */

// Importa el servicio de usuarios para manejar la lógica de inicio de sesión.
const UserService = require('../../services/userService');

/**
 * Maneja la solicitud de inicio de sesión de un usuario.
 * @name login
 * @function
 * @async
 * @param {Object} req - Objeto de solicitud HTTP. Contiene los datos enviados por el cliente.
 * @param {Object} res - Objeto de respuesta HTTP. Se utiliza para enviar la respuesta al cliente.
 * @returns {Object} Respuesta JSON con el resultado del inicio de sesión.
 * @example
 * // Ejemplo de solicitud:
 * // POST /api/v1/user/login
 * // Body: { "login": "usuario@example.com", "password": "contraseña", "page": "miPagina" }
 *
 * // Ejemplo de respuesta exitosa:
 * // Status: 200
 * // Body: { "status": "success", "message": "Inicio de sesión exitoso.", "user": { ... }, "token": "..." }
 *
 * // Ejemplo de respuesta con error:
 * // Status: 400
 * // Body: { "status": "error", "message": "Los datos ingresados no son válidos." }
 */
const login = async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud.
  const data = req.body;

  try {
    // Llama al servicio de usuarios para manejar el inicio de sesión.
    const result = await UserService.login(data);

    // Si el servicio devuelve un error, envía la respuesta correspondiente.
    if (result.status === "error") {
      return res.status(result.code).send(result.response);
    }

    // Si el inicio de sesión es exitoso, envía una respuesta con el usuario y el token.
    return res.status(200).send({
      status: "success",
      message: "Inicio de sesión exitoso.",
      ...result.response // Expande la respuesta del servicio (usuario y token).
    });
  } catch (error) {
    // Si ocurre un error inesperado, registra el error y envía una respuesta genérica.
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Error al iniciar sesión."
    });
  }
};

// Exporta la función de inicio de sesión para que pueda ser utilizada en las rutas.
module.exports = { login };