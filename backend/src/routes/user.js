/**
 * @file user.js
 * @description Define las rutas relacionadas con usuarios (registro, login, etc.).
 * @module routes/user
 */

const express = require("express");
const loginController = require("../controllers/account/login");
const registerController = require("../controllers/account/register");
const validateUser = require('../middlewares/validateUser');
const auth  = require("../middlewares/auth");
//router.get('/admin-only', auth(['role_admin']), adminController.action);

const router = express.Router();

//const userController = require("../controllers/user");

router.post("/register", validateUser.validateUser, registerController.register);
router.post("/login", validateUser.loginValidator, loginController.login);

module.exports= router;