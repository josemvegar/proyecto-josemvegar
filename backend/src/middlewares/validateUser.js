/**
 * @file validateUser.js
 * @description Middleware para validar los datos de entrada en el registro y inicio de sesión de usuarios.
 * @module middlewares/validateUser
 */

// Importa el validador de datos para verificar el formato de los campos.
const { dataValidator } = require('../helpers/dataValidator');

// Importa el verificador de campos vacíos para asegurar que todos los campos requeridos estén presentes.
const emptyChecker = require('../helpers/emptyChecker');

/**
 * Crea una respuesta de error estandarizada.
 * @name _createErrorResponse
 * @function
 * @param {string} status - Estado de la respuesta (generalmente "error").
 * @param {number} code - Código de estado HTTP.
 * @param {string} message - Mensaje de error.
 * @param {Array<string>|null} [details=null] - Detalles adicionales del error (opcional).
 * @returns {Object} Respuesta de error estandarizada.
 * @example
 * // Ejemplo de uso:
 * const errorResponse = _createErrorResponse("error", 400, "Faltan datos.", ["name", "email"]);
 */
const _createErrorResponse = (status, code, message, details = null) => {
  return {
    status,
    code,
    response: {
      status: "error",
      message,
      ...(details && { details }) // Añade detalles solo si existen
    }
  };
};

/**
 * Middleware para validar los datos de registro de un usuario.
 * @name validateUser
 * @function
 * @param {Object} req - Objeto de solicitud HTTP. Contiene los datos enviados por el cliente.
 * @param {Object} res - Objeto de respuesta HTTP. Se utiliza para enviar la respuesta al cliente.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object|Function} - Devuelve una respuesta de error si la validación falla, o pasa al siguiente middleware si es exitosa.
 * @example
 * // Ejemplo de uso en una ruta de registro:
 * router.post('/register', validateUser, registerController.register);
 */
const validateUser = (req, res, next) => {
  // Extrae los datos del cuerpo de la solicitud.
  const data = req.body;

  // Verifica si los campos obligatorios están presentes.
  const empty = emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
  if (empty !== true) {
    const errorResponse = _createErrorResponse("error", 400, "Faltan datos.", empty);
    return res.status(errorResponse.code).send(errorResponse.response);
  }

  // Valida el formato de los datos.
  const validation = dataValidator(data);
  if (validation !== true) {
    const errorResponse = _createErrorResponse("error", 400, "Validación no pasada.", validation);
    return res.status(errorResponse.code).send(errorResponse.response);
  }

  // Si la validación es exitosa, pasa al siguiente middleware.
  next();
};

/**
 * Middleware para validar los datos de inicio de sesión de un usuario.
 * @name loginValidator
 * @function
 * @param {Object} req - Objeto de solicitud HTTP. Contiene los datos enviados por el cliente.
 * @param {Object} res - Objeto de respuesta HTTP. Se utiliza para enviar la respuesta al cliente.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object|Function} - Devuelve una respuesta de error si la validación falla, o pasa al siguiente middleware si es exitosa.
 * @example
 * // Ejemplo de uso en una ruta de inicio de sesión:
 * router.post('/login', loginValidator, loginController.login);
 */
const loginValidator = (req, res, next) => {
  // Extrae los datos del cuerpo de la solicitud.
  const data = req.body;

  // Verifica si los campos obligatorios están presentes.
  const empty = emptyChecker(data, ["login", "password", "page"]);
  if (empty !== true) {
    const errorResponse = _createErrorResponse("error", 400, "Faltan datos.", empty);
    return res.status(errorResponse.code).send(errorResponse.response);
  }

  // Si la validación es exitosa, pasa al siguiente middleware.
  next();
};

// Exporta los middlewares para que puedan ser utilizados en las rutas.
module.exports = {
  validateUser,
  loginValidator
};