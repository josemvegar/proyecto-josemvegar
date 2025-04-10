/**
 * @file update.js
 * @description Controlador para la actualización de información de usuarios
 * @module controllers/user/update
 */

const UserService = require("../../services/userService");

/**
 * Controlador para actualizar la información de un usuario
 * @async
 * @function
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} [req.params.id] - ID del usuario a actualizar (opcional)
 * @param {Object} req.body - Datos a actualizar del usuario
 * @param {Object} req.user - Usuario autenticado que realiza la acción
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {string} req.user.role - Rol del usuario autenticado
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise<Object>} Respuesta HTTP con el resultado de la operación
 * 
 * @throws {400} Si no se proporcionan datos válidos para actualizar
 * @throws {403} Si el usuario no tiene permisos para actualizar
 * @throws {404} Si el usuario no existe
 * @throws {500} Error interno del servidor
 * 
 * @example
 * // Ejemplo de llamada para actualizar usuario propio:
 * PUT /api/users/update
 * Headers: { Authorization: "Bearer token" }
 * Body: { name: "Nuevo nombre", email: "nuevo@email.com" }
 * 
 * @example
 * // Ejemplo de llamada para admin actualizar otro usuario:
 * PUT /api/users/update/12345
 * Headers: { Authorization: "Bearer token" }
 * Body: { role: "role_admin" }
 */
const update = async (req, res) => {
    try {
        const data = req.body;
        let id = req.params.id || req.user.id;

        // Validación básica de datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send({
                status: 'error',
                message: 'No se proporcionaron datos para actualizar'
            });
        }

        const result = await UserService.update(id, req.user, data);

        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: result.response.user,
            token: result.response.token
        });

    } catch (error) {
        console.error('Error en controlador update:', error);
        return res.status(500).send({
            status: "error",
            message: "Error interno al actualizar usuario",
            ...(process.env.NODE_ENV === 'development' && { 
                details: error.message,
                stack: error.stack 
            })
        });
    }
};

module.exports = {
    update
};