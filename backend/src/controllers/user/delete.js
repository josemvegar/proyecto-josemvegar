/**
 * @file delete.js
 * @description Controlador para la eliminación de usuarios
 * @module controllers/user/delete
 */

const UserService = require("../../services/userService");

/**
 * Controlador para eliminar un usuario del sistema
 * @async
 * @function
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del usuario a eliminar
 * @param {Object} req.user - Usuario autenticado que realiza la acción
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise<Object>} Respuesta HTTP con el resultado de la operación
 * 
 * @throws {500} Error interno del servidor
 * 
 * @example
 * // Ejemplo de llamada:
 * DELETE /api/users/delete/12345
 * Headers: { Authorization: "Bearer token" }
 */
const _delete = async (req, res) => {
    try {
        const id = req.params.id;

        // Llama al servicio para eliminar el usuario
        const result = await UserService._delete(id, req.user);

        // Maneja la respuesta del servicio
        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        // Respuesta exitosa
        return res.status(200).send({
            status: "success",
            message: "Usuario eliminado.",
            ...result.response
        });

    } catch (error) {
        // Error inesperado
        console.error("Error en controlador _delete:", error);
        return res.status(500).send({
            status: "error",
            message: "Error interno al eliminar usuario.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    _delete
};