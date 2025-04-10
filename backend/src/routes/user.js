/**
 * @file user.js
 * @description Define las rutas relacionadas con la gestión de usuarios (registro, autenticación, CRUD).
 * @module routes/user
 */

const express = require("express");
const loginController = require("../controllers/account/login");
const registerController = require("../controllers/account/register");
const editController = require("../controllers/user/update");
const deleteController = require("../controllers/user/delete");
const listingController = require("../controllers/user/listing");
const validateUser = require('../middlewares/validateUser');
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * @typedef {Object} UserRoute
 * @property {function} register - Ruta para registro de nuevos usuarios
 * @property {function} login - Ruta para autenticación de usuarios
 * @property {function} update - Ruta para actualización de datos de usuario
 * @property {function} delete - Ruta para eliminación de usuarios
 * @property {function} list - Ruta para listado paginado de usuarios
 * @property {function} one - Ruta para obtener un usuario específico
 */

/**
 * Ruta para registro de nuevos usuarios
 * @name POST /register
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint
 * @param {function} middleware - Validador de datos de usuario
 * @param {function} controller - Controlador de registro
 */
router.post(
  "/register", 
  validateUser.validateUser, 
  registerController.register
);

/**
 * Ruta para autenticación de usuarios
 * @name POST /login
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint
 * @param {function} middleware - Validador de credenciales
 * @param {function} controller - Controlador de autenticación
 */
router.post(
  "/login", 
  validateUser.loginValidator, 
  loginController.login
);

/**
 * Ruta para actualización de datos de usuario
 * @name PUT /update/:id?
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint con parámetro opcional de ID
 * @param {function} middleware - Middleware de autenticación (admin o cliente)
 * @param {function} controller - Controlador de actualización
 */
router.put(
  "/update/:id?", 
  auth(['role_admin', 'role_client']), 
  editController.update
);

/**
 * Ruta para eliminación de usuarios
 * @name DELETE /delete/:id
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint con parámetro de ID
 * @param {function} middleware - Middleware de autenticación (solo admin)
 * @param {function} controller - Controlador de eliminación
 */
router.delete(
  "/delete/:id", 
  auth(['role_admin']), 
  deleteController._delete
);

/**
 * Ruta para listado paginado de usuarios
 * @name GET /list/:page?
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint con parámetro opcional de página
 * @param {function} middleware - Middleware de autenticación (solo admin)
 * @param {function} controller - Controlador de listado
 */
router.get(
  "/list/:page?", 
  auth(['role_admin']), 
  listingController.list
);

/**
 * Ruta para obtener un usuario específico
 * @name GET /one/:id?
 * @function
 * @memberof UserRoute
 * @param {string} path - Ruta del endpoint con parámetro opcional de ID
 * @param {function} middleware - Middleware de autenticación (admin, cliente o opcional)
 * @param {function} controller - Controlador de obtención de usuario
 */
router.get(
  "/one/:id?", 
  auth(['role_admin', 'role_client', 'optional']), 
  listingController.one
);

module.exports = router;