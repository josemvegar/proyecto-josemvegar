const express = require("express");
const UserService = require("../../services/userService");

const login = async (req, res) => {
    const data = req.body;

    try {
        const userLoggued = await UserService.login(data);
        if (userLoggued.status === "error"){
            return res.status(userLoggued.code).send(userLoggued.response);
        }
        return res.status(200).send({
            status: "success",
            message: "Inicio de sesión exitoso.",
            user: userLoggued.user,
            token: userLoggued.token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al iniciar sesión."
        });
    }
}

module.exports = {
    login
}