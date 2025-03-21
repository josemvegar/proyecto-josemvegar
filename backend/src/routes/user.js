/**
 * @file user.js
 * @description Define las rutas relacionadas con usuarios (registro, login, etc.).
 * @module routes/user
 */

// Importa el framework Express para crear rutas.
const express = require("express");

// Importa el controlador de login para manejar las solicitudes de inicio de sesión.
const loginController = require("../controllers/account/login");

// Importa el controlador de registro para manejar las solicitudes de registro de usuarios.
const registerController = require("../controllers/account/register");

// Importa el middleware de validación para verificar los datos de entrada.
const validateUser = require('../middlewares/validateUser');

// Importa el middleware de autenticación para proteger rutas.
const auth = require("../middlewares/auth");

// Crea un enrutador de Express para definir las rutas.
const router = express.Router();

/**
 * Ruta para registrar un nuevo usuario.
 * @name post/register
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
router.post("/register", validateUser.validateUser, registerController.register);

/**
 * Ruta para iniciar sesión.
 * @name post/login
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
router.post("/login", validateUser.loginValidator, loginController.login);

// Exporta el enrutador para que pueda ser utilizado en otros archivos.
module.exports = router;