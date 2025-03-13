const express = require("express");

const login = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Ruta de login"
    });
}

module.exports = {
    login
}