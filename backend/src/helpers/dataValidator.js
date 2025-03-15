const validator = require('validator');

const validations = {
  name: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  surname: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  nick: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  email: (value) => validator.isEmail(value),
  password: (value) => validator.isLength(value, { min: 8 }) && validator.isStrongPassword(value),
  role: (value) => ['role_admin', 'role_user'].includes(value),
  image: (value) => validator.isAlphanumeric(value),
  imagePath: (value) => validator.isAlphanumeric(value),
  created_at: (value) => validator.isDate(value),
};

const dataValidator = (data) => {
  const reasons = Object.keys(data).reduce((acc, key) => {
    if (validations[key] && !validations[key](data[key])) {
      acc.push(`El campo ${key} no es válido.`);
    }
    return acc;
  }, []);

  return reasons.length > 0 ? reasons : true;
};

module.exports = { dataValidator };