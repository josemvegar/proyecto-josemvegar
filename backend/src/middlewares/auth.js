// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const { SECRET } = require("../helpers/jwt");

// Crear middleware
const authAdmin = (req, res, next) => {
    // Comprobar si llega la cabecera de autenticación
    if(!req.headers.token){
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación."
        });
    }

    // Limpiar token
    let token = req.headers.token.replace(/['"]+/g, "");  

    try{
        // Decodificar el token
        let payload = jwt.decode(token, SECRET);

        // Comprobar la expiración del token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token expirado."
            });
        }

        // Agregar datos del usuario a la request
        req.user = payload;

    }catch(error){
        return res.status(400).send({
            status: "error",
            message: "Token inválido."
        });
    }
    // Pasar a la ejecución de la acción.
    next();
};

module.exports = {
    authAdmin
}