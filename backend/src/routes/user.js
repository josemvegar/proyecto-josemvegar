const express = require("express");
const loginController = require("../controllers/account/login");
const registerController = require("../controllers/account/register");
//const check = require("../middlewares/auth");

const router = express.Router();

//const userController = require("../controllers/user");

router.post("/register", registerController.register);
router.post("/login", loginController.login);

module.exports= router;