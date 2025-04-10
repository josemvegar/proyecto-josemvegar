/**
 * @file listing.js
 * @description Controlador para el listado de usuarios (paginado y detalle individual)
 * @module controllers/user/listing
 */

const UserService = require("../../services/userService");

/**
 * Controlador para listado paginado de usuarios
 * @async
 * @function
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} [req.params.page] - Número de página para paginación (opcional)
 * @param {Object} req.user - Usuario autenticado
 * @param {string} req.user.page - Página asociada al usuario
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise<Object>} Respuesta HTTP con listado de usuarios
 * 
 * @throws {500} Error interno del servidor
 * 
 * @example
 * // Ejemplo de llamada:
 * GET /api/users/list/2
 * Headers: { Authorization: "Bearer token" }
 */
const list = async (req, res) => {
    try {
        const paginationPage = req.params.page || 1;

        const result = await UserService.list(req.user.page, paginationPage);

        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        return res.status(200).send({
            status: "success",
            message: "Listado de usuarios",
            ...result.response
        });

    } catch (error) {
        console.error("Error en controlador list:", error);
        return res.status(500).send({
            status: "error",
            message: "Error interno al listar usuarios",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Controlador para obtener detalles de un usuario específico
 * @async
 * @function
 * @param {Object} req - Objeto de petición HTTP
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} [req.params.id] - ID del usuario a consultar (opcional)
 * @param {Object} [req.user] - Usuario autenticado (opcional para rutas públicas)
 * @param {string} [req.user.id] - ID del usuario autenticado
 * @param {string} [req.user.page] - Página asociada al usuario
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {Promise<Object>} Respuesta HTTP con detalles del usuario
 * 
 * @throws {400} Si no se proporciona ID y no hay usuario autenticado
 * @throws {500} Error interno del servidor
 * 
 * @example
 * // Ejemplo de llamada con ID:
 * GET /api/users/one/12345
 * 
 * // Ejemplo de llamada sin ID (obtiene usuario actual):
 * GET /api/users/one
 * Headers: { Authorization: "Bearer token" }
 */
const one = async (req, res) => {
    try {
        let id = req.params.id;
        const page = req.user ? req.user.page : 'role_client';

        if (!id && !req.user) {
            return res.status(400).send({
                status: 'error',
                message: 'Debe proporcionar un ID de usuario o estar autenticado'
            });
        } else if (!id && req.user) {
            id = req.user.id;
        }

        const result = await UserService.list(page, undefined, id);

        if (result.status === "error") {
            return res.status(result.code).send(result.response);
        }

        return res.status(200).send({
            status: "success",
            data: result.response.user || result.response.users
        });

    } catch (error) {
        console.error("Error en controlador one:", error);
        return res.status(500).send({
            status: "error",
            message: "Error interno al obtener usuario",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {
    list,
    one
};