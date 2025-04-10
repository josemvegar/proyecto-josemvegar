/**
 * @file auth.js
 * @description Middleware para autenticación y autorización de usuarios mediante JWT
 * @module middlewares/auth
 */

const jwt = require('jwt-simple');
const moment = require('moment');
const { SECRET } = require('../helpers/jwt');

/**
 * Middleware de autenticación y control de acceso por roles
 * @function
 * @param {Array<string>} [roles=[]] - Lista de roles permitidos (opcional)
 * @returns {Function} Middleware de autenticación
 * @throws {403} Si no se proporciona token y no es ruta opcional
 * @throws {401} Si el token ha expirado
 * @throws {403} Si el usuario no tiene los permisos requeridos
 * @throws {400} Si el token es inválido
 * 
 * @example
 * // Uso básico (cualquier usuario autenticado)
 * router.get('/ruta', auth(), controller);
 * 
 * // Solo para administradores
 * router.get('/admin', auth(['role_admin']), adminController);
 * 
 * // Ruta opcional (no requiere autenticación)
 * router.get('/public', auth(['optional']), publicController);
 */
const auth = (roles = []) => {
  /**
   * Middleware que verifica el token JWT y los roles del usuario
   * @param {Object} req - Objeto de petición HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   * @param {Function} next - Función para pasar al siguiente middleware
   */
  return (req, res, next) => {
    // Verificar si la ruta es opcional y no tiene token
    if (!req.headers.token) {
      if (roles.includes('optional')) {
        return next();
      }
      return res.status(403).send({
        status: 'error',
        message: 'La petición no tiene la cabecera de autenticación.',
      });
    }

    try {
      // Limpiar y decodificar el token
      const token = req.headers.token.replace(/['"]+/g, '');
      const payload = jwt.decode(token, SECRET);

      // Verificar expiración del token
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({
          status: 'error',
          message: 'Token expirado.',
        });
      }

      // Verificar roles autorizados
      if (roles.length > 0 && !roles.includes('optional') && !roles.includes(payload.role)) {
        return res.status(403).send({
          status: 'error',
          message: 'No tienes permisos para realizar esta acción.',
        });
      }

      // Adjuntar información del usuario a la petición
      req.user = payload;
      next();
      
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Token inválido.',
        details: error.message
      });
    }
  };
};

module.exports = auth;