/**
 * @file register.js
 * @description Controlador para manejar las solicitudes de registro de usuarios.
 * @module controllers/account/register
 */

// Importa el servicio de usuarios para manejar la lógica de registro.
const UserService = require('../../services/userService');

/**
 * Maneja la solicitud de registro de un nuevo usuario.
 * @name register
 * @function
 * @async
 * @param {Object} req - Objeto de solicitud HTTP. Contiene los datos enviados por el cliente.
 * @param {Object} res - Objeto de respuesta HTTP. Se utiliza para enviar la respuesta al cliente.
 * @returns {Object} Respuesta JSON con el resultado del registro.
 * @example
 * // Ejemplo de solicitud:
 * // POST /api/v1/user/register
 * // Body: { "name": "Juan", "nick": "juan123", "email": "juan@example.com", "password": "contraseña", "role": "role_user", "page": "miPagina" }
 *
 * // Ejemplo de respuesta exitosa:
 * // Status: 200
 * // Body: { "status": "success", "message": "Usuario registrado.", "userStoraged": { ... } }
 *
 * // Ejemplo de respuesta con error:
 * // Status: 400
 * // Body: { "status": "error", "message": "Faltan datos.", "empty": ["name", "email"] }
 */
const register = async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud.
  const data = req.body;

  try {
    // Llama al servicio de usuarios para manejar el registro.
    const userStoraged = await UserService.registerUser(data);

    // Si el servicio devuelve un error, envía la respuesta correspondiente.
    if (userStoraged.status === "error") {
      return res.status(userStoraged.code).send(userStoraged.response);
    }

    // Si el registro es exitoso, envía una respuesta con el usuario registrado.
    return res.status(200).send({
      status: "success",
      message: "Usuario registrado.",
      userStoraged
    });
  } catch (error) {
    // Si ocurre un error inesperado, envía una respuesta genérica.
    return res.status(500).send({
      status: "error",
      message: "Error al guardar el usuario."
    });
  }
};

// Exporta la función de registro para que pueda ser utilizada en las rutas.
module.exports = { register };