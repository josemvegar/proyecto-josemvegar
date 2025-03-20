const jwt = require('jwt-simple');
const moment = require('moment');
const { SECRET } = require('../helpers/jwt');

const auth = (roles = []) => (req, res, next) => {
  if (!req.headers.token) {
    return res.status(403).send({
      status: 'error',
      message: 'La petición no tiene la cabecera de autenticación.',
    });
  }

  let token = req.headers.token.replace(/['"]+/g, '');

  try {
    const payload = jwt.decode(token, SECRET);

    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: 'error',
        message: 'Token expirado.',
      });
    }

    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).send({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción.',
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(400).send({
      status: 'error',
      message: 'Token inválido.',
    });
  }
};

module.exports = auth;