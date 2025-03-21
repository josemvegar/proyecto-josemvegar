/**
 * @file errorHandler.js
 * @description Middleware para manejar errores globales de la aplicación.
 * @module middlewares/errorHandler
 */

/**
 * Middleware para manejar errores globales.
 * @name errorHandler
 * @function
 * @param {Error} err - Objeto de error.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {Object} Respuesta JSON con el estado y mensaje de error.
 * @example
 * // Ejemplo de uso en Express:
 * app.use(errorHandler);
 *
 * // Si ocurre un error en cualquier ruta, se manejará aquí.
 */
const errorHandler = (err, req, res, next) => {
  // Registra el error en la consola para depuración.
  console.error(err.stack);

  // Envía una respuesta de error al cliente.
  res.status(500).send({
    status: "error",
    message: err.message || "Error interno del servidor.",
  });
};

// Exporta el middleware para que pueda ser utilizado en la aplicación.
module.exports = errorHandler;