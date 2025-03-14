const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/Users");
const emptyChecker = require("../../helpers/emptyChecker");
const {dataValidator} = require("../../helpers/dataValidator");

const register = async (req, res) => {
    const data = req.body;

    let empty= emptyChecker(data, ["name", "nick", "email", "password", "role", "page"]);
    if ( empty != true){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos.",
            empty
        });
    }

    let validation = dataValidator(data);

    if(dataValidator != true){
        return res.status(400).send({
            status: "error",
            message: "Validación no pasada.",
            reasons: validation
        });
    }

    try{
        const userExist = await User.find({
            $and: [
                {
                    $or: [
                        { email: data.email },
                        { nick: data.nick }
                    ]
                },
                { page: data.page }
            ]
        }).exec();
    
        if(userExist.length > 0){
            return res.status(409).send({
                status: "error",
                message: "El usuario ya existe.",
            });
        }
    }catch(error){
        return res.status(500).send({
            status: "error",
            message: "Error al buscar usuario repetido."
        });
    }
    
    try{
        const userToStorage = new User(data);
        const userStoraged = await userToStorage.save();

        return res.status(200).send({
            status: "success",
            message: "Usuario registrado.",
            userStoraged
        });
    }catch(error){
        return res.status(500).send({
            status: "error",
            message: "Error al borrar usuario."
        });
    }

}

module.exports = {
    register
}