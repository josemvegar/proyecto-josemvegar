/**
 * @file user.js
 * @description Define las rutas relacionadas con usuarios (registro, login, etc.).
 * @module routes/user
 */

const express = require("express");
const loginController = require("../controllers/account/login");
const registerController = require("../controllers/account/register");
const validateUser = require('../middlewares/validateUser');
//const check = require("../middlewares/auth");

const router = express.Router();

//const userController = require("../controllers/user");

router.post("/register", validateUser, registerController.register);
router.post("/login", loginController.login);

module.exports= router;