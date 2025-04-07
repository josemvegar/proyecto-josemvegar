/**
 * @file dataValidator.js
 * @description Módulo para validar los datos de entrada utilizando la librería Validator.
 * @module helpers/dataValidator
 */

// Importa la librería Validator para realizar validaciones de datos.
const validator = require('validator');

/**
 * Objeto que contiene las funciones de validación para cada campo.
 * @name validations
 * @type {Object}
 * @property {Function} name - Valida que el nombre tenga al menos 3 caracteres y sea alfanumérico.
 * @property {Function} surname - Valida que el apellido tenga al menos 3 caracteres y sea alfanumérico.
 * @property {Function} nick - Valida que el nick tenga al menos 3 caracteres y sea alfanumérico.
 * @property {Function} email - Valida que el correo electrónico tenga un formato válido.
 * @property {Function} password - Valida que la contraseña tenga al menos 8 caracteres y sea fuerte.
 * @property {Function} role - Valida que el rol sea uno de los permitidos: 'role_admin' o 'role_user'.
 * @property {Function} image - Valida que el nombre de la imagen sea alfanumérico.
 * @property {Function} imagePath - Valida que la ruta de la imagen sea alfanumérica.
 * @property {Function} created_at - Valida que la fecha tenga un formato válido.
 */
const validations = {
  name: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  surname: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  nick: (value) => validator.isLength(value, { min: 3 }) && validator.isAlphanumeric(value, 'es-ES'),
  email: (value) => validator.isEmail(value),
  password: (value) => validator.isLength(value, { min: 8 }) && validator.isStrongPassword(value),
  role: (value) => ['role_admin', 'role_client'].includes(value),
  image: (value) => validator.isAlphanumeric(value),
  imagePath: (value) => validator.isAlphanumeric(value),
  created_at: (value) => validator.isDate(value),
};

/**
 * Valida los datos de entrada según las reglas definidas en el objeto `validations`.
 * @name dataValidator
 * @function
 * @param {Object} data - Objeto que contiene los datos a validar.
 * @returns {Array|boolean} - Devuelve un array de mensajes de error si hay campos inválidos, o `true` si todos los campos son válidos.
 * @example
 * // Ejemplo de uso:
 * const data = { name: "Juan", email: "juan@example.com", password: "Password123" };
 * const result = dataValidator(data);
 * if (result !== true) {
 *   console.log("Errores de validación:", result);
 * } else {
 *   console.log("Datos válidos.");
 * }
 */
const dataValidator = (data) => {
  // Reduce los campos del objeto `data` a un array de mensajes de error.
  const reasons = Object.keys(data).reduce((acc, key) => {
    // Si el campo tiene una validación definida y no pasa la validación, se añade un mensaje de error.
    if (validations[key] && !validations[key](data[key])) {
      acc.push(`El campo ${key} no es válido.`);
    }
    return acc;
  }, []);

  // Si hay mensajes de error, se devuelven. De lo contrario, se devuelve `true`.
  return reasons.length > 0 ? reasons : true;
};

// Exporta la función `dataValidator` para que pueda ser utilizada en otros archivos.
module.exports = { dataValidator };