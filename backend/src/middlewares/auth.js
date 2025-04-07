/**
 * @file auth.js
 * @description Middleware para autenticación y autorización de usuarios mediante tokens JWT.
 * @module middlewares/auth
 */

// Importa la librería jwt-simple para decodificar tokens JWT.
const jwt = require('jwt-simple');

// Importa la librería moment para manejar fechas y horas.
const moment = require('moment');

// Importa la clave secreta desde el módulo de JWT.
const { SECRET } = require('../helpers/jwt');

/**
 * Middleware para verificar la autenticación y autorización de un usuario.
 * @name auth
 * @function
 * @param {Array<string>} [roles=[]] - Roles permitidos para acceder a la ruta. Si está vacío, cualquier rol puede acceder.
 * @returns {Function} Middleware que verifica el token y los roles del usuario.
 * @example
 * // Ejemplo de uso:
 * // Ruta accesible solo por administradores.
 * router.get('/admin-only', auth(['role_admin']), adminController.action);
 *
 * // Ruta accesible por cualquier usuario autenticado.
 * router.get('/user-only', auth(), userController.action);
 */
const auth = (roles = []) => (req, res, next) => {

  if (!req.headers.token) {
    console.log("Usuario no autenticado, continuando sin requerir autenticación.");
    
  }

  // Verifica si el token está presente en las cabeceras de la solicitud.
  if (!req.headers.token) {
    if (roles.includes('optional')) {
      return next();
    }
    return res.status(403).send({
      status: 'error',
      message: 'La petición no tiene la cabecera de autenticación.',
    });
  }

  // Limpia el token de comillas adicionales.
  let token = req.headers.token.replace(/['"]+/g, '');

  try {
    // Decodifica el token para obtener el payload.
    const payload = jwt.decode(token, SECRET);

    // Verifica si el token ha expirado.
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: 'error',
        message: 'Token expirado.',
      });
    }

    // Verifica si el usuario tiene los roles necesarios para acceder a la ruta.
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).send({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción.',
      });
    }

    // Añade el payload del token a la solicitud para que esté disponible en los controladores.
    req.user = payload;

    // Pasa al siguiente middleware o controlador.
    next();
  } catch (error) {
    // Si ocurre un error al decodificar el token, se devuelve un mensaje de error.
    return res.status(400).send({
      status: 'error',
      message: 'Token inválido.',
    });
  }
};

// Exporta el middleware para que pueda ser utilizado en las rutas.
module.exports = auth;