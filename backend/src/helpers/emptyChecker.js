/**
 * @file emptyChecker.js
 * @description Módulo para verificar si los campos obligatorios están presentes en los datos de entrada.
 * @module helpers/emptyChecker
 */

/**
 * Verifica si los campos obligatorios están presentes en los datos de entrada.
 * @name emptyChecker
 * @function
 * @param {Object} data - Objeto que contiene los datos a verificar.
 * @param {Array<string>} [fields=[]] - Array de nombres de campos obligatorios.
 * @returns {Array<string>|boolean} - Devuelve un array de mensajes de error si faltan campos, o `true` si todos los campos están presentes.
 * @example
 * // Ejemplo de uso:
 * const data = { name: "Juan", email: "juan@example.com" };
 * const requiredFields = ["name", "email", "password"];
 * const result = emptyChecker(data, requiredFields);
 * if (result !== true) {
 *   console.log("Campos faltantes:", result);
 * } else {
 *   console.log("Todos los campos están presentes.");
 * }
 */
const emptyChecker = (data, fields = []) => {
  // Filtra los campos obligatorios que no están presentes en el objeto `data`.
  const missingFields = fields.filter(field => !data.hasOwnProperty(field));

  // Si hay campos faltantes, se devuelve un array de mensajes de error.
  if (missingFields.length > 0) {
    return missingFields.map(field => `Falta el campo: ${field}`);
  }

  // Si no hay campos faltantes, se devuelve `true`.
  return true;
};

// Exporta la función `emptyChecker` para que pueda ser utilizada en otros archivos.
module.exports = emptyChecker;